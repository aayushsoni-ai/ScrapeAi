'use client'
import { downloadBlob, generateFrameSnapshot } from '@/lib/frame-snapshot';
import { handToolDisable, handToolEnable, panEnd, panMove, panStart, Point, screenToWorld, wheelPan, wheelZoom } from './../redux/slice/viewport/index';
import { addArrow, addEllipse, addFrame, addFreeDrawShape, addLine, addRect, addText, clearSelection, removeShape, selectShape, setTool, Shape, Tool, updateShape, FrameShape } from '@/redux/slice/shapes'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

interface TouchPointer {
    id: number
    p: Point

}

const RAF_INTERVAL_MS = 8

interface DraftShape {
    type: 'frame' | 'rect' | 'ellipse' | 'arrow' | 'line'
    startWorld: Point
    currentWorld: Point
}

export const useInfiniteCanvas = () => {
    const dispatch = useDispatch<AppDispatch>()

    const viewport = useAppSelector((s) => s.viewport)
    const entityState = useAppSelector((s) => s.shapes.shapes)
    const shapeList: Shape[] = entityState.ids
        .map((id: string) => entityState.entities[id])
        .filter((s: Shape | undefined): s is Shape => Boolean(s))

    const currentTool = useAppSelector((s) => s.shapes.tool)
    const selectedShapes = useAppSelector((s) => s.shapes.selected)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const shapesEntities = useAppSelector((state) => state.shapes.shapes.entities)

    const hasSelectedText = Object.keys(selectedShapes).some((id) => {
        const shape = shapesEntities[id]
        return shape?.type === 'text'
    })

    useEffect(() => {
        if (hasSelectedText && !isSidebarOpen) {
            setIsSidebarOpen(true)
        } else if (!hasSelectedText) {
            setIsSidebarOpen(false)
        }
    }, [hasSelectedText, isSidebarOpen])

    const canvasRef = useRef<HTMLDivElement | null>(null)
    const touchMapRef = useRef<Map<number, TouchPointer>>(new Map())

    const draftShapeRef = useRef<DraftShape | null>(null)
    const freeDrawPointsRef = useRef<Point[]>([])
    const isSpacePressed = useRef(false)
    const isDrawingRef = useRef(false)
    const isMovingRef = useRef(false)
    const moveStartRef = useRef<Point | null>(null)

    const initialShapePositionsRef = useRef<
        Record<
            string,
            {
                x?: number
                y?: number
                points?: Point[]
                startX?: number
                startY?: number
                endX?: number
                endY?: number
            }
        >
    >({})

    const isErasingRef = useRef(false)
    const erasedShapesRef = useRef<Set<string>>(new Set())
    const eraserStartRef = useRef<Point | null>(null)
    const eraserCurrentRef = useRef<Point | null>(null)
    const isResizingRef = useRef(false)
    const resizeDataRef = useRef<{
        shapeId: string
        corner: string
        initialBounds: { x: number; y: number; w: number; h: number }
        startPoint: { x: number; y: number }
    } | null>(null)

    const lastFreehandFrameRef = useRef(0)
    const freehandRafRef = useRef<number | null>(null)
    const panRafRef = useRef<number | null>(null)
    const pendingPanPointRef = useRef<Point | null>(null)

    const [, force] = useState(0)
    const requestRender = (): void => {
        force((n) => (n + 1) | 0)
    }

    const localPointFromClient = (clientX: number, clientY: number): Point => {
        const el = canvasRef.current
        if (!el) return { x: clientX, y: clientY }
        const r = el.getBoundingClientRect()
        return { x: clientX - r.left, y: clientY - r.top }
    }

    const blurActiveTextInput = () => {
        const activeElement = document.activeElement
        if (activeElement && activeElement.tagName === 'INPUT') {
            ; (activeElement as HTMLInputElement).blur()
        }
    }


    type WithClientXY = { clientX: number; clientY: number }
    const getLocalPointFromPtr = (e: WithClientXY): Point =>
        localPointFromClient(e.clientX, e.clientY)


    const getShapeArea = (shape: Shape): number => {
        switch (shape.type) {
            case 'frame':
            case 'rect':
            case 'ellipse':
            case 'generatedui':
                return shape.w * shape.h
            case 'text':
                const textWidth = Math.max(shape.text.length * (shape.fontSize * 0.6), 100)
                const textHeight = shape.fontSize * 1.2
                return textWidth * textHeight
            case 'freedraw':
                if (shape.points.length === 0) return 0
                const xs = shape.points.map((p) => p.x)
                const ys = shape.points.map((p) => p.y)
                const w = Math.max(...xs) - Math.min(...xs)
                const h = Math.max(...ys) - Math.min(...ys)
                return w * h
            case 'line':
            case 'arrow':
                return 1
            default:
                return Infinity
        }
    }

    const getShapeAtPoint = (worldPoint: Point): Shape | null => {
        const candidates: Shape[] = []
        for (let i = shapeList.length - 1; i >= 0; i--) {
            const shape = shapeList[i]
            if (isPointInShape(worldPoint, shape)) {
                candidates.push(shape)
            }
        }
        if (candidates.length === 0) return null

        candidates.sort((a, b) => getShapeArea(a) - getShapeArea(b))

        return candidates[0]
    }

    const isPointInShape = (point: Point, shape: Shape): boolean => {
        switch (shape.type) {
            case 'frame':
            case 'rect':
            case 'ellipse':
            case 'generatedui':
                return (
                    point.x >= shape.x &&
                    point.x <= shape.x + shape.w &&
                    point.y >= shape.y &&
                    point.y <= shape.y + shape.h
                )
            case 'freedraw':
                const threshold = 5
                for (let i = 0; i < shape.points.length - 1; i++) {
                    const p1 = shape.points[i]
                    const p2 = shape.points[i + 1]
                    if (distanceToLineSegment(point, p1, p2) <= threshold) {
                        return true
                    }
                }
                return false
            case 'arrow':
            case 'line':
                const lineThreshold = 8
                return (distanceToLineSegment(point, { x: shape.startX, y: shape.startY }, { x: shape.endX, y: shape.endY }) <= lineThreshold)
            case 'text':
                const textWidth = Math.max(shape.text.length * (shape.fontSize * 0.6), 100)
                const textHeight = shape.fontSize * 1.2
                const padding = 8
                return (
                    point.x >= shape.x - 2 &&
                    point.x <= shape.x + textWidth + padding + 2 &&
                    point.y >= shape.y - 2 &&
                    point.y <= shape.y + textHeight + padding + 2
                )

            default:
                return false
        }
    }

    const distanceToLineSegment = (
        point: Point,
        lineStart: Point,
        lineEnd: Point,
    ): number => {
        const A = point.x - lineStart.x
        const B = point.y - lineStart.y
        const C = lineEnd.x - lineStart.x
        const D = lineEnd.y - lineStart.y

        const dot = A * C + B * D

        const lenSq = C * C + D * D

        let param = -1
        if (lenSq !== 0) {
            param = dot / lenSq
        }

        let xx, yy
        if (param < 0) {
            xx = lineStart.x,
                yy = lineStart.y
        }
        else if (param > 1) {
            xx = lineEnd.x, yy = lineEnd.y
        }
        else {
            xx = lineStart.x + param * C,
                yy = lineStart.y + param * D
        }

        const dx = point.x - xx
        const dy = point.y - yy

        return Math.sqrt(dx * dx + dy * dy)

    }

    // Check if a shape's bounding box intersects an eraser selection rectangle
    const doesShapeIntersectRect = (shape: Shape, rect: { x: number; y: number; w: number; h: number }): boolean => {
        let sx: number, sy: number, sw: number, sh: number
        switch (shape.type) {
            case 'frame':
            case 'rect':
            case 'ellipse':
            case 'generatedui':
                sx = shape.x
                sy = shape.y
                sw = shape.w
                sh = shape.h
                break
            case 'text':
                sx = shape.x - 2
                sy = shape.y - 2
                sw = Math.max(shape.text.length * (shape.fontSize * 0.6), 100) + 12
                sh = (shape.fontSize * 1.2) + 12
                break
            case 'freedraw':
                if (shape.points.length === 0) return false
                const xs = shape.points.map((p) => p.x)
                const ys = shape.points.map((p) => p.y)
                sx = Math.min(...xs)
                sy = Math.min(...ys)
                sw = Math.max(...xs) - sx
                sh = Math.max(...ys) - sy
                break
            case 'arrow':
            case 'line':
                sx = Math.min(shape.startX, shape.endX)
                sy = Math.min(shape.startY, shape.endY)
                sw = Math.abs(shape.endX - shape.startX)
                sh = Math.abs(shape.endY - shape.startY)
                break
            default:
                return false
        }
        // AABB overlap test
        return !(sx + sw < rect.x || sx > rect.x + rect.w || sy + sh < rect.y || sy > rect.y + rect.h)
    }

    // Check if a shape is fully inside a frame
    const isShapeInsideFrame = (shape: Shape, frame: FrameShape): boolean => {
        if (shape.id === frame.id) return false
        switch (shape.type) {
            case 'frame':
            case 'rect':
            case 'ellipse':
            case 'generatedui':
                return (
                    shape.x >= frame.x &&
                    shape.x + shape.w <= frame.x + frame.w &&
                    shape.y >= frame.y &&
                    shape.y + shape.h <= frame.y + frame.h
                )
            case 'text':
                const textWidth = Math.max(shape.text.length * (shape.fontSize * 0.6), 100)
                const textHeight = shape.fontSize * 1.2
                return (
                    shape.x >= frame.x &&
                    shape.x + textWidth <= frame.x + frame.w &&
                    shape.y >= frame.y &&
                    shape.y + textHeight <= frame.y + frame.h
                )
            case 'freedraw':
                if (shape.points.length === 0) return false
                return shape.points.every(
                    (p) =>
                        p.x >= frame.x &&
                        p.x <= frame.x + frame.w &&
                        p.y >= frame.y &&
                        p.y <= frame.y + frame.h
                )
            case 'arrow':
            case 'line':
                return (
                    shape.startX >= frame.x &&
                    shape.startX <= frame.x + frame.w &&
                    shape.endX >= frame.x &&
                    shape.endX <= frame.x + frame.w &&
                    shape.startY >= frame.y &&
                    shape.startY <= frame.y + frame.h &&
                    shape.endY >= frame.y &&
                    shape.endY <= frame.y + frame.h
                )
            default:
                return false
        }
    }


    const schedulePanMove = (p: Point) => {
        pendingPanPointRef.current = p
        if (panRafRef.current != null) return
        panRafRef.current = window.requestAnimationFrame(() => {
            panRafRef.current = null
            const next = pendingPanPointRef.current
            if (next) dispatch(panMove(next))
        })
    }

    const freehandTick = (): void => {
        const now = performance.now()

        if (now - lastFreehandFrameRef.current >= RAF_INTERVAL_MS) {
            if (freeDrawPointsRef.current.length > 0) requestRender()
            lastFreehandFrameRef.current = now
        }
        if (isDrawingRef.current) {
            freehandRafRef.current = window.requestAnimationFrame(freehandTick)
        }
    }

    const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        const originScreen = localPointFromClient(e.clientX, e.clientY)
        if (e.ctrlKey || e.metaKey) {
            dispatch(wheelZoom({ deltaY: e.deltaY, originScreen }))
        } else {
            const dx = e.shiftKey ? e.deltaY : e.deltaX
            const dy = e.shiftKey ? 0 : e.deltaY
            dispatch(wheelPan({ dx: -dx, dy: -dy }))
        }
    }

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const target = e.target as HTMLElement
        const isButton =
            target.tagName === 'BUTTON' ||
            target.closest('button') ||
            target.classList.contains('pointer-events-auto') ||
            target.closest('.pointer-events-auto')

        if (!isButton) {
            e.preventDefault()
        } else {
            console.log(
                '🖱️ Not preventing default - clicked on interactive element:',
                target
            )
            return // Don't handle canvas interactions when clicking buttons
        }

        const local = getLocalPointFromPtr(e.nativeEvent)
        const world = screenToWorld(local, viewport.translate, viewport.scale)

        if (touchMapRef.current.size <= 1) {
            canvasRef.current?.setPointerCapture?.(e.pointerId)
            const isPanButton = e.button === 1 || e.button === 2
            const panByShift = isSpacePressed.current && e.button === 0

            if (isPanButton || panByShift) {
                const mode = isSpacePressed.current ? 'shiftPanning' : 'panning'
                dispatch(panStart({ screen: local, mode }))
                return
            }

            if (e.button === 0) {
                if (currentTool === 'select') {
                    // find shape at world point
                    const hitShape = getShapeAtPoint(world)
                    if (hitShape) {
                        const isAlreadySelected = selectedShapes[hitShape.id]
                        if (!isAlreadySelected) {
                            if (!e.shiftKey) dispatch(clearSelection())
                            dispatch(selectShape(hitShape.id))
                        }
                        isMovingRef.current = true
                        moveStartRef.current = world

                        initialShapePositionsRef.current = {}
                        const shapesToMove = new Set<string>()
                        Object.keys(selectedShapes).forEach((id) => {
                            shapesToMove.add(id)
                        })
                        shapesToMove.add(hitShape.id)

                        // If any shape to move is a frame, find all shapes inside it
                        const allFrames: FrameShape[] = []
                        shapesToMove.forEach((id) => {
                            const shape = entityState.entities[id]
                            if (shape && shape.type === 'frame') {
                                allFrames.push(shape)
                            }
                        })

                        shapeList.forEach((shape) => {
                            allFrames.forEach((frame) => {
                                if (isShapeInsideFrame(shape, frame)) {
                                    shapesToMove.add(shape.id)
                                }
                            })
                        })

                        shapesToMove.forEach((id) => {
                            const shape = entityState.entities[id]
                            if (shape) {
                                if (
                                    shape.type === 'frame' ||
                                    shape.type === 'rect' ||
                                    shape.type === 'ellipse' ||
                                    shape.type === 'generatedui'
                                ) {
                                    initialShapePositionsRef.current[id] = {
                                        x: shape.x,
                                        y: shape.y,
                                    }
                                } else if (shape.type === 'freedraw') {
                                    initialShapePositionsRef.current[id] = {
                                        points: [...shape.points],
                                    }
                                } else if (shape.type === 'arrow' || shape.type === 'line') {
                                    initialShapePositionsRef.current[id] = {
                                        startX: shape.startX,
                                        startY: shape.startY,
                                        endX: shape.endX,
                                        endY: shape.endY,
                                    }
                                } else if (shape.type === 'text') {
                                    initialShapePositionsRef.current[id] = {
                                        x: shape.x,
                                        y: shape.y,
                                    }
                                }
                            }
                        })
                    } else {
                        if (!e.shiftKey) {
                            dispatch(clearSelection())
                            blurActiveTextInput()
                        }
                    }
                } else if (currentTool === 'eraser') {
                    isErasingRef.current = true
                    erasedShapesRef.current.clear()
                    const hitShape = getShapeAtPoint(world)
                    if (hitShape) {
                        dispatch(removeShape(hitShape.id))
                        erasedShapesRef.current.add(hitShape.id)
                        eraserStartRef.current = null
                    } else {
                        eraserStartRef.current = world
                        eraserCurrentRef.current = world
                        blurActiveTextInput()
                    }
                    requestRender()
                } else if (currentTool === 'text') {
                    dispatch(addText({ x: world.x, y: world.y }))
                    dispatch(setTool('select'))
                } else {
                    isDrawingRef.current = true
                    if (
                        currentTool === 'frame' ||
                        currentTool === 'rect' ||
                        currentTool === 'ellipse' ||
                        currentTool === 'arrow' ||
                        currentTool === 'line'
                    ) {
                        console.log('Starting to draw:', currentTool, 'at:', world)
                        draftShapeRef.current = {
                            type: currentTool,
                            startWorld: world,
                            currentWorld: world,
                        }
                        requestRender()
                    } else if (currentTool === 'freedraw') {
                        freeDrawPointsRef.current = [world]
                        lastFreehandFrameRef.current = performance.now()
                        freehandRafRef.current = window.requestAnimationFrame(freehandTick)
                        requestRender()
                    }
                }
            }
        }
    }

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const local = getLocalPointFromPtr(e.nativeEvent)
        const world = screenToWorld(local, viewport.translate, viewport.scale)

        if (viewport.mode === 'panning' || viewport.mode === 'shiftPanning') {
            schedulePanMove(local)
            return
        }

        if (isErasingRef.current && currentTool === 'eraser') {
            if (eraserStartRef.current) {
                // Area selection mode: update the rectangle
                eraserCurrentRef.current = world
                requestRender()
            } else {
                const hitShape = getShapeAtPoint(world)
                if (hitShape && !erasedShapesRef.current.has(hitShape.id)) {
                    // Delete the shape if we haven't already deleted it in this drag
                    dispatch(removeShape(hitShape.id))
                    erasedShapesRef.current.add(hitShape.id)
                }
            }
        }
        if (
            isMovingRef.current &&
            moveStartRef.current &&
            currentTool === 'select'
        ) {
            const deltaX = world.x - moveStartRef.current.x
            const deltaY = world.y - moveStartRef.current.y

            Object.keys(initialShapePositionsRef.current).forEach((id) => {
                const initialPos = initialShapePositionsRef.current[id]
                const shape = entityState.entities[id]
                // if (!shape) return
                if (shape && initialPos) {
                    if (shape.type === 'frame' || shape.type === 'rect' || shape.type === 'ellipse' || shape.type === 'generatedui') {
                        if (typeof initialPos.x === 'number' && typeof initialPos.y === 'number') {
                            dispatch(updateShape({
                                id,
                                patch: {

                                    x: initialPos.x + deltaX,
                                    y: initialPos.y + deltaY,
                                },
                            })
                            )
                        }
                    }
                    else if (shape.type === 'freedraw') {
                        const initialPoints = initialPos.points
                        if (initialPoints) {
                            const newPoints = initialPoints.map((p: Point) => {
                                return {
                                    x: p.x + deltaX,
                                    y: p.y + deltaY,
                                }
                            })
                            dispatch(updateShape({
                                id,
                                patch: {
                                    points: newPoints,
                                },
                            })
                            )
                        }

                    } else if (shape.type === 'arrow' || shape.type === 'line') {
                        if (

                            typeof initialPos.startX === 'number' && typeof initialPos.startY === 'number' && typeof initialPos.endX === 'number' && typeof initialPos.endY === 'number'
                        ) {

                            dispatch(updateShape({
                                id,
                                patch: {
                                    startX: initialPos.startX + deltaX,
                                    startY: initialPos.startY + deltaY,
                                    endX: initialPos.endX + deltaX,
                                    endY: initialPos.endY + deltaY,
                                },
                            })
                            )
                        }
                    } else if (shape.type === "text") {
                        if (
                            typeof initialPos.x === 'number' && typeof initialPos.y === 'number'
                        ) {

                            dispatch(updateShape({
                                id,
                                patch: {

                                    x: initialPos.x + deltaX,
                                    y: initialPos.y + deltaY,
                                },
                            }))
                        }
                    }
                }

            })
        }
        if (isDrawingRef.current) {
            if (draftShapeRef.current) {
                draftShapeRef.current.currentWorld = world
                requestRender()
            }
            else if (currentTool === 'freedraw') {
                freeDrawPointsRef.current.push(world)
            }
        }

    }

    const finalizeDrawingIfAny = (): void => {
        if (!isDrawingRef.current) return
        isDrawingRef.current = false

        if (freehandRafRef.current) {
            window.cancelAnimationFrame(freehandRafRef.current)
            freehandRafRef.current = null
        }

        const draft = draftShapeRef.current
        if (draft) {
            const x = Math.min(draft.startWorld.x, draft.currentWorld.x)
            const y = Math.min(draft.startWorld.y, draft.currentWorld.y)
            const w = Math.abs(draft.currentWorld.x - draft.startWorld.x)
            const h = Math.abs(draft.currentWorld.y - draft.startWorld.y)
            const isLineOrArrow = draft.type === 'line' || draft.type === 'arrow'
            const hasSize = isLineOrArrow ? (w > 1 || h > 1) : (w > 1 && h > 1)
            if (hasSize) {
                if (draft.type === 'frame') {
                    console.log('Adding frame shape:', { x, y, w, h })
                    dispatch(addFrame({ x, y, w, h }))
                } else if (draft.type === 'rect') {
                    dispatch(addRect({ x, y, w, h }))
                } else if (draft.type === 'ellipse') {
                    dispatch(addEllipse({ x, y, w, h }))
                } else if (draft.type === 'arrow') {
                    dispatch(
                        addArrow({
                            startX: draft.startWorld.x,
                            startY: draft.startWorld.y,
                            endX: draft.currentWorld.x,
                            endY: draft.currentWorld.y,
                        })
                    )
                } else if (draft.type === 'line') {
                    dispatch(
                        addLine({
                            startX: draft.startWorld.x,
                            startY: draft.startWorld.y,
                            endX: draft.currentWorld.x,
                            endY: draft.currentWorld.y,
                        })
                    )
                }
            }
            draftShapeRef.current = null
        }
        else if (currentTool === 'freedraw') {
            const pts = freeDrawPointsRef.current
            if (pts.length > 1) {
                dispatch(addFreeDrawShape({ points: pts }))
                freeDrawPointsRef.current = []
            }
        }
        requestRender()
    }

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
        canvasRef.current?.releasePointerCapture?.(e.pointerId)

        if (viewport.mode === 'panning' || viewport.mode === 'shiftPanning') {
            dispatch(panEnd())
        }

        if (isMovingRef.current) {
            isMovingRef.current = false
            moveStartRef.current = null
            initialShapePositionsRef.current = {}
        }

        if (isErasingRef.current) {
            // If we have an area selection rect, erase all shapes inside it
            if (eraserStartRef.current && eraserCurrentRef.current) {
                const x1 = Math.min(eraserStartRef.current.x, eraserCurrentRef.current.x)
                const y1 = Math.min(eraserStartRef.current.y, eraserCurrentRef.current.y)
                const w = Math.abs(eraserCurrentRef.current.x - eraserStartRef.current.x)
                const h = Math.abs(eraserCurrentRef.current.y - eraserStartRef.current.y)
                if (w > 1 && h > 1) {
                    const rect = { x: x1, y: y1, w, h }
                    // Erase all shapes that intersect this rect
                    shapeList.forEach((shape) => {
                        if (doesShapeIntersectRect(shape, rect)) {
                            dispatch(removeShape(shape.id))
                        }
                    })
                }
            }
            isErasingRef.current = false
            erasedShapesRef.current.clear()
            eraserStartRef.current = null
            eraserCurrentRef.current = null
            requestRender()
        }

        finalizeDrawingIfAny()
    }

    const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
        onPointerUp(e)
    }

    const onKeyDown = (e: KeyboardEvent): void => {
        if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.repeat) {
            e.preventDefault()
            isSpacePressed.current = true // Keep the same ref name for consistency
            dispatch(handToolEnable())
        }
    }

    const onKeyUp = (e: KeyboardEvent): void => {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            e.preventDefault()
            isSpacePressed.current = false
            dispatch(handToolDisable())
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('keyup', onKeyUp)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('keyup', onKeyUp)
            if (freehandRafRef.current)
                window.cancelAnimationFrame(freehandRafRef.current)
            if (panRafRef.current) window.cancelAnimationFrame(panRafRef.current)
        }
    }, [])

    useEffect(() => {
        const handleResizeStart = (e: CustomEvent) => {
            const { shapeId, corner, bounds } = e.detail
            isResizingRef.current = true
            resizeDataRef.current = {
                shapeId,
                corner,
                initialBounds: bounds,
                startPoint: { x: e.detail.clientX || 0, y: e.detail.clientY || 0 },
            }
        }

        const handleResizeMove = (e: CustomEvent) => {
            if (!isResizingRef.current || !resizeDataRef.current) return
            const { shapeId, corner, initialBounds } = resizeDataRef.current
            const { clientX, clientY } = e.detail

            const canvasEl = canvasRef.current
            if (!canvasEl) return

            const rect = canvasEl.getBoundingClientRect()
            const localX = clientX - rect.left
            const localY = clientY - rect.top

            const world = screenToWorld({ x: localX, y: localY }, viewport.translate, viewport.scale)
            const shape = entityState.entities[shapeId]
            if (!shape) return

            const newBounds = { ...initialBounds }
            switch (corner) {
                case 'nw':
                    newBounds.w = Math.max(
                        10,
                        initialBounds.w + (initialBounds.x - world.x)
                    )
                    newBounds.h = Math.max(
                        10,
                        initialBounds.h + (initialBounds.y - world.y)
                    )
                    newBounds.x = world.x
                    newBounds.y = world.y
                    break

                case 'ne':
                    newBounds.w = Math.max(10, world.x - initialBounds.x)
                    newBounds.h = Math.max(
                        10,
                        initialBounds.h + (initialBounds.y - world.y)
                    )
                    newBounds.y = world.y
                    break

                case 'sw':
                    newBounds.w = Math.max(
                        10,
                        initialBounds.w + (initialBounds.x - world.x)
                    )
                    newBounds.h = Math.max(10, world.y - initialBounds.y)
                    newBounds.x = world.x
                    break

                case 'se':
                    newBounds.w = Math.max(10, world.x - initialBounds.x)
                    newBounds.h = Math.max(10, world.y - initialBounds.y)
                    break
            }
            if (
                shape.type === 'frame' ||
                shape.type === 'rect' ||
                shape.type === 'ellipse'
            ) {
                dispatch(
                    updateShape({
                        id: shapeId,
                        patch: {
                            x: newBounds.x,
                            y: newBounds.y,
                            w: newBounds.w,
                            h: newBounds.h,
                        },
                    })
                )
            } else if (shape.type === 'freedraw') {
                const xs = shape.points.map((p: { x: number; y: number }) => p.x)
                const ys = shape.points.map((p: { x: number; y: number }) => p.y)
                const actualMinX = Math.min(...xs)
                const actualMaxX = Math.max(...xs)
                const actualMinY = Math.min(...ys)
                const actualMaxY = Math.max(...ys)
                const actualWidth = actualMaxX - actualMinX
                const actualHeight = actualMaxY - actualMinY

                const newActualX = newBounds.x + 5 // Remove padding
                const newActualY = newBounds.y + 5
                const newActualWidth = Math.max(10, newBounds.w - 10) // Minimum size and remove padding
                const newActualHeight = Math.max(10, newBounds.h - 10)

                const scaleX = actualWidth > 0 ? newActualWidth / actualWidth : 1
                const scaleY = actualHeight > 0 ? newActualHeight / actualHeight : 1

                const scaledPoints = shape.points.map(
                    (point: { x: number; y: number }) => ({
                        x: newActualX + (point.x - actualMinX) * scaleX,
                        y: newActualY + (point.y - actualMinY) * scaleY,
                    })
                )
                dispatch(
                    updateShape({
                        id: shapeId,
                        patch: {
                            points: scaledPoints,
                        },
                    })
                )
            } else if (shape.type === 'line' || shape.type === 'arrow') {
                const actualMinX = Math.min(shape.startX, shape.endX)
                const actualMaxX = Math.max(shape.startX, shape.endX)
                const actualMinY = Math.min(shape.startY, shape.endY)
                const actualMaxY = Math.max(shape.startY, shape.endY)
                const actualWidth = actualMaxX - actualMinX
                const actualHeight = actualMaxY - actualMinY

                const newActualX = newBounds.x + 5
                const newActualY = newBounds.y + 5
                const newActualWidth = Math.max(10, newBounds.w - 10)
                const newActualHeight = Math.max(10, newBounds.h - 10)

                let newStartX, newStartY, newEndX, newEndY
                if (actualWidth === 0) {
                    newStartX = newActualX + newActualWidth / 2
                    newEndX = newActualX + newActualWidth / 2
                    newStartY = shape.startY < shape.endY ? newActualY : newActualY + newActualHeight
                    newEndY = shape.startY < shape.endY ? newActualY + newActualHeight : newActualY
                } else if (actualHeight === 0) {
                    newStartY = newActualY + newActualHeight / 2
                    newEndY = newActualY + newActualHeight / 2
                    newStartX = shape.startX < shape.endX ? newActualX : newActualX + newActualWidth
                    newEndX = shape.startX < shape.endX ? newActualX + newActualWidth : newActualX
                } else {
                    const scaleX = newActualWidth / actualWidth
                    const scaleY = newActualHeight / actualHeight

                    newStartX = newActualX + (shape.startX - actualMinX) * scaleX
                    newStartY = newActualY + (shape.startY - actualMinY) * scaleY
                    newEndX = newActualX + (shape.endX - actualMinX) * scaleX
                    newEndY = newActualY + (shape.endY - actualMinY) * scaleY
                }
                dispatch(
                    updateShape({
                        id: shapeId,
                        patch: {
                            startX: newStartX,
                            startY: newStartY,
                            endX: newEndX,
                            endY: newEndY,
                        },
                    })
                )

            } else if (shape.type === 'text') {
                // Scale font size proportionally based on height change
                const currentEstimatedH = shape.fontSize * (shape.lineHeight || 1.2)
                const scaleFactor = currentEstimatedH > 0 ? newBounds.h / currentEstimatedH : 1
                const newFontSize = Math.max(8, Math.min(200, Math.round(shape.fontSize * scaleFactor)))
                dispatch(
                    updateShape({
                        id: shapeId,
                        patch: {
                            x: newBounds.x,
                            y: newBounds.y,
                            fontSize: newFontSize,
                        },
                    })
                )
            }
        }
        const handleResizeEnd = () => {
            isResizingRef.current = false
            resizeDataRef.current = null
        }
        window.addEventListener(
            'shape-resize-start',
            handleResizeStart as EventListener
        )
        window.addEventListener(
            'shape-resize-move',
            handleResizeMove as EventListener
        )
        window.addEventListener(
            'shape-resize-end',
            handleResizeEnd as EventListener
        )
        return () => {
            window.removeEventListener(
                'shape-resize-start',
                handleResizeStart as EventListener
            )
            window.removeEventListener(
                'shape-resize-move',
                handleResizeMove as EventListener
            )
            window.removeEventListener(
                'shape-resize-end',
                handleResizeEnd as EventListener
            )
        }


    }, [dispatch, entityState.entities, viewport.translate, viewport.scale])

    const attachCanvasRef = (ref: HTMLDivElement | null): void => {
        // Clean up any existing event listeners on the old canvas
        if (canvasRef.current) {
            canvasRef.current.removeEventListener('wheel', onWheel)
        }

        // Store the new canvas reference
        canvasRef.current = ref

        // Add wheel event listener to the new canvas (for zoom/pan)
        if (ref) {
            ref.addEventListener('wheel', onWheel, { passive: false })
        }
    }

    const selectTool = (tool: Tool): void => {
        dispatch(setTool(tool))
    }



    return {
        viewport,
        shapes: shapeList,
        currentTool,
        selectedShapes,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        attachCanvasRef,
        selectTool,
        getDraftShape: () => draftShapeRef.current,
        getFreeDrawPoints: () => freeDrawPointsRef.current,
        getEraserRect: () => {
            if (!eraserStartRef.current || !eraserCurrentRef.current) return null
            return {
                x: Math.min(eraserStartRef.current.x, eraserCurrentRef.current.x),
                y: Math.min(eraserStartRef.current.y, eraserCurrentRef.current.y),
                w: Math.abs(eraserCurrentRef.current.x - eraserStartRef.current.x),
                h: Math.abs(eraserCurrentRef.current.y - eraserStartRef.current.y),
            }
        },
        isSidebarOpen,
        hasSelectedText,
        setIsSidebarOpen,
    }


}

export const useFrame = (shape: FrameShape) => {
    const dispatch = useDispatch()
    const [isGenerating, setIsGenerating] = useState(false)

    const allShapes = useAppSelector((state) => Object.values(state.shapes.shapes?.entities || {}).filter((shape): shape is Shape => shape !== undefined))



    const handleGenerateDesign = async () => {
        try {
            setIsGenerating(true)
            const snapshot = await generateFrameSnapshot(shape, allShapes)
            downloadBlob(snapshot, `frame-${shape.frameNumber}-snapshot.png`)


        } catch (error) {

        }
    }

    return {
        isGenerating, handleGenerateDesign
    }

}