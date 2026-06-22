'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { TextShape, updateShape } from '@/redux/slice/shapes'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Bold, GripVertical, Italic, Palette, Strikethrough, Underline } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
    isOpen: boolean
}

const TextSideBar = ({ isOpen }: Props) => {
    const dispatch = useAppDispatch()
    const selectedShapes = useAppSelector((state) => state.shapes.selected)
    const shapesEntities = useAppSelector((state) => state.shapes.shapes?.entities || {})
    const [colorInput, setColorInput] = useState('#ffffff')

    // Drag state
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [hasCustomPosition, setHasCustomPosition] = useState(false)
    const dragStartRef = useRef({ x: 0, y: 0 })
    const posStartRef = useRef({ x: 0, y: 0 })
    const panelRef = useRef<HTMLDivElement>(null)

    const fontFamilies = [
        "Inter, sans-serif",
        "Arial, sans-serif",
        "Helvetica, sans-serif",
        "Georgia, serif",
        "Times New Roman, serif",
        "Courier New, monospace",
        "Monaco, monospace",
        "system-ui, sans-serif",
    ];

    const selectedTextShape = Object.keys(selectedShapes)
        .map((id) => shapesEntities[id])
        .find((shape) => shape?.type === 'text') as TextShape | undefined

    // Sync colorInput with selected shape's fill
    useEffect(() => {
        if (selectedTextShape?.fill) {
            setColorInput(selectedTextShape.fill)
        }
    }, [selectedTextShape?.fill])

    const updateTextProperty = (property: keyof TextShape, value: any) => {
        if (!selectedTextShape) return
        dispatch(
            updateShape({
                id: selectedTextShape.id,
                patch: { [property]: value },
            })
        )
    }

    // Handle color change with validation
    const handleColorChange = (color: string) => {
        setColorInput(color)
        if (/^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{3}$/i.test(color)) {
            updateTextProperty('fill', color)
        }
    }

    // Drag handlers
    const handleDragStart = useCallback((e: React.PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        posStartRef.current = { ...position }
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }, [position])

    const handleDragMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return
        const dx = e.clientX - dragStartRef.current.x
        const dy = e.clientY - dragStartRef.current.y
        setPosition({
            x: posStartRef.current.x + dx,
            y: posStartRef.current.y + dy,
        })
        setHasCustomPosition(true)
    }, [isDragging])

    const handleDragEnd = useCallback((e: React.PointerEvent) => {
        setIsDragging(false)
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    }, [])

    if (!isOpen || !selectedTextShape) return null

    return (
        <div
            ref={panelRef}
            className={cn(
                'fixed w-80 backdrop-blur-xl bg-white/[0.08] border-white/[0.12] gap-2 p-3 saturate-150 border rounded-lg z-50 transition-opacity duration-200',
                isDragging && 'cursor-grabbing select-none'
            )}
            style={
                hasCustomPosition
                    ? {
                        left: position.x,
                        top: position.y,
                        right: 'auto',
                        transform: 'none',
                    }
                    : {
                        right: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }
            }
        >
            {/* Drag handle */}
            <div
                className="flex items-center justify-center py-1.5 cursor-grab active:cursor-grabbing rounded-t-lg -mt-1 mb-1 hover:bg-white/[0.04] transition-colors"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
            >
                <GripVertical className="w-4 h-4 text-white/30 rotate-90" />
            </div>

            <div className="p-4 pt-0 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {/* Font Family */}
                <div className="space-y-2">
                    <Label className="text-white/80">Font Family</Label>
                    <Select
                        value={selectedTextShape.fontFamily}
                        onValueChange={(value) => updateTextProperty('fontFamily', value)}
                    >
                        <SelectTrigger className="bg-white/5 border-white/10 w-full text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10">
                            {fontFamilies.map((font) => (
                                <SelectItem
                                    key={font}
                                    value={font}
                                    className="text-white hover:bg-white/10"
                                >
                                    <span style={{ fontFamily: font }}>{font.split(',')[0]}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                    <Label className="text-white/80">
                        Font Size: {selectedTextShape.fontSize}px
                    </Label>
                    <Slider
                        value={[selectedTextShape.fontSize]}
                        onValueChange={(val) => updateTextProperty('fontSize', Array.isArray(val) ? val[0] : val)}
                        min={8}
                        max={128}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Font Weight */}
                <div className="space-y-2">
                    <Label className="text-white/80">
                        Font Weight: {selectedTextShape.fontWeight}
                    </Label>
                    <Slider
                        value={[selectedTextShape.fontWeight]}
                        onValueChange={(val) => updateTextProperty('fontWeight', Array.isArray(val) ? val[0] : val)}
                        min={100}
                        max={900}
                        step={100}
                        className="w-full"
                    />
                </div>

                {/* Style Toggles */}
                <div className="space-y-3">
                    <Label className="text-white/80">Style</Label>
                    <div className="flex gap-2">
                        <Toggle
                            pressed={selectedTextShape.fontWeight >= 600}
                            onPressedChange={(pressed) =>
                                updateTextProperty("fontWeight", pressed ? 700 : 400)
                            }
                            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                        >
                            <Bold className="w-4 h-4" />
                        </Toggle>
                        <Toggle
                            pressed={selectedTextShape.fontStyle === "italic"}
                            onPressedChange={(pressed) =>
                                updateTextProperty("fontStyle", pressed ? "italic" : "normal")
                            }
                            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                        >
                            <Italic className="w-4 h-4" />
                        </Toggle>
                        <Toggle
                            pressed={selectedTextShape.textDecoration === "underline"}
                            onPressedChange={(pressed) =>
                                updateTextProperty(
                                    "textDecoration",
                                    pressed ? "underline" : "none"
                                )
                            }
                            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                        >
                            <Underline className="w-4 h-4" />
                        </Toggle>
                        <Toggle
                            pressed={selectedTextShape.textDecoration === "line-through"}
                            onPressedChange={(pressed) =>
                                updateTextProperty(
                                    "textDecoration",
                                    pressed ? "line-through" : "none"
                                )
                            }
                            className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </Toggle>
                    </div>
                </div>

                {/* Text Color — inline picker */}
                <div className="space-y-2">
                    <Label className="text-white/80 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Text Color
                    </Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            value={colorInput}
                            onChange={(e) => handleColorChange(e.target.value)}
                            placeholder="#ffffff"
                            className="bg-white/5 border-white/10 text-white flex-1"
                        />
                        {/* Inline color swatch with native picker */}
                        <label className="relative w-10 h-10 rounded border border-white/20 cursor-pointer shrink-0 overflow-hidden">
                            <div
                                className="absolute inset-0 rounded"
                                style={{ backgroundColor: selectedTextShape.fill || '#ffffff' }}
                            />
                            <input
                                type="color"
                                value={selectedTextShape.fill || '#ffffff'}
                                onChange={(e) => {
                                    setColorInput(e.target.value)
                                    updateTextProperty('fill', e.target.value)
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TextSideBar