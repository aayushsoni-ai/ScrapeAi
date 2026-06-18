import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Hash, LayoutIcon, Type } from 'lucide-react'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const tabs = [
    {
        value: 'colours',
        label: 'Colours',
        icon: Hash
    },
    {
        value: 'typography',
        label: 'Typography',
        icon: Type
    },
    {
        value: 'moodboard',
        label: 'Moodboard',
        icon: LayoutIcon
    },
] as const

const CanvasLayout = ({ children }: Props) => {
    return (
        <Tabs
            defaultValue="colours"
            className="w-full"
        >
            <div className="mt-36 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center justify-between">
                        <div>
                            <h1 className="text-3xl lg:text-left text-center font-bold text-foreground">
                                Style Guide
                            </h1>
                            <p className="text-muted-foreground mt-2 text-center lg:text-left">
                                Manage your style guide for your project.
                            </p>
                        </div>
                        <TabsList className="flex items-center w-full sm:w-fit gap-1 rounded-full bg-[#131315] border border-white/4 p-5 h-16 font-sans">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="h-8 flex items-center gap-1 rounded-full border border-transparent px-5 text-[13px] font-normal text-[#8E8E95] hover:text-[#D1D1D6] transition-all duration-200 cursor-pointer data-active:bg-[#0C0C0D] dark:data-active:bg-[#0C0C0D] data-active:border-white/8 dark:data-active:border-white/8 data-active:text-white data-active:shadow-sm"
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.value}</span>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {children}
            </div>
        </Tabs>
    )
}

export default CanvasLayout