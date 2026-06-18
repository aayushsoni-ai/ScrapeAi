'use client'
import { ChevronDown, Type } from 'lucide-react'
import React, { useState, useEffect } from 'react'

type Props = {
    typographyGuide: any
}

const weights = [
    { label: 'Extra Light', value: '200' },
    { label: 'Light', value: '300' },
    { label: 'Regular', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semi Bold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Extra Bold', value: '800' },
] as const

const StyleGuideTypography = ({ typographyGuide }: Props) => {
    // Extract all styles across all sections to find unique font families
    const allStyles = Array.isArray(typographyGuide)
        ? typographyGuide.flatMap((section: any) => section.styles || [])
        : []
    
    const fontFamilies = Array.from(new Set(allStyles.map((s: any) => s.fontFamily))).filter(Boolean) as string[]

    const [selectedFont, setSelectedFont] = useState(fontFamilies[0] || '')
    const [isOpen, setIsOpen] = useState(false)

    // Set first font when guide loads
    useEffect(() => {
        if (fontFamilies.length > 0 && !selectedFont) {
            setSelectedFont(fontFamilies[0])
        }
    }, [fontFamilies, selectedFont])

    // Load the selected Google Font dynamically
    useEffect(() => {
        if (!selectedFont) return
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/\s+/g, '+')}:wght@200;300;400;500;600;700;800&display=swap`
        document.head.appendChild(link)
        return () => {
            document.head.removeChild(link)
        }
    }, [selectedFont])

    if (!typographyGuide || typographyGuide.length === 0) {
        return (
            <div className="text-center py-20">
                <Type className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                    No typography generated yet
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Generate a style guide to see typography recommendations.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10 font-sans">
            {/* Font Selector */}
            <div className="flex flex-col gap-2 w-full max-w-[320px] relative">
                <span className="text-xs text-muted-foreground/80 font-medium uppercase tracking-wider">
                    Font
                </span>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between bg-[#131315] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white font-medium cursor-pointer hover:bg-[#161619] transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[#8E8E95] font-sans font-medium">Aa</span>
                            <span>{selectedFont || 'Select Font'}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-[#131315] border border-white/5 rounded-xl shadow-xl overflow-hidden">
                            {fontFamilies.map((font) => (
                                <button
                                    key={font}
                                    onClick={() => {
                                        setSelectedFont(font)
                                        setIsOpen(false)
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-[#1C1C1E] transition-all text-left"
                                >
                                    <span className="text-[#8E8E95] font-sans font-medium">Aa</span>
                                    <span>{font}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Font Weight Previews */}
            {selectedFont && (
                <div className="flex flex-col gap-8 mt-4">
                    {weights.map((w) => (
                        <div
                            key={w.label}
                            className="flex flex-col gap-1.5"
                        >
                            <span className="text-xs text-[#8E8E95] font-medium tracking-wide">
                                {w.label}
                            </span>
                            <p
                                style={{
                                    fontFamily: selectedFont,
                                    fontWeight: w.value,
                                }}
                                className="text-xl sm:text-2xl text-white tracking-wide leading-relaxed font-sans"
                            >
                                Whereas disregard and contempt for human rights have resulted
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default StyleGuideTypography