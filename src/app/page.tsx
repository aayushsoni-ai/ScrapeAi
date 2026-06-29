import { ProfileQuery } from '@/convex/query.config'
import { ConvexUserRaw, normalizeProfile } from '@/types/user'
import LandingPage from '@/components/sections/LandingPage'
import { Polar } from '@polar-sh/sdk'

export default async function Home() {
    const rawProfile = await ProfileQuery()
    const profile = normalizeProfile(
        rawProfile._valueJSON as unknown as ConvexUserRaw | null
    )

    const isAuthenticated = !!profile

    // Fetch Polar Standard Plan details
    const polar = new Polar({
        server: process.env.POLAR_ENV === "sandbox" ? "sandbox" : "production",
        accessToken: process.env.POLAR_ACCESS_TOKEN!,
    })

    let productName = "Standard Plan"
    let formattedPrice = "₹749"
    let recurringInterval = "month"

    try {
        const product = await polar.products.get({ id: process.env.POLAR_STANDARD_PLAN! })
        productName = product.name
        const priceObj = product.prices?.[0]
        if (priceObj) {
            const anyPrice = priceObj as any
            const priceAmount = anyPrice.price_amount ?? anyPrice.priceAmount
            const priceCurrency = anyPrice.price_currency ?? anyPrice.priceCurrency
            const recurringIntervalVal = anyPrice.recurring_interval ?? anyPrice.recurringInterval

            if (typeof priceAmount === "number") {
                const amount = priceAmount / 100
                const currency = (priceCurrency as string)?.toUpperCase() || "INR"
                formattedPrice = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(amount)
            }
            if (recurringIntervalVal) {
                recurringInterval = recurringIntervalVal
            }
        }
    } catch (error) {
        console.error("Failed to fetch product details from Polar:", error)
    }

    return (
        <LandingPage 
            isAuthenticated={isAuthenticated} 
            productName={productName}
            formattedPrice={formattedPrice}
            recurringInterval={recurringInterval}
        />
    )
}
