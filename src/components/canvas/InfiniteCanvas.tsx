'use client'
import { useInfiniteCanvas } from '@/hooks/use-canvas'
import React, { useEffect, useRef } from 'react'
import TextSideBar from './text-sideBar/TextSideBar'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Shape } from '@/redux/slice/shapes'
import { Id } from '../../../convex/_generated/dataModel'
import ShapeRenderer from './shapes'
import { RectanglePreview } from "./shapes/rectangle/preview"
import { FramePreview } from "./shapes/frame/preview"
import { ElipsePreview } from "./shapes/elipse/preview"
import { ArrowPreview } from "./shapes/arrow/preview"
import { LinePreview } from "./shapes/line/preview"
import { FreeDrawStrokePreview } from "./shapes/stroke/preview"
import { SelectionOverlay } from "./shapes/selection"

type Props = {}

export default function InfiniteCanvas({ }: Props) {
    const searchParams = useSearchParams()
    const projectId = searchParams.get('project')

    const updateSketches = useMutation(api.projects.updateProjectSketches)
    const shapesState = useSelector((state: RootState) => state.shapes)
    const viewportState = useSelector((state: RootState) => state.viewport)

    const isInitializedRef = useRef(false)

    // Wait until initial data is loaded from ProjectProvider
    useEffect(() => {
        if (shapesState.shapes.ids.length > 0 || viewportState.scale !== 1 || viewportState.translate.x !== 0) {
            isInitializedRef.current = true
        }
    }, [shapesState.shapes.ids, viewportState.scale, viewportState.translate])

    // Debounced autosave to Convex
    useEffect(() => {
        if (!projectId || !isInitializedRef.current) return

        const handler = setTimeout(async () => {
            try {
                await updateSketches({
                    projectId: projectId as Id<'projects'>,
                    sketchesData: {
                        shapes: shapesState.shapes,
                        tool: shapesState.tool,
                        selected: shapesState.selected,
                        frameCounter: shapesState.frameCounter,
                    },
                    viewportData: {
                        scale: viewportState.scale,
                        translate: viewportState.translate,
                    }
                })
            } catch (err) {
                console.error('Autosave failed:', err)
            }
        }, 1500)

        return () => clearTimeout(handler)
    }, [shapesState, viewportState.scale, viewportState.translate, projectId, updateSketches])

    const {
        viewport,
        shapes,
        currentTool,
        selectedShapes,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        attachCanvasRef,
        isSidebarOpen,
        hasSelectedText,
        getDraftShape,
        getFreeDrawPoints,
        getEraserRect,
    } = useInfiniteCanvas()

    const draftShape = getDraftShape()
    const freeDrawPoints = getFreeDrawPoints()
    const eraserRect = getEraserRect()

    // Handle resizing start with custom event dispatcher
    const handleResizeStart = (e: React.MouseEvent, shape: Shape, corner: string) => {
        e.stopPropagation()
        e.preventDefault()

        const bounds = {
            x: 'x' in shape ? shape.x : ('startX' in shape ? Math.min(shape.startX, shape.endX) : 0),
            y: 'y' in shape ? shape.y : ('startY' in shape ? Math.min(shape.startY, shape.endY) : 0),
            w: 'w' in shape ? shape.w : ('startX' in shape ? Math.abs(shape.endX - shape.startX) : 0),
            h: 'h' in shape ? shape.h : ('startY' in shape ? Math.abs(shape.endY - shape.startY) : 0),
        }

        const startEvent = new CustomEvent('shape-resize-start', {
            detail: {
                shapeId: shape.id,
                corner,
                bounds,
                clientX: e.clientX,
                clientY: e.clientY,
            }
        })
        window.dispatchEvent(startEvent)

        const handleMouseMove = (moveEvent: PointerEvent) => {
            window.dispatchEvent(new CustomEvent('shape-resize-move', {
                detail: {
                    clientX: moveEvent.clientX,
                    clientY: moveEvent.clientY,
                }
            }))
        }

        const handleMouseUp = () => {
            window.dispatchEvent(new CustomEvent('shape-resize-end'))
            window.removeEventListener('pointermove', handleMouseMove)
            window.removeEventListener('pointerup', handleMouseUp)
        }

        window.addEventListener('pointermove', handleMouseMove)
        window.addEventListener('pointerup', handleMouseUp)
    }

    return (
        <div className="w-full h-full relative overflow-hidden select-none outline-none bg-[#09090b]">
            <TextSideBar isOpen={isSidebarOpen && hasSelectedText} />
            {/* Inspitartion */}
            {/* ChatWindow */}


            {/* Interactive Canvas Area */}
            <div
                ref={attachCanvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                className="w-full h-full relative overflow-hidden outline-none touch-none"
                style={{ cursor: currentTool === 'select' ? 'default' : 'crosshair' }}
            >
                {/* SVG/Radial Grid Background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 0)',
                        backgroundSize: `${24 * viewport.scale}px ${24 * viewport.scale}px`,
                        backgroundPosition: `${viewport.translate.x}px ${viewport.translate.y}px`,
                    }}
                />

                {/* Viewport content */}
                <div
                    className="absolute origin-top-left pointer-events-none z-10"
                    style={{
                        transform: `translate3d(${viewport.translate.x}px, ${viewport.translate.y}px, 0) scale(${viewport.scale})`,
                        transformOrigin: '0 0',
                        willChange: 'transform',
                    }}
                >
                    {shapes.map((shape) => (
                        <ShapeRenderer
                            key={shape.id}
                            shape={shape}
                        //  toggleInspiration={toggleInspiration}
                        //  toggleChat={toggleChat}
                        //  generateWorkflow={generateWorkflow}
                        //  exportDesign={exportDesign}
                        />
                    ))}

                    {shapes.map((shape) => (
                        <SelectionOverlay
                            key={`selection-${shape.id}`}
                            shape={shape}
                            isSelected={!!selectedShapes[shape.id]}
                        />
                    ))}

                    {draftShape && draftShape.type === 'frame' && (
                        <FramePreview
                            startWorld={draftShape.startWorld}
                            currentWorld={draftShape.currentWorld}
                        />
                    )}
                    {draftShape && draftShape.type === 'rect' && (
                        <RectanglePreview
                            startWorld={draftShape.startWorld}
                            currentWorld={draftShape.currentWorld}
                        />
                    )}
                    {draftShape && draftShape.type === 'ellipse' && (
                        <ElipsePreview
                            startWorld={draftShape.startWorld}
                            currentWorld={draftShape.currentWorld}
                        />
                    )}
                    {draftShape && draftShape.type === 'arrow' && (
                        <ArrowPreview
                            startWorld={draftShape.startWorld}
                            currentWorld={draftShape.currentWorld}
                        />
                    )}
                    {draftShape && draftShape.type === 'line' && (
                        <LinePreview
                            startWorld={draftShape.startWorld}
                            currentWorld={draftShape.currentWorld}
                        />
                    )}
                    {currentTool === 'freedraw' && freeDrawPoints.length > 1 && (
                        <FreeDrawStrokePreview
                            points={freeDrawPoints} />
                    )}

                    {/* Eraser Selection preview */}
                    {(() => {

                        if (!eraserRect) return null
                        return (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: eraserRect.x,
                                    top: eraserRect.y,
                                    width: eraserRect.w,
                                    height: eraserRect.h,
                                    border: '1.5px dashed #ef4444',
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                    pointerEvents: 'none',
                                }}
                            />
                        )
                    })()}
                </div>
            </div>
        </div>
    )
}

// Subcomponent to render resize handles
interface ResizeHandlesProps {
    shape: Shape
    onResizeStart: (e: React.MouseEvent, shape: Shape, corner: string) => void
}

function ResizeHandles({ shape, onResizeStart }: ResizeHandlesProps) {
    const handleClass = "absolute w-2 h-2 bg-white border border-blue-500 rounded-sm pointer-events-auto z-30 hover:scale-125 transition-transform"
    return (
        <>
            <div
                className={`${handleClass} -top-1 -left-1 cursor-nwse-resize`}
                onPointerDown={(e) => onResizeStart(e, shape, 'nw')}
            />
            <div
                className={`${handleClass} -top-1 -right-1 cursor-nesw-resize`}
                onPointerDown={(e) => onResizeStart(e, shape, 'ne')}
            />
            <div
                className={`${handleClass} -bottom-1 -left-1 cursor-nesw-resize`}
                onPointerDown={(e) => onResizeStart(e, shape, 'sw')}
            />
            <div
                className={`${handleClass} -bottom-1 -right-1 cursor-nwse-resize`}
                onPointerDown={(e) => onResizeStart(e, shape, 'se')}
            />
        </>
    )
}