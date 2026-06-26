'use client'
import { useGlobalChat, useInfiniteCanvas, useInspiration } from '@/hooks/use-canvas'
import React from 'react'
import TextSideBar from './text-sideBar/TextSideBar'
import { Shape } from '@/redux/slice/shapes'
import ShapeRenderer from './shapes'
import { RectanglePreview } from "./shapes/rectangle/preview"
import { FramePreview } from "./shapes/frame/preview"
import { ElipsePreview } from "./shapes/elipse/preview"
import { ArrowPreview } from "./shapes/arrow/preview"
import { LinePreview } from "./shapes/line/preview"
import { FreeDrawStrokePreview } from "./shapes/stroke/preview"
import { SelectionOverlay } from "./shapes/selection"
import InspirationSideBar from './shapes/inspiration-sidebar/InspirationSideBar'
import ChatWindow from './shapes/generatedui/ChatWindow'

type Props = {}

export default function InfiniteCanvas({ }: Props) {

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

    const { isInspirationOpen, closeInspiration, toggleInspiration } = useInspiration()
    const { isChatOpen, activeGeneratedUIId, generateWorkflow, exportDesign, toggleChat, closeChat } = useGlobalChat()
    const draftShape = getDraftShape()
    const freeDrawPoints = getFreeDrawPoints()
    const eraserRect = getEraserRect()


    return (
        <div className="w-full h-full relative overflow-hidden select-none outline-none bg-[#09090b]">
            <TextSideBar isOpen={isSidebarOpen && hasSelectedText} />

            {/* Inspitartion */}
            <InspirationSideBar isOpen={isInspirationOpen} onClose={closeInspiration} />

            {/* ChatWindow */}
            {
                activeGeneratedUIId && (
                    <ChatWindow
                        generatedUIId={activeGeneratedUIId}
                        isOpen={isChatOpen}
                        onClose={closeChat}
                    />
                )
            }


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
                            toggleInspiration={toggleInspiration}
                            toggleChat={toggleChat}
                            exportDesign={exportDesign}
                            generateWorkflow={generateWorkflow}
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