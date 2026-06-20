import { useInfiniteCanvas } from "@/hooks/use-canvas"
import TextSideBar from "./text-sideBar/TextSideBar"
import { cn } from "@/lib/utils"
import ShapeRenderer from "./shapes"
import { RectanglePreview } from "./shapes/rectangle/preview"
import { FramePreview } from "./shapes/frame/preview"
import { ElipsePreview } from "./shapes/elipse/preview"
import { ArrowPreview } from "./shapes/arrow/preview"
import { LinePreview } from "./shapes/line/preview"
import { FreeDrawStrokePreview } from "./shapes/stroke/preview"
import { SelectionOverlay } from "./shapes/selection"

type Props = {}
//todo: add inspiration and chat window
//TODO: add back all props to the renderer
const index = (props: Props) => {
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
        getDraftShape,
        getFreeDrawPoints,
        isSidebarOpen,
        hasSelectedText, getEraserRect,
    } = useInfiniteCanvas()

    const draftShape = getDraftShape()
    const freeDrawPoints = getFreeDrawPoints()

    return (
        <>
            <TextSideBar isOpen={isSidebarOpen && hasSelectedText} />
            {/* Inspitartion */}
            {/* ChatWindow */}

            <div
                ref={attachCanvasRef}
                role="application"
                aria-label="Infinite drawing canvas"
                className={cn(
                    'relative w-full h-full overflow-hidden select-none z-0',
                    {
                        'cursor-grabbing': viewport.mode === 'panning',
                        'cursor-grab': viewport.mode === 'shiftPanning',
                        'cursor-crosshair':
                            currentTool !== 'select' && viewport.mode === 'idle',
                        'cursor-default':
                            currentTool === 'select' && viewport.mode === 'idle',
                    }
                )}
                style={{ touchAction: 'none' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
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
                        const eraserRect = getEraserRect()
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
        </>
    )
}

export default index