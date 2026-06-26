'use client'
import { Redo2, Undo2 } from 'lucide-react'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { undo, redo } from '@/redux/slice/shapes'

const HistoryPull = () => {
    const dispatch = useAppDispatch()
    const past = useAppSelector((state) => state.shapes.past || [])
    const future = useAppSelector((state) => state.shapes.future || [])

    const canUndo = past.length > 0
    const canRedo = future.length > 0

    return (
        <div className="col-span-1 flex justify-start items-center">
            <div
                className="inline-flex items-center rounded-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] p-2 text-neutral-300 saturate-150"
            >
                <button
                    onClick={() => canUndo && dispatch(undo())}
                    disabled={!canUndo}
                    className={[
                        "inline-grid h-9 w-9 place-items-center rounded-full transition-all focus:outline-none",
                        canUndo
                            ? "hover:bg-white/[0.12] cursor-pointer text-neutral-100"
                            : "opacity-30 cursor-not-allowed text-neutral-500"
                    ].join(' ')}
                    title="Undo (Cmd+Z)"
                >
                    <Undo2
                        size={18}
                        className="opacity-80 stroke-[1.75]"
                    />
                </button>

                <span className="mx-1 h-5 w-px rounded bg-white/[0.16]" />

                <button
                    onClick={() => canRedo && dispatch(redo())}
                    disabled={!canRedo}
                    className={[
                        "inline-grid h-9 w-9 place-items-center rounded-full transition-all focus:outline-none",
                        canRedo
                            ? "hover:bg-white/[0.12] cursor-pointer text-neutral-100"
                            : "opacity-30 cursor-not-allowed text-neutral-500"
                    ].join(' ')}
                    title="Redo (Cmd+Shift+Z)"
                >
                    <Redo2
                        size={18}
                        className="opacity-80 stroke-[1.75]"
                    />
                </button>
            </div>
        </div>
    )
}

export default HistoryPull