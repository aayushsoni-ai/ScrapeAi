'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight,
    Sparkles,
    Layers,
    History,
    RefreshCw,
    Landmark,
    Zap,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
    Code,
    Star,
    ExternalLink,
    Terminal,
    Cpu,
    MousePointer2,
    FolderOpen,
    Maximize2,
    Database,
    Undo2,
    Redo2,
    Check
} from 'lucide-react'
import LandingSubscribeButton from '@/components/button/checkout/LandingSubscribeButton'

type LandingPageProps = {
    isAuthenticated: boolean
    productName: string
    formattedPrice: string
    recurringInterval: string
}

type NodeItem = {
    id: string
    name: string
    type: string
}

export default function LandingPage({
    isAuthenticated,
    productName,
    formattedPrice,
    recurringInterval
}: LandingPageProps) {
    // Interactive IDE Workspace States
    const [padding, setPadding] = useState<number>(16)
    const [radius, setRadius] = useState<'none' | 'md' | 'xl'>('xl')
    const [accentColor, setAccentColor] = useState<'emerald' | 'violet' | 'indigo' | 'rose'>('violet')
    const [layoutMode, setLayoutMode] = useState<'row' | 'col'>('row')
    const [selectedNode, setSelectedNode] = useState<string>('revenue-stat')

    // Terminal typing animation states
    const [typedCode, setTypedCode] = useState<string>('')
    const fullCodeSnippet = `<div className="p-${padding / 4} rounded-${radius === 'none' ? 'none' : radius} border border-white/5">\n  <span className="text-${accentColor}-400">Revenue stats</span>\n  <h4 className="text-xl font-bold">₹74,900</h4>\n</div>`

    useEffect(() => {
        let i = 0
        setTypedCode('')
        const interval = setInterval(() => {
            if (i < fullCodeSnippet.length) {
                setTypedCode(prev => prev + fullCodeSnippet.charAt(i))
                i++
            } else {
                clearInterval(interval)
            }
        }, 15)
        return () => clearInterval(interval)
    }, [padding, radius, accentColor, layoutMode])

    // Node Hierarchy structure
    const nodes: NodeItem[] = [
        { id: 'page-root', name: 'Page Wrapper', type: 'container' },
        { id: 'header-row', name: 'Header Row', type: 'layout' },
        { id: 'revenue-stat', name: 'Revenue Stat', type: 'component' },
        { id: 'chart-block', name: 'Analytics Chart', type: 'component' },
        { id: 'actions-footer', name: 'Actions Bar', type: 'layout' }
    ]

    // Style token classes
    const colorClasses = {
        emerald: {
            text: 'text-emerald-400',
            bg: 'bg-emerald-500',
            border: 'border-emerald-500/30',
            glow: 'shadow-emerald-500/10',
            badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            dashed: 'border-emerald-500/40'
        },
        violet: {
            text: 'text-violet-400',
            bg: 'bg-violet-500',
            border: 'border-violet-500/30',
            glow: 'shadow-violet-500/10',
            badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
            dashed: 'border-violet-500/40'
        },
        indigo: {
            text: 'text-indigo-400',
            bg: 'bg-indigo-500',
            border: 'border-indigo-500/30',
            glow: 'shadow-indigo-500/10',
            badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            dashed: 'border-indigo-500/40'
        },
        rose: {
            text: 'text-rose-400',
            bg: 'bg-rose-500',
            border: 'border-rose-500/30',
            glow: 'shadow-rose-500/10',
            badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            dashed: 'border-rose-500/40'
        }
    }

    const currentPalette = colorClasses[accentColor]

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white font-mono antialiased overflow-x-hidden relative">

            {/* Professional Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

            {/* Header Navigation */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-900 transition-colors">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img src="/icon.svg" alt="ScrapeAi Logo" className="w-5 h-5 rounded object-contain invert" />
                            <span className="font-semibold text-sm tracking-wider text-white">ScrapeAi</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            {['features', 'compare', 'pricing', 'faq'].map((tab) => (
                                <a
                                    key={tab}
                                    href={`#${tab}`}
                                    className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 hover:text-zinc-100 transition-colors duration-200"
                                >
                                    {tab}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link
                                id="header-dashboard-btn"
                                href="/dashboard"
                                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-4 h-9 flex items-center justify-center transition-all shadow-md shadow-white/5"
                            >
                                <span>Workspace</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    id="header-signin-btn"
                                    href="/auth/sign-in"
                                    className="text-zinc-500 hover:text-zinc-200 text-[10px] font-bold tracking-widest uppercase px-3"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    id="header-signup-btn"
                                    href="/auth/sign-up"
                                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-4 h-9 flex items-center justify-center transition-all shadow-md shadow-white/5"
                                >
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] tracking-widest uppercase mb-8">
                    <Sparkles className="size-3 text-zinc-500" />
                    <span>Layout Builder v2.0 // Active System</span>
                </div>

                <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
                    Draw vector layouts.<br />
                    Compile clean Tailwind styles.
                </h1>

                <p className="mt-6 text-zinc-500 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed font-sans">
                    Connect style variables, draft component grids on a vector canvas, and let our generative engine export production-ready React templates instantly.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    {isAuthenticated ? (
                        <Link
                            id="hero-dashboard-btn"
                            href="/dashboard"
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold px-6 py-3.5 transition shadow-lg shadow-white/5"
                        >
                            Open Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                id="hero-signup-btn"
                                href="/auth/sign-up"
                                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold px-6 py-3.5 transition shadow-lg shadow-white/5"
                            >
                                Start Designing Free
                            </Link>
                            <a
                                href="#features"
                                className="border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-400 hover:text-white text-xs font-bold px-6 py-3.5 transition"
                            >
                                View Features
                            </a>
                        </>
                    )}
                </div>

                {/* Hyper-Realistic Designer IDE Preview */}
                <div className="mt-16 rounded-xl border border-zinc-800 bg-zinc-950 max-w-5xl mx-auto overflow-hidden shadow-2xl relative text-left">

                    {/* Window Controls Bar */}
                    <div className="h-10 bg-zinc-900/60 border-b border-zinc-800/80 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                            <span className="text-[10px] text-zinc-500 font-bold ml-4">scrape_ai_workspace.app</span>
                        </div>
                        <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-sans">
                            <span className="flex items-center gap-1"><FolderOpen className="size-3" /> /components</span>
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[9px]">zoom: 100%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_260px] min-h-[420px] bg-zinc-950">

                        {/* Node Hierarchy Sidebar (Left) */}
                        <div className="border-r border-zinc-900 bg-zinc-950 p-4 flex flex-col gap-3 font-sans">
                            <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                <span>Layers Tree</span>
                                <Maximize2 className="size-3" />
                            </div>
                            <div className="space-y-1.5">
                                {nodes.map((node) => (
                                    <button
                                        key={node.id}
                                        onClick={() => setSelectedNode(node.id)}
                                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-all ${selectedNode === node.id
                                                ? 'bg-zinc-900 text-zinc-100 font-mono border-l-2 border-zinc-200'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        <span className="truncate">{node.name}</span>
                                        <span className="text-[8px] text-zinc-600 bg-zinc-900/60 px-1 py-0.5 rounded uppercase font-mono">{node.type.substring(0, 4)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Design Canvas (Center) */}
                        <div className="p-8 bg-zinc-950 flex flex-col justify-between relative overflow-hidden">
                            {/* Dot Matrix backdrop */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:12px_12px]" />

                            <div className="z-10 flex items-center justify-between text-[8px] text-zinc-500 border-b border-zinc-900 pb-2">
                                <span className="flex items-center gap-1"><MousePointer2 className="size-2.5" /> Editor Canvas</span>
                                <span className="font-mono">W: 100% // H: 260px</span>
                            </div>

                            {/* Rendered Element with active border spacing overlays */}
                            <div className="z-10 flex-1 flex items-center justify-center p-6 my-4 bg-zinc-900/20 border border-zinc-800 rounded-lg relative overflow-hidden min-h-[220px]">
                                <div
                                    className={`w-full max-w-sm border transition-all duration-300 relative ${currentPalette.border} ${radius === 'none' ? 'rounded-none' : radius === 'md' ? 'rounded-md' : 'rounded-xl'} overflow-hidden shadow-lg ${currentPalette.glow}`}
                                    style={{
                                        padding: `${padding}px`
                                    }}
                                >
                                    {/* Layout guidelines overlays (padding blocks) */}
                                    <div className="absolute inset-0 border border-dashed border-zinc-800 pointer-events-none" />
                                    <div
                                        className="absolute inset-0 border border-dashed pointer-events-none opacity-40 transition-all duration-300"
                                        style={{
                                            margin: `${padding}px`,
                                            borderColor: accentColor === 'emerald' ? '#34d399' : accentColor === 'violet' ? '#a78bfa' : accentColor === 'indigo' ? '#818cf8' : '#fb7185'
                                        }}
                                    />

                                    {/* Component items inside canvas */}
                                    <div className={`flex ${layoutMode === 'row' ? 'flex-row justify-between items-center' : 'flex-col gap-3 text-left'} w-full transition-all`}>
                                        <div className="space-y-1">
                                            <span className={`text-[10px] uppercase font-bold tracking-wider ${currentPalette.text}`}>Selected Layer</span>
                                            <h4 className="text-lg font-bold text-white font-sans">Active Component</h4>
                                            <p className="text-[9px] text-zinc-500 font-sans">Compiled properties sync live.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`w-8 h-8 rounded-full ${currentPalette.bg} flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-white/5`}>
                                                ✓
                                            </span>
                                        </div>
                                    </div>

                                    {/* Monospaced distance indicator label */}
                                    <div className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500 opacity-60">
                                        pad: {padding}px // rad: {radius}
                                    </div>
                                </div>
                            </div>

                            {/* Stream code status */}
                            <div className="z-10 pt-2 border-t border-zinc-900 text-[9px] text-zinc-500 flex justify-between">
                                <span>Coordinates sync: OK</span>
                                <span className={currentPalette.text}>● connected</span>
                            </div>
                        </div>

                        {/* Inspector Settings Panel (Right) */}
                        <div className="border-l border-zinc-900 p-5 space-y-6 bg-zinc-950/80 font-sans">
                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                                Properties Inspector
                            </div>

                            {/* Slider control */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-zinc-400">Padding</span>
                                    <span className="text-zinc-200 font-mono">{padding}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="32"
                                    step="4"
                                    value={padding}
                                    onChange={(e) => setPadding(Number(e.target.value))}
                                    className="w-full accent-zinc-200 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                            </div>

                            {/* Color Selector */}
                            <div className="space-y-2">
                                <span className="text-[11px] text-zinc-400 block">Accent Variable</span>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['emerald', 'violet', 'indigo', 'rose'] as const).map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setAccentColor(color)}
                                            className={`h-7 rounded border flex items-center justify-center capitalize text-[8px] transition ${accentColor === color
                                                    ? 'bg-zinc-800 text-white border-zinc-400 font-bold'
                                                    : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                                                }`}
                                        >
                                            {color[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Border Radius Toggle */}
                            <div className="space-y-2">
                                <span className="text-[11px] text-zinc-400 block">Border Radius</span>
                                <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 rounded p-1 border border-zinc-800/80">
                                    {(['none', 'md', 'xl'] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRadius(r)}
                                            className={`py-1 rounded text-[9px] font-bold uppercase transition ${radius === r ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Layout Orientation */}
                            <div className="space-y-2">
                                <span className="text-[11px] text-zinc-400 block">Layout Direction</span>
                                <div className="grid grid-cols-2 gap-1.5 bg-zinc-900 rounded p-1 border border-zinc-800/80">
                                    <button
                                        onClick={() => setLayoutMode('row')}
                                        className={`py-1 rounded text-[9px] font-bold uppercase transition ${layoutMode === 'row' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                                            }`}
                                    >
                                        Row
                                    </button>
                                    <button
                                        onClick={() => setLayoutMode('col')}
                                        className={`py-1 rounded text-[9px] font-bold uppercase transition ${layoutMode === 'col' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                                            }`}
                                    >
                                        Column
                                    </button>
                                </div>
                            </div>

                            {/* Mini code preview display panel */}
                            <div className="pt-4 border-t border-zinc-900">
                                <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-1.5">
                                    <span>CSS compiler</span>
                                    <span className="font-mono text-[8px]">Next.js / Tailwind</span>
                                </div>
                                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded font-mono text-[8px] text-zinc-400 overflow-x-auto whitespace-pre h-[72px]">
                                    {typedCode}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Box Grid Section */}
            <section id="features" className="py-24 border-t border-zinc-900 bg-zinc-950 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mb-16">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] tracking-widest uppercase mb-4">
                            <Cpu className="size-3 text-zinc-500" />
                            <span>System Modules</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Handcrafted layout architecture</h2>
                        <p className="text-zinc-500 font-sans text-xs md:text-sm mt-3 leading-relaxed">
                            No placeholders or templates. A structural design builder mapping shape coordinates directly into fully-functional React utility states.
                        </p>
                    </div>

                    {/* Bento Box Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

                        {/* Bento Card 1: Vector Canvas (Col-span 4, row-span 2) */}
                        <div className="md:col-span-4 p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Layers className="size-5" />
                                </div>
                                <h3 className="text-sm font-bold text-white tracking-wide">Structured Vector Canvas</h3>
                                <p className="text-zinc-500 font-sans text-xs max-w-md">
                                    Create visual hierarchies, frames, coordinates, and layer trees. Generates clean bounding parameters for coordinates.
                                </p>
                            </div>

                            {/* Graphic visual: active resizing preview */}
                            <div className="mt-6 aspect-[16/7] bg-zinc-900/30 rounded border border-zinc-900 relative flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] bg-[size:10px_10px]" />
                                <div className="w-48 h-16 border border-dashed border-zinc-700/80 rounded relative flex items-center justify-center bg-zinc-950/40">
                                    <span className="text-[9px] text-zinc-500">W: 192px // H: 64px</span>
                                    {/* Active coordinate indicators */}
                                    <span className="absolute -top-1 -left-1 w-2 h-2 bg-zinc-300 rounded-sm" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-zinc-300 rounded-sm" />
                                    <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-zinc-300 rounded-sm" />
                                    <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-zinc-300 rounded-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 2: Tailwind Streamer (Col-span 2) */}
                        <div className="md:col-span-2 p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[300px]">
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Code className="size-5" />
                                </div>
                                <h3 className="text-sm font-bold text-white tracking-wide">CSS Utility Compiler</h3>
                                <p className="text-zinc-500 font-sans text-xs">
                                    Converts shape coordinates and margins directly to Tailwind utility tokens instantly.
                                </p>
                            </div>

                            {/* Visual terminal feed */}
                            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded font-mono text-[8px] text-zinc-400 space-y-1 mt-6">
                                <div className="text-zinc-600">// compiler stream</div>
                                <div className="flex items-center gap-1"><span className="text-emerald-400">✔</span> <span>StatCard compiled</span></div>
                                <div className="flex items-center gap-1"><span className="text-emerald-400">✔</span> <span>CSS output flushed</span></div>
                                <div className="text-[8px] text-zinc-500 animate-pulse">_ blinking cursor</div>
                            </div>
                        </div>

                        {/* Bento Card 3: Local History Stack (Col-span 2) */}
                        <div className="md:col-span-2 p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[280px]">
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                    <History className="size-5" />
                                </div>
                                <h3 className="text-sm font-bold text-white tracking-wide">Session Undo & Redo</h3>
                                <p className="text-zinc-500 font-sans text-xs">
                                    Full session queue of changes, modifications, color alterations, and layer resets backed by Redux.
                                </p>
                            </div>

                            {/* Active timeline queue block */}
                            <div className="space-y-1.5 mt-6">
                                <div className="flex items-center justify-between text-[8px] text-zinc-500 border-b border-zinc-900 pb-1">
                                    <span>Action Stack</span>
                                    <span className="flex gap-1.5"><Undo2 className="size-3" /><Redo2 className="size-3" /></span>
                                </div>
                                <div className="space-y-1 text-[8px]">
                                    <div className="text-zinc-400">3. Update padding ➔ 16px</div>
                                    <div className="text-zinc-500">2. Set border-radius ➔ md</div>
                                    <div className="text-zinc-600">1. Create Node: StatCard</div>
                                </div>
                            </div>
                        </div>

                        {/* Bento Card 4: Convex Sync (Col-span 4) */}
                        <div className="md:col-span-4 p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[280px] relative overflow-hidden">
                            <div className="space-y-2">
                                <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Database className="size-5" />
                                </div>
                                <h3 className="text-sm font-bold text-white tracking-wide">Real-time DB Sync</h3>
                                <p className="text-zinc-500 font-sans text-xs max-w-sm">
                                    Your layouts, style guides, and settings are saved automatically to the Convex backend to prevent data loss.
                                </p>
                            </div>

                            {/* Live Sync dashboard indicator */}
                            <div className="mt-6 flex items-center gap-4 bg-zinc-900/40 border border-zinc-900 p-4 rounded">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <div className="text-[10px] text-zinc-400 font-mono leading-normal">
                                    db_connection: connected // latest_save: 0.1s ago // latency: 14ms
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Compare Wireframe vs Production Section */}
            <section id="compare" className="py-24 border-t border-zinc-900 bg-zinc-900/10 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mb-16">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] tracking-widest uppercase mb-4">
                            <Code className="size-3 text-zinc-500" />
                            <span>Visual Sandbox</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Compare side-by-side</h2>
                        <p className="text-zinc-500 font-sans text-xs md:text-sm mt-3 leading-relaxed">
                            Watch coordinates turn into pixel-perfect CSS. Review layout metrics and details before deploying code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        {/* Wireframe blueprint */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-6 border-b border-zinc-900 pb-3 font-sans">
                                <span>Canvas Wireframe mode</span>
                                <span className="font-mono text-[9px] text-violet-400">[active grid]</span>
                            </div>

                            <div className="aspect-[16/10] bg-zinc-900/20 border border-zinc-800 rounded p-6 relative flex flex-col justify-between overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                                <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                                    <span className="w-16 h-3 bg-zinc-800 rounded" />
                                    <span className="w-12 h-4 border border-dashed border-zinc-700 rounded text-[7px] text-zinc-500 flex items-center justify-center">W: 100px</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 my-6">
                                    <div className="p-4 border border-dashed border-violet-500/30 rounded flex flex-col gap-2 relative">
                                        <span className="absolute -top-1 -right-1 text-[7px] bg-violet-500/10 text-violet-400 px-1 border border-violet-500/25">Component</span>
                                        <span className="w-8 h-2 bg-zinc-800 rounded" />
                                        <span className="w-16 h-4 bg-zinc-800 rounded" />
                                    </div>
                                    <div className="p-4 border border-dashed border-zinc-800 rounded flex flex-col gap-2">
                                        <span className="w-8 h-2 bg-zinc-800 rounded" />
                                        <span className="w-12 h-4 bg-zinc-800 rounded" />
                                    </div>
                                </div>
                                <div className="border-t border-zinc-800/80 pt-3 flex justify-between">
                                    <span className="w-24 h-2.5 bg-zinc-800 rounded" />
                                    <span className="w-10 h-3.5 bg-zinc-800 rounded" />
                                </div>
                            </div>
                        </div>

                        {/* High-Fidelity UI */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-6 border-b border-zinc-900 pb-3 font-sans">
                                <span>Compiled component render</span>
                                <span className="font-mono text-[9px] text-emerald-400">● production ready</span>
                            </div>

                            <div className="aspect-[16/10] bg-zinc-900/50 border border-zinc-800 rounded p-6 relative flex flex-col justify-between overflow-hidden">
                                <div className="border-b border-zinc-850 pb-3 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">Project Revenue</span>
                                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">W: 100%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 my-6">
                                    <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-violet-500 to-indigo-500" />
                                        <span className="text-[9px] text-zinc-500 block">Total Revenue</span>
                                        <span className="text-base font-bold text-white block mt-1">₹74,900</span>
                                    </div>
                                    <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
                                        <span className="text-[9px] text-zinc-500 block">Ledger Credits</span>
                                        <span className="text-base font-bold text-white block mt-1">100</span>
                                    </div>
                                </div>
                                <div className="border-t border-zinc-850 pt-3 flex justify-between text-[9px] text-zinc-500">
                                    <span>Status: Validated</span>
                                    <button className="flex items-center gap-1 text-white bg-zinc-800 px-2 py-1 rounded text-[8px]">
                                        <span>Copy CSS</span>
                                        <ExternalLink className="size-2.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Review section */}
            <section className="py-24 border-t border-zinc-900 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mb-16">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] tracking-widest uppercase mb-4">
                            <Star className="size-3 text-zinc-500" />
                            <span>Social Proof</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Hear from teams compiling layout designs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[160px] font-sans">
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                "The precision spacing metrics are exactly what our dev workflow was missing. Drawing boxes and copying Tailwind classes directly saves us hours."
                            </p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-900 font-mono">
                                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-white">MK</div>
                                <div>
                                    <span className="block text-xs font-bold text-white">Marc K.</span>
                                    <span className="block text-[8px] text-zinc-500">Developer at Bloom Studio</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[160px] font-sans">
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                "Autosaves and in-memory undo queues work perfectly. I can prototype a responsive panel layout directly inside ScrapeAi in seconds."
                            </p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-900 font-mono">
                                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-white">LH</div>
                                <div>
                                    <span className="block text-xs font-bold text-white">Lena H.</span>
                                    <span className="block text-[8px] text-zinc-500">Frontend at GreenLeaf</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between min-h-[160px] font-sans">
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                "No glowing neon circles or generic template styles. Just a robust developer-first tool focused on raw coordinate generation."
                            </p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-900 font-mono">
                                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-white">DP</div>
                                <div>
                                    <span className="block text-xs font-bold text-white">Devon P.</span>
                                    <span className="block text-[8px] text-zinc-500">Product Designer at Stripe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 border-t border-zinc-900 bg-zinc-900/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] tracking-widest uppercase mb-4">
                            <Landmark className="size-3 text-zinc-500" />
                            <span>Billing Models</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Subscription Credit Plans</h2>
                        <p className="text-zinc-500 font-sans text-xs md:text-sm mt-3 leading-relaxed">
                            Upgrade your ledger credits to run advanced layout compilation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">

                        {/* Free Tier */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Free Tier</h4>
                                <div className="text-3xl font-bold text-white font-mono">
                                    ₹0<span className="text-[11px] text-zinc-500 font-normal tracking-normal"> / forever</span>
                                </div>
                                <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                                    Ideal for testing layout tools and compiling basic nodes.
                                </p>
                                <ul className="space-y-2 text-[10px] text-zinc-400 pt-4 border-t border-zinc-900">
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-zinc-500" />
                                        <span>10 generation credits</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-zinc-500" />
                                        <span>Interactive visual grid</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-zinc-500" />
                                        <span>Autosave to Convex db</span>
                                    </li>
                                </ul>
                            </div>
                            <Link
                                id="pricing-free-btn"
                                href="/auth/sign-up"
                                className="w-full text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-[10px] font-bold tracking-widest uppercase py-3 rounded transition"
                            >
                                Register Account
                            </Link>
                        </div>

                        {/* Standard Tier */}
                        <div className="p-6 rounded-xl border border-zinc-400 bg-zinc-950 flex flex-col justify-between space-y-6 relative shadow-lg">
                            <div className="absolute top-0 right-4 -translate-y-1/2 bg-zinc-100 text-zinc-950 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                recommended
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{productName}</h4>
                                <div className="text-3xl font-bold text-white font-mono">
                                    {formattedPrice}<span className="text-[11px] text-zinc-500 font-normal tracking-normal"> / {recurringInterval}</span>
                                </div>
                                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                                    For professional developers building layout code frequently.
                                </p>
                                <ul className="space-y-2 text-[10px] text-zinc-300 pt-4 border-t border-zinc-800">
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-emerald-400" />
                                        <span className="font-bold text-white">100 monthly credits</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-emerald-400" />
                                        <span>Full session Undo/Redo tracking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-emerald-400" />
                                        <span>Fast priority generation queues</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-emerald-400" />
                                        <span>Polar automated checkout webhook</span>
                                    </li>
                                </ul>
                            </div>
                            <LandingSubscribeButton />
                        </div>

                        {/* Enterprise Tier */}
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Custom Plan</h4>
                                <div className="text-3xl font-bold text-white font-mono">
                                    Contact<span className="text-[11px] text-zinc-500 font-normal tracking-normal"> / details</span>
                                </div>
                                <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                                    For teams requiring dedicated API endpoints.
                                </p>
                                <ul className="space-y-2 text-[10px] text-zinc-400 pt-4 border-t border-zinc-900">
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-zinc-500" />
                                        <span>Unlimited generation credits</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-zinc-500" />
                                        <span>Custom layout template models</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="size-3 text-zinc-500" />
                                        <span>Custom style rule definitions</span>
                                    </li>
                                </ul>
                            </div>
                            <a
                                id="pricing-contact-btn"
                                href="mailto:support@scrapeai.com"
                                className="w-full text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-[10px] font-bold tracking-widest uppercase py-3 rounded transition"
                            >
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section id="faq" className="py-24 border-t border-zinc-900 bg-zinc-950 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] tracking-widest uppercase mb-4">
                            <HelpCircle className="size-3 text-zinc-500" />
                            <span>FAQ Support</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-3 font-sans">
                        <details className="group rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="size-4 text-zinc-500 shrink-0" />
                                    <span>How does the layout compiler map coordinates to CSS?</span>
                                </h3>
                                <span className="transition-transform group-open:-rotate-180 text-zinc-600">
                                    <ChevronRight className="size-4" />
                                </span>
                            </summary>
                            <p className="mt-3 text-zinc-500 text-xs leading-relaxed pl-6 border-l border-zinc-800 font-sans">
                                When components are drawn, coordinate bounds (padding, margin, width, and flex flow parameters) are saved as style tokens. The engine parses this token map and writes standard responsive Tailwind classes.
                            </p>
                        </details>

                        <details className="group rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="size-4 text-zinc-500 shrink-0" />
                                    <span>Is my canvas history queue kept on the server?</span>
                                </h3>
                                <span className="transition-transform group-open:-rotate-180 text-zinc-600">
                                    <ChevronRight className="size-4" />
                                </span>
                            </summary>
                            <p className="mt-3 text-zinc-500 text-xs leading-relaxed pl-6 border-l border-zinc-800 font-sans">
                                No. The undo/redo session queue history is stored in local client memory (Redux state) for instantaneous responsive changes. Rebuilding or saving flushes the layout object to the Convex database.
                            </p>
                        </details>

                        <details className="group rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="size-4 text-zinc-500 shrink-0" />
                                    <span>How do standard credit limits work?</span>
                                </h3>
                                <span className="transition-transform group-open:-rotate-180 text-zinc-600">
                                    <ChevronRight className="size-4" />
                                </span>
                            </summary>
                            <p className="mt-3 text-zinc-500 text-xs leading-relaxed pl-6 border-l border-zinc-800 font-sans">
                                Each generative layout compilation decrements 1 credit. Upgrades allocate 100 additional credits immediately using automated webhooks via Polar checkout.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-[11px] font-sans">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 font-mono">
                                <img src="/icon.svg" alt="ScrapeAi Logo" className="w-5 h-5 rounded object-contain invert" />
                                <span className="font-bold text-xs tracking-wider text-white">ScrapeAi</span>
                            </div>
                            <p className="text-zinc-500 leading-relaxed max-w-xs">
                                Vector-first layout design compiler rendering structured, clean React UI components.
                            </p>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-[9px] font-mono">systems operational</span>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <h4 className="font-bold text-white font-mono text-[10px] uppercase tracking-wider">Editor</h4>
                            <ul className="space-y-1.5 text-zinc-500">
                                <li><a href="#features" className="hover:text-white transition">Features Grid</a></li>
                                <li><a href="#compare" className="hover:text-white transition">Layout Compare</a></li>
                                <li><a href="#pricing" className="hover:text-white transition">Standard Plan</a></li>
                            </ul>
                        </div>

                        <div className="space-y-2.5">
                            <h4 className="font-bold text-white font-mono text-[10px] uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-1.5 text-zinc-500">
                                <li><a href="#" className="hover:text-white transition">Convex DB Sync</a></li>
                                <li><a href="#" className="hover:text-white transition">Polar Webhook</a></li>
                                <li><a href="#" className="hover:text-white transition">Release Log</a></li>
                            </ul>
                        </div>

                        <div className="space-y-2.5">
                            <h4 className="font-bold text-white font-mono text-[10px] uppercase tracking-wider">Technical</h4>
                            <p className="text-zinc-500 leading-relaxed">
                                Built for coordinates layout structures using Next.js / Tailwind.
                            </p>
                            <a href="mailto:support@scrapeai.com" className="text-violet-400 hover:text-violet-300 font-mono text-[10px] block hover:underline">
                                support@scrapeai.com
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-zinc-600 text-[9px]">
                            © 2026 ScrapeAi Inc. All rights reserved. Designed for vector wireframes.
                        </p>

                        <div className="flex gap-4 text-[9px] text-zinc-500">
                            <a href="#" className="hover:text-white transition">Privacy</a>
                            <a href="#" className="hover:text-white transition">Terms</a>
                            <a href="#" className="hover:text-white transition">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
