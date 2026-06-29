import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Toaster } from "sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/convex/convex-client-provider";
import ReduxProvider from "@/redux/provider";
import { ProfileQuery } from "@/convex/query.config";
import { ConvexUserRaw, normalizeProfile } from "@/types/user";
import { ProfileSync } from "@/components/sections/ProfileSync";


const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScrapeAi — Generative UI Canvas & AI Code Builder",
  description: "Sketch vector wireframes on an interactive canvas, add style guides, and watch Gemini AI compile them into responsive Next.js and Tailwind components in seconds.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const rawProfile = await ProfileQuery()
  const profile = normalizeProfile(
    rawProfile._valueJSON as unknown as ConvexUserRaw | null
  )
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable,)}
      >
        <body className="min-h-full flex flex-col">
          <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>

              <ReduxProvider preloadedState={{ profile: { user: profile } }}>
                <ProfileSync />
                {children}
                <Toaster position="bottom-right" closeButton />
              </ReduxProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
