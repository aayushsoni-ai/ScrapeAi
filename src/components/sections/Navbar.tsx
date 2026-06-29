'use client'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { CircleQuestionMark, Hash, LayoutTemplate, User, Settings, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useAppSelector } from '@/redux/store'
import CreateProject from '../button/project'
import AutoSave from '../canvas/autosave/Autosave'
import { useAuth } from '@/hooks/use-auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '../ui/dropdown-menu'
import SettingsDialog from './SettingsDialog'
import PricingDialog from './PricingDialog'

type TabProps = {
    label: string,
    href: string,
    icon?: React.ReactNode
}

const Navbar = () => {
    const params = useSearchParams()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isPricingOpen, setIsPricingOpen] = useState(false)
    const { handleSignOut } = useAuth()

    const projectId = params.get('project')
    const isValidProjectId = projectId && projectId !== 'null' && projectId !== 'undefined';
    const pathname = usePathname()

    const me = useAppSelector((state) => state.profile.user)

    const tabs: TabProps[] = [
        {
            label: "Canvas",
            href: `/dashboard/${me?.name || ''}/canvas` + (isValidProjectId ? `?project=${projectId}` : ''),
            icon: <Hash className="h-4 w-4" />,
        },
        {
            label: "Style Guide",
            href: `/dashboard/${me?.name || ''}/style-guide` + (isValidProjectId ? `?project=${projectId}` : ''),
            icon: <LayoutTemplate className="h-4 w-4" />,
        },
    ];

    const project = useQuery(
        api.projects.getProject,
        isValidProjectId ? { projectId: projectId as Id<'projects'> } : 'skip'
    )
    const hasCanvas = pathname.includes('canvas')
    const hasStyleGuide = pathname.includes('style-guide')

    const creditBalance = useQuery(api.subscription.getCreditsBalance, { userId: me?.id as Id<'users'> })

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-4">
                <Link
                    href={`/dashboard/${me?.name || ''}`}
                    className="flex items-center gap-2 group"
                >
                    <img src="/icon.svg" alt="ScrapeAi Logo" className="w-5 h-5 rounded object-contain invert" />
                    <span className="font-semibold text-xs tracking-wider text-white hidden sm:inline-block">ScrapeAi</span>
                </Link>
                {project && (!hasCanvas ||
                    (!hasStyleGuide && (
                        <div className="lg:inline-block hidden rounded-full text-primary/60 border border-white/12 backdrop-blur-xl bg-white/8 px-4 py-2 text-sm saturate-150">
                            Project / {project.name}
                        </div>
                    )))}
            </div>

            <div className="lg:flex hidden items-center justify-center gap-2">
                <div className="flex items-center gap-2 backdrop-blur-xl bg-white/8 border border-white/12 rounded-full p-2 saturate-150">
                    {tabs.map((t) => (
                        <Link
                            key={t.href}
                            href={t.href}
                            className={[
                                'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition',
                                (isValidProjectId ? `${pathname}?project=${projectId}` : pathname) === t.href
                                    ? 'bg-white/12 text-white border border-white/16 backdrop-blur-sm'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/6 border border-transparent',
                            ].join(' ')}
                        >
                            <span
                                className={
                                    (isValidProjectId ? `${pathname}?project=${projectId}` : pathname) === t.href
                                        ? 'opacity-100'
                                        : 'opacity-70 group-hover:opacity-90'
                                }
                            >
                                {t.icon}
                            </span>
                            <span>{t.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 justify-end">
                <button
                    onClick={() => setIsPricingOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-300 hover:text-white uppercase tracking-wider transition cursor-pointer"
                >
                    Upgrade
                </button>
                <span className="text-xs text-white/50">{creditBalance} credits</span>
                {/* <Button
                    variant="secondary"
                    className="rounded-full h-12 w-12 flex items-center justify-center backdrop-blur-xl bg-white/8 border border-white/12 saturate-150 hover:bg-white/12"
                >
                    <CircleQuestionMark className="size-5 text-white" />
                </Button> */}

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <button id="user-menu-trigger" className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-full">
                                <Avatar className="size-12 ml-2 transition hover:opacity-80">
                                    <AvatarImage src={me?.image || ''} />
                                    <AvatarFallback>
                                        <User className="size-5 text-black" />
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        }
                    />
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl bg-zinc-950 border border-white/10 text-white shadow-xl">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal px-2 py-1.5">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none text-white">{me?.name || 'User'}</p>
                                    <p className="text-xs leading-none text-zinc-400">{me?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/10 my-1" />
                        <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer hover:bg-white/10 rounded-md py-1.5 px-2 flex items-center gap-2 text-xs text-zinc-200 hover:text-white transition">
                            <Settings className="size-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10 my-1" />
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md py-1.5 px-2 flex items-center gap-2 text-xs transition">
                            <LogOut className="size-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {hasCanvas && <AutoSave />}
                {!hasCanvas && !hasStyleGuide && <CreateProject />}
            </div>

            <PricingDialog
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
            />
            <SettingsDialog
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    )
}

export default Navbar