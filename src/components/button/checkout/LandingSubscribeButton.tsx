'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSubscriptionPlan } from '@/hooks/use-billings'
import { useAppSelector } from '@/redux/store'

const LandingSubscribeButton = () => {
    const { isFetching, onSubscribe } = useSubscriptionPlan()
    const user = useAppSelector((state) => state.profile.user)
    const router = useRouter()

    const handleClick = async () => {
        if (!user) {
            router.push('/auth/sign-in')
            return
        }
        await onSubscribe()
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isFetching}
            className="w-full text-center bg-linear-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold py-3.5 rounded-lg transition shadow-lg shadow-purple-500/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isFetching ? (
                <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Redirecting to Checkout...</span>
                </>
            ) : (
                <span>Subscribe Now</span>
            )}
        </button>
    )
}

export default LandingSubscribeButton
