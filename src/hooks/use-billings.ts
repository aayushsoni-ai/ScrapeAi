import { useLazyGetCheckoutQuery } from '@/redux/api/billing'
import { useAppSelector } from '@/redux/store'
import { toast } from 'sonner'

export const useSubscriptionPlan = () => {
    const [trigger, { isFetching }] = useLazyGetCheckoutQuery()
    const user = useAppSelector((state) => state.profile.user)

    const onSubscribe = async () => {
        if (!user?.id) {
            toast.error('You must be logged in to subscribe.')
            return
        }
        try {
            const res = await trigger(user.id).unwrap()
            window.location.href = res.url
        } catch (err) {
            console.error('Checkout error:', err)
            toast.error('Could not start checkout. Please try again.')
        }
    }

    return { onSubscribe, isFetching }
}