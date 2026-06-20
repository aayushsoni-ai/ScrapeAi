import React from 'react'
import { cn } from '@/lib/utils'

export interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'subtle' | 'outline'
    size?: 'sm' | 'md' | 'lg'
}

export const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
    ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    // Core styles
                    "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300",
                    "backdrop-blur-xl border border-white/[0.1] text-white/90 shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
                    "hover:border-white/[0.2] hover:text-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
                    "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
                    
                    // Variants
                    variant === 'default' && "bg-white/[0.08] hover:bg-white/[0.15] active:bg-white/[0.2]",
                    variant === 'subtle' && "bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15]",
                    variant === 'outline' && "bg-transparent hover:bg-white/[0.05] border-white/[0.08]",

                    // Sizes
                    size === 'sm' && "h-8 px-4 text-xs gap-1.5",
                    size === 'md' && "h-10 px-6 text-sm gap-2",
                    size === 'lg' && "h-12 px-8 text-base gap-2.5",
                    
                    className
                )}
                {...props}
            >
                {/* Internal glow / reflection layer */}
                <span className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.08] pointer-events-none" />
                <span className="absolute -inset-px rounded-full bg-gradient-to-b from-white/[0.12] via-transparent to-white/[0.02] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            </button>
        )
    }
)

LiquidGlassButton.displayName = 'LiquidGlassButton'
