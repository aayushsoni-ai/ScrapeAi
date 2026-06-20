import Toolbar from '@/components/canvas/toolbar/Toolbar'
import React from 'react'

type Props = {
    children: React.ReactNode
}


const CanvasLayout = ({ children }: Props) => {
    return (
        <div className="w-full h-screen">
            {children}
            <Toolbar />
        </div>
    )
}

export default CanvasLayout