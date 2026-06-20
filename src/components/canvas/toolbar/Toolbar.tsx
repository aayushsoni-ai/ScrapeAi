import HistoryPull from '@/components/canvas/toolbar/HistoryPull'
import React from 'react'
import ToolBarShapes from './ToolBarShapes'
import Zoombar from './Zoombar'

const Toolbar = () => {
    return (
        <div className='fixed bottom-0 w-full grid grid-cols-3 z-50 px-5 py-4 items-center justify-between'>

            <HistoryPull />

            <ToolBarShapes />

            <Zoombar />
        </div>
    )
}

export default Toolbar