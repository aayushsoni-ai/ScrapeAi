import { Polar } from '@polar-sh/sdk'
import SubscribeButton from '@/components/button/checkout/SubscribeButton'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Code, Download, Palette, Sparkles, Zap } from 'lucide-react'
import React from 'react'

const BillingPage = async () => {
  const polar = new Polar({
    server: process.env.POLAR_ENV === "sandbox" ? "sandbox" : "production",
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
  });

  let productName = "Standard Plan";
  let formattedPrice = "$9.99";
  let recurringInterval = "month";

  try {
    const product = await polar.products.get({ id: process.env.POLAR_STANDARD_PLAN! });
    productName = product.name;
    const priceObj = product.prices?.[0];
    if (priceObj) {
      const anyPrice = priceObj as any;
      const priceAmount = anyPrice.price_amount ?? anyPrice.priceAmount;
      const priceCurrency = anyPrice.price_currency ?? anyPrice.priceCurrency;
      const recurringIntervalVal = anyPrice.recurring_interval ?? anyPrice.recurringInterval;

      if (typeof priceAmount === "number") {
        const amount = priceAmount / 100;
        const currency = (priceCurrency as string)?.toUpperCase() || "USD";
        formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      }
      if (recurringIntervalVal) {
        recurringInterval = recurringIntervalVal;
      }
    }
  } catch (error) {
    console.error("Failed to fetch product details from Polar:", error);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-r from-primary to-primary/60 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Unlock ScrapeAI Premium
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Transform your design workflow with AI-powered tools and unlimited
            creativity
          </p>
        </div>
        <Card className="backdrop-blur-xl bg-white/8 border border-white/12 shadow-xl saturate-150">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-xs font-medium rounded-full"
              >
                Most Popular
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              {productName}
            </CardTitle>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-foreground">{formattedPrice}</span>
              <span className="text-muted-foreground text-base">/{recurringInterval}</span>
            </div>
            <CardDescription className="text-muted-foreground text-sm mt-2">
              Get 10 credits every month to power your AI-assisted design
              workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {/* <div className="text-center">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Credits & Core Value: Get flexible, pay-as-you-go credits for UI generation, exports, and premium AI features without a long-term commitment.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                How It Works: One credit covers one full AI task (e.g., sketch-to-code conversions or polished asset exports).
              </p>
            </div> */}

            <h3 className="text-base font-semibold text-foreground text-center mb-3">
              What&apos;s Included
            </h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/8">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center shrink-0">
                  <Palette className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">
                    AI-Powered Design Generation
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Transform sketches into production-ready code
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/8">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center shrink-0">
                  <Download className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">
                    Premium Asset Exports
                  </p>
                  <p className="text-muted-foreground text-xs">
                    High-quality exports in multiple formats
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/8">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center shrink-0">
                  <Code className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">
                    Advanced Processing
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Run complex design operations and transformations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/8">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">
                    10 Monthly Credits
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Flexible usage for your design needs
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm mb-1">
                    Simple Credit System
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Each credit = one AI task. Use them for code generation,
                    asset exports, or any premium feature. Credits refresh
                    monthly, so you always have what you need.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-4 px-6 pb-6">
            <SubscribeButton />
            <p className="text-muted-foreground text-xs text-center">
              Cancel anytime • No setup fees • Instant access
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default BillingPage