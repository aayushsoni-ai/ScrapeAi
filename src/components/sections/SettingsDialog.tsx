'use client'

import React, { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/redux/store'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { User, LogOut, Loader2, KeyRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type SettingsDialogProps = {
    isOpen: boolean
    onClose: () => void
}

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const me = useAppSelector((state) => state.profile.user)
    const { handleSignOut } = useAuth()
    const updateProfileMutation = useMutation(api.user.updateProfile)

    const [name, setName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    // Reset local state when dialog opens or profile changes
    useEffect(() => {
        if (isOpen && me) {
            setName(me.name || '')
            setImageUrl(me.image || '')
        }
    }, [isOpen, me])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!me) return

        setIsSaving(true)
        try {
            await updateProfileMutation({
                name: name.trim(),
                image: imageUrl.trim() || undefined,
            })
            toast.success('Profile updated successfully!')
            onClose()
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-950/90 text-zinc-100 backdrop-blur-2xl shadow-2xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-semibold tracking-tight text-white">Settings</DialogTitle>
                    <DialogDescription className="text-zinc-400 text-xs">
                        Manage your account settings, profile information, and active sessions.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900/60 p-1 rounded-lg border border-white/5 mb-6">
                        <TabsTrigger
                            value="profile"
                            className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all data-[active]:bg-zinc-800 data-[active]:text-white text-zinc-400 hover:text-zinc-200"
                        >
                            <User className="size-4" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="sessions"
                            className="flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all data-[active]:bg-zinc-800 data-[active]:text-white text-zinc-400 hover:text-zinc-200"
                        >
                            <KeyRound className="size-4" />
                            <span>Account & Session</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="outline-none space-y-6">
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5">
                                <Avatar className="size-16 ring-2 ring-white/10">
                                    <AvatarImage src={imageUrl || me?.image} />
                                    <AvatarFallback className="bg-zinc-800 text-white">
                                        <User className="size-6 text-zinc-400" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-white">{name || me?.name || 'User'}</h4>
                                    <p className="text-xs text-zinc-500">{me?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-medium text-zinc-400">Email Address</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    value={me?.email || ''}
                                    disabled
                                    className="w-full bg-zinc-900/30 border-white/5 text-zinc-500 cursor-not-allowed opacity-60 rounded-lg text-xs py-2 px-3"
                                />
                                <p className="text-[10px] text-zinc-500">Your email address is managed via your sign-in provider.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-medium text-zinc-300">Display Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="w-full bg-zinc-900/60 border-white/10 focus:border-white/20 text-white rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-white/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="avatar" className="text-xs font-medium text-zinc-300">Profile Image URL</Label>
                                <Input
                                    id="avatar"
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full bg-zinc-900/60 border-white/10 focus:border-white/20 text-white rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-white/20"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs px-4 py-2 font-medium rounded-lg flex items-center gap-1.5"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    <TabsContent value="sessions" className="outline-none space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-3">
                                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Current Session</h4>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Logged in as:</span>
                                        <span className="text-zinc-300 font-medium">{me?.email}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-500">Session Status:</span>
                                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-red-950/10 border border-red-900/20 space-y-3">
                                <h4 className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                                    <LogOut className="size-4" />
                                    <span>Logout Management</span>
                                </h4>
                                <p className="text-zinc-400 text-xs/relaxed">
                                    Logout from ScrapeAi. This will safely clear your session cookies and redirect you to the sign-in page.
                                </p>
                                <Button
                                    onClick={() => {
                                        onClose()
                                        handleSignOut()
                                    }}
                                    className="w-full bg-red-900/20 hover:bg-red-900/35 border border-red-500/20 text-red-200 hover:text-red-100 text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut className="size-4" />
                                    <span>Log Out of My Account</span>
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
