'use client'

import React, { useState } from 'react'
import { useProjectCreation } from '@/hooks/use-project'
import { useAppSelector, useAppDispatch } from '@/redux/store'
import { updateProject, removeProject } from '@/redux/slice/projects'
import { formatDistanceToNow } from 'date-fns'
import { Plus, MoreVertical, Edit3, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ProjectsList = () => {
    const dispatch = useAppDispatch()
    const { projects, canCreate } = useProjectCreation()
    const user = useAppSelector((state) => state.profile.user)

    const renameProjectMutation = useMutation(api.projects.renameProject)
    const deleteProjectMutation = useMutation(api.projects.deleteProject)

    // Edit/Rename States
    const [editingProject, setEditingProject] = useState<any | null>(null)
    const [newName, setNewName] = useState('')
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [isSavingRename, setIsSavingRename] = useState(false)

    // Delete States
    const [deletingProject, setDeletingProject] = useState<any | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isSavingDelete, setIsSavingDelete] = useState(false)

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingProject || !newName.trim()) return

        setIsSavingRename(true)
        try {
            await renameProjectMutation({
                projectId: editingProject._id as Id<'projects'>,
                name: newName.trim(),
            })
            dispatch(
                updateProject({
                    _id: editingProject._id,
                    name: newName.trim(),
                    projectNumber: editingProject.projectNumber,
                    thumbnail: editingProject.thumbnail,
                    lastModified: Date.now(),
                    createdAt: editingProject.createdAt,
                    isPublic: editingProject.isPublic,
                })
            )
            toast.success('Project renamed successfully!')
            setIsRenameOpen(false)
            setEditingProject(null)
        } catch (error) {
            console.error('Failed to rename project:', error)
            toast.error('Failed to rename project.')
        } finally {
            setIsSavingRename(false)
        }
    }

    const handleDeleteSubmit = async () => {
        if (!deletingProject) return

        setIsSavingDelete(true)
        try {
            await deleteProjectMutation({
                projectId: deletingProject._id as Id<'projects'>,
            })
            dispatch(removeProject(deletingProject._id))
            toast.success('Project deleted successfully!')
            setIsDeleteOpen(false)
            setDeletingProject(null)
        } catch (error) {
            console.error('Failed to delete project:', error)
            toast.error('Failed to delete project.')
        } finally {
            setIsSavingDelete(false)
        }
    }

    if (!canCreate) {
        return (
            <div className="text-center py-12">
                <p className="text-lg">Please sign in to view your projects.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-foreground">
                        Your Projects
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your design projects and continue where you left off.
                    </p>
                </div>
            </div>
            {projects.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        No projects yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Create your first project to get started
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
                    {projects.map((project: any) => (
                        <div key={project._id} className="relative group cursor-pointer border border-transparent rounded-xl p-2 hover:border-white/5 hover:bg-white/5 transition-all">
                            <Link
                                href={`/dashboard/${user?.name}/canvas?project=${project._id}`}
                                className='block space-y-3'
                            >
                                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                                    {project.thumbnail ? (
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.name}
                                            width={300}
                                            height={200}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <Plus className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(project.lastModified), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </Link>

                            {/* Dropdown Options Button (visible on hover) */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <button
                                                id={`project-menu-trigger-${project._id}`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                className="w-8 h-8 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg transition"
                                            >
                                                <MoreVertical className="size-4" />
                                            </button>
                                        }
                                    />
                                    <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl bg-zinc-950 border border-white/10 text-white shadow-2xl">
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setEditingProject(project)
                                                setNewName(project.name)
                                                setIsRenameOpen(true)
                                            }}
                                            className="cursor-pointer hover:bg-white/10 rounded-lg py-2 px-2.5 flex items-center gap-2 text-xs text-zinc-200 hover:text-white transition"
                                        >
                                            <Edit3 className="size-4 text-zinc-400" />
                                            <span>Rename Project</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setDeletingProject(project)
                                                setIsDeleteOpen(true)
                                            }}
                                            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg py-2 px-2.5 flex items-center gap-2 text-xs transition animate-pulse"
                                        >
                                            <Trash2 className="size-4" />
                                            <span>Delete Project</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rename Modal Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={(open) => { if (!open) setIsRenameOpen(false) }}>
                <DialogContent className="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-950/90 text-zinc-100 backdrop-blur-2xl shadow-2xl p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-semibold tracking-tight text-white">Rename Project</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs">
                            Enter a new title for your design project layers compilation.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRenameSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="projectName" className="text-zinc-300 text-xs">Project Title</Label>
                            <Input
                                id="projectName"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="E.g., Landing Page Hero"
                                className="bg-zinc-900/60 border-white/5 text-white"
                                required
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsRenameOpen(false)}
                                className="border-white/10 text-zinc-300 hover:bg-white/5 text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSavingRename || !newName.trim()}
                                className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold"
                            >
                                {isSavingRename ? (
                                    <>
                                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Title'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={(open) => { if (!open) setIsDeleteOpen(false) }}>
                <DialogContent className="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-950/90 text-zinc-100 backdrop-blur-2xl shadow-2xl p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-semibold tracking-tight text-red-400">Delete Project</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-xs font-sans">
                            Are you absolutely sure you want to delete <span className="font-bold text-white font-mono">"{deletingProject?.name}"</span>? This action is permanent and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            className="border-white/10 text-zinc-300 hover:bg-white/5 text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteSubmit}
                            disabled={isSavingDelete}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold"
                        >
                            {isSavingDelete ? (
                                <>
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, Delete Project'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProjectsList