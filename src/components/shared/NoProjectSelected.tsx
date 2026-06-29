'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderOpen, ArrowRight } from 'lucide-react'

const NoProjectSelected = () => {
    const pathname = usePathname()
    // Extract session from path like /dashboard/[session]/canvas
    const segments = pathname.split('/')
    const dashboardIndex = segments.indexOf('dashboard')
    const session = dashboardIndex >= 0 ? segments[dashboardIndex + 1] : ''
    const dashboardHref = session ? `/dashboard/${session}` : '/dashboard'

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-center max-w-md px-6">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center saturate-150">
                    <FolderOpen className="w-9 h-9 text-zinc-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Please select a project
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Open a project from your dashboard to start working on the canvas or style guide.
                    </p>
                </div>

                <Link
                    href={dashboardHref}
                    className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium text-white bg-white/10 border border-white/12 backdrop-blur-xl saturate-150 hover:bg-white/16 hover:border-white/20 transition-all duration-200"
                >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    )
}

export default NoProjectSelected
