'use client'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Check, Loader2, Sparkles } from 'lucide-react'
import LandingSubscribeButton from '../button/checkout/LandingSubscribeButton'
import { Polar } from '@polar-sh/sdk'

type PricingDialogProps = {
    isOpen: boolean
    onClose: () => void
}

export default function PricingDialog({ isOpen, onClose }: PricingDialogProps) {
    const [productName, setProductName] = useState('Standard Plan')
    const [formattedPrice, setFormattedPrice] = useState('₹749')
    const [recurringInterval, setRecurringInterval] = useState('month')
    const [isLoading, setIsLoading] = useState(false)

    // Load price details from Polar client-side if open
    useEffect(() => {
        if (!isOpen) return

        const fetchPriceDetails = async () => {
            setIsLoading(true)
            try {
                // Since this runs client-side, we fetch from a endpoint or just resolve from local environment parameters.
                // To avoid leaking token on client-side, we can query standard details or use the standard ₹749 fallback.
                // Let's use the standard values by default.
            } catch (err) {
                console.error("Failed to load price details client-side:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPriceDetails()
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-950/95 text-zinc-100 backdrop-blur-2xl shadow-2xl p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

                <DialogHeader className="mb-4 text-center relative z-10">
                    <div className="mx-auto w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-2 shadow-lg">
                        <Sparkles className="size-5 text-white animate-pulse" />
                    </div>
                    <DialogTitle className="text-base font-bold text-white tracking-tight">Upgrade Workspace Plan</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[11px] font-sans">
                        Transform your design workflow with AI-powered compiler tools and priority features.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/60 relative overflow-hidden shadow-lg z-10 space-y-5">
                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-zinc-100 text-zinc-950 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        popular
                    </div>
                    
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{productName}</h4>
                        <div className="text-2xl font-bold text-white font-mono">
                            {formattedPrice}<span className="text-[11px] text-zinc-500 font-normal tracking-normal"> / {recurringInterval}</span>
                        </div>
                        <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                            Unlocks unlimited sketch canvas saves and premium AI compile credits.
                        </p>
                        
                        <ul className="space-y-2 text-[10px] text-zinc-300 pt-4 border-t border-zinc-900">
                            <li className="flex items-center gap-2">
                                <Check className="size-3 text-emerald-400 font-bold" />
                                <span className="font-bold text-white">100 monthly credits</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-3 text-emerald-400" />
                                <span>Full session Undo/Redo tracking</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-3 text-emerald-400" />
                                <span>Priority Gemini AI generation queues</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-2">
                        <LandingSubscribeButton />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
