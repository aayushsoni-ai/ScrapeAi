'use client'
import { loadProject } from '@/redux/slice/shapes'
import { restoreViewport } from '@/redux/slice/viewport'
import { useAppDispatch } from '@/redux/store'
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode
    initialProject: any
}

const ProjectProvider = ({ children, initialProject }: Props) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (initialProject?._valueJSON) {
            const projectsData = initialProject._valueJSON
            
            if (projectsData.sketchesData) {
                dispatch(loadProject(projectsData.sketchesData))
            }

            if (projectsData.viewportData) {
                dispatch(restoreViewport(projectsData.viewportData))
            }
        }
    }, [dispatch, initialProject])

    return (
        <>{children}</>
    )
}

export default ProjectProvider