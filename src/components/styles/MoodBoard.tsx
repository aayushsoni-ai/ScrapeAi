'use client'
import React, { useRef } from 'react'
import { useMoodBoard, MoodBoardImages } from '@/hooks/use-styles'
import { cn } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'
import ImagesBoard from './ImagesBoard'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation'
import GenerateStyleGuideButton from '../button/style-guide/GenerateStyleGuideButton'

type Props = {
    guideImages: MoodBoardImages[]
}

const getMobileLayout = (index: number, total: number) => {
    const rotation = (index - (total - 1) / 2) * 5
    const xOffset = (index - (total - 1) / 2) * 6
    const yOffset = (index - (total - 1) / 2) * -3
    return { xOffset, yOffset, rotation }
}

const getDesktopLayout = (index: number, total: number) => {
    switch (total) {
        case 1:
            return { xOffset: 0, yOffset: 0, rotation: 0 }
        case 2:
            return index === 0
                ? { xOffset: -160, yOffset: -10, rotation: -8 }
                : { xOffset: 160, yOffset: 10, rotation: 8 }
        case 3:
            const layouts3 = [
                { xOffset: -240, yOffset: -20, rotation: -10 },
                { xOffset: 0, yOffset: 20, rotation: 6 },
                { xOffset: 240, yOffset: -10, rotation: -6 },
            ]
            return layouts3[index] || { xOffset: 0, yOffset: 0, rotation: 0 }
        case 4:
            const layouts4 = [
                { xOffset: -280, yOffset: -20, rotation: -12 },
                { xOffset: -90, yOffset: -50, rotation: 8 },
                { xOffset: 90, yOffset: 30, rotation: -6 },
                { xOffset: 280, yOffset: -10, rotation: 12 },
            ]
            return layouts4[index] || { xOffset: 0, yOffset: 0, rotation: 0 }
        default:
            const layouts5 = [
                { xOffset: -320, yOffset: -20, rotation: -12 },
                { xOffset: -160, yOffset: 20, rotation: 8 },
                { xOffset: 0, yOffset: -30, rotation: -6 },
                { xOffset: 160, yOffset: 30, rotation: 10 },
                { xOffset: 320, yOffset: -10, rotation: -8 },
            ]
            return layouts5[index % 5] || { xOffset: 0, yOffset: 0, rotation: 0 }
    }
}

const MoodBoard = ({ guideImages }: Props) => {
    const {
        images,
        dragActive,
        removeImage,
        handleDrag,
        handleDrop,
        handleFileInput,
        canAddMore
    } = useMoodBoard(guideImages)

    const searchParams = useSearchParams()
    const projectId = searchParams.get('project')

    const fileInputRef = useRef<HTMLInputElement>(null)

    const onContainerClick = (e: React.MouseEvent) => {
        // If clicking on a delete button or image, don't trigger file selector
        if ((e.target as HTMLElement).closest('button')) return
        fileInputRef.current?.click()
    }

    return (
        <div className="flex flex-col gap-10 font-sans">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />

            <div
                className={cn(
                    'relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 min-h-100 flex items-center justify-center cursor-pointer select-none overflow-hidden',
                    dragActive
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border/50 hover:border-border'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onContainerClick}
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-transparent rounded-3xl" />
                </div>

                {/* Empty State Prompt */}
                {images.length === 0 && (
                    <div className="flex flex-col items-center gap-4 z-10 pointer-events-none">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-white">
                                Upload inspiration images
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                                Drag and drop images here, or click to browse. Max 5 images allowed.
                            </p>
                        </div>
                    </div>
                )}

                {/* Mobile Stacked Board (md:hidden) */}
                {images.length > 0 && (
                    <div className="md:hidden absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative pointer-events-auto">
                            {images.map((image, index) => {
                                const { xOffset, yOffset, rotation } = getMobileLayout(index, images.length)

                                return (
                                    <ImagesBoard
                                        key={`mobile-${image.id}`}
                                        image={image}
                                        removeImage={removeImage}
                                        xOffset={xOffset}
                                        yOffset={yOffset}
                                        rotation={rotation}
                                        zIndex={index + 1}
                                        marginLeft="-80px"
                                        marginTop="-96px"
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Desktop Scattered Board (hidden md:flex) */}
                {images.length > 0 && (
                    <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                        <div className="relative pointer-events-auto">
                            {images.map((image, index) => {
                                const { xOffset, yOffset, rotation } = getDesktopLayout(index, images.length)

                                return (
                                    <ImagesBoard
                                        key={`desktop-${image.id}`}
                                        image={image}
                                        removeImage={removeImage}
                                        xOffset={xOffset}
                                        yOffset={yOffset}
                                        rotation={rotation}
                                        zIndex={index + 1}
                                        marginLeft="-120px"
                                        marginTop="-144px"
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Drop Guidance Overlay */}
                {images.length > 0 && canAddMore && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 px-4 py-2 rounded-full text-xs text-white/70 font-medium z-20 pointer-events-none hover:bg-black/80 transition-all">
                        Click or drag more files to upload ({images.length}/5)
                    </div>
                )}
            </div>

            <GenerateStyleGuideButton
                images={images}
                fileInputRef={fileInputRef}
                projectId={projectId || ''}
            />
        </div>
    )
}

export default MoodBoard
