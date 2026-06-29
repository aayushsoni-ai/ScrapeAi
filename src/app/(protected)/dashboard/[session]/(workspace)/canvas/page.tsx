
import InfiniteCanvas from '@/components/canvas/InfiniteCanvas'
import ProjectProvider from '@/components/projects/provider'
import { ProjectQuery } from '@/convex/query.config'
import NoProjectSelected from '@/components/shared/NoProjectSelected'
import React from 'react'

interface CanvasPageProps {
    searchParams: Promise<{ project?: string }>
}

const CanvasPage = async ({ searchParams }: CanvasPageProps) => {
    const params = await searchParams
    const projectId = params.project

    if (!projectId) {
        return <NoProjectSelected />
    }

    const { project, profile } = await ProjectQuery(projectId)

    if (!profile) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Authentication required</p>
            </div>
        )
    }
    return (
        <ProjectProvider initialProject={project}>
            <InfiniteCanvas />
        </ProjectProvider>
    )
}

export default CanvasPage

