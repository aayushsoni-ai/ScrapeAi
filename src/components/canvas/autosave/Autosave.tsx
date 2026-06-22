'use client'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useAppSelector } from '@/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAutosaveProjectMutation } from '@/redux/api/project'

const AutoSave = () => {
    const searchParams = useSearchParams()
    const projectId = searchParams.get('project')
    const user = useAppSelector((state) => state.profile.user)
    const shapesState = useAppSelector((state) => state.shapes)

    const [autosaveProject, { isLoading: isSaving }] =
        useAutosaveProjectMutation()
    const viewportState = useAppSelector((state) => state.viewport)

    const abortRef = useRef<AbortController | null>(null)
    const debouncerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastSavedRef = useRef<string>('')

    const [saveStatus, setSaveStatus] = useState<
        'idle' | 'saving' | 'saved' | 'error'
    >('idle')

    const isReady = Boolean(projectId && user?.id)

    useEffect(() => {
        if (!isReady) return
        const stateString = JSON.stringify({
            shapes: shapesState,
            viewport: viewportState,
        })

        if (stateString === lastSavedRef.current) return

        if (debouncerRef.current) clearTimeout(debouncerRef.current)
        debouncerRef.current = setTimeout(async () => {
            lastSavedRef.current = stateString
            if (abortRef.current) abortRef.current.abort()
            abortRef.current = new AbortController()
            setSaveStatus('saving')

            try {
                await autosaveProject({
                    projectId: projectId as string,
                    userId: user?.id as string,
                    shapesData: shapesState,
                    viewportData: {
                        scale: viewportState.scale,
                        translate: viewportState.translate,
                    },
                }).unwrap()
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus('idle'), 1500)
            } catch (error) {
                if ((error as Error)?.name === 'AbortError') return
                setSaveStatus('error')
                setTimeout(() => setSaveStatus('idle'), 3000)
            }

        }, 1000)

        return () => {
            if (debouncerRef.current) clearTimeout(debouncerRef.current)
        }

    }, [isReady, shapesState, user?.id, viewportState, projectId, autosaveProject])

    useEffect(() => {
        return () => {
            if (debouncerRef.current) clearTimeout(debouncerRef.current)
            if (abortRef.current) abortRef.current.abort()
        }
    }, [])

    if (!isReady) return null

    if (isSaving) {
        return (
            <div className='flex items-center'>
                <Loader2 className='w-4 h-4 animate-spin' />
            </div>
        )
    }


    switch (saveStatus) {
        case 'saved':
            return (
                <div className="flex items-center">
                    <CheckCircle className="w-4 h-4" />
                </div>
            )
        case 'error':
            return (
                <div className="flex items-center">
                    <AlertCircle className="w-4 h-4" />
                </div>
            )
        default:
            return <></>
    }
}

export default AutoSave