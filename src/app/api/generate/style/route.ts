import { ConsumeCreditsQuery, CreditsBalanceQuery, MoodBoardImagesQuery } from '@/convex/query.config'
import { MoodBoardImage } from '@/hooks/use-styles'
import { prompts } from '@/prompts'
import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import z from 'zod'
import { fetchMutation } from 'convex/nextjs'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
const ColorSwatchSchema = z.object({
    name: z.string(),
    hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color'),
    description: z.string().optional(),
})

const ColorSectionSchema = z.object({
    title: z.enum([
        'Primary Colours',
        'Secondary & Accent Colors',
        'UI Component Colors',
        'Utility & Form Colors',
        'Status & Feedback Colors',
    ]),
    swatches: z.array(ColorSwatchSchema).min(2).max(6),
})

const TypographyStyleSchema = z.object({
    name: z.string(),
    fontFamily: z.string(),
    fontSize: z.string(),
    fontWeight: z.string(),
    lineHeight: z.string(),
    letterSpacing: z.string().optional(),
    description: z.string().optional(),
})

const TypographySectionSchema = z.object({
    title: z.string(),
    styles: z.array(TypographyStyleSchema),
})

const StyleGuideSchema = z.object({
    theme: z.string(),
    description: z.string(),
    colorSections: z.array(ColorSectionSchema).length(5),
    typographySections: z.array(TypographySectionSchema).length(3),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { projectId } = body
        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            )
        }

        const { ok: balanceOk, balance: balanceBalance } =
            await CreditsBalanceQuery()

        // ... earlier balance checks ...
        if (!balanceOk) {
            return NextResponse.json(
                { error: 'Failed to get balance' },
                { status: 500 }
            )
        }

        if (balanceBalance === 0) {
            return NextResponse.json(
                { error: 'No credits available' },
                { status: 400 }
            )
        }


        const moodBoardImages = await MoodBoardImagesQuery(projectId)

        if (!moodBoardImages || moodBoardImages.images._valueJSON.length === 0) {
            return NextResponse.json(
                {
                    error:
                        'No mood board images found. Please upload images to the mood board first.',
                },
                { status: 400 }
            )
        }

        const images = moodBoardImages.images
            ._valueJSON as unknown as MoodBoardImage[]

        const imageUrls = images.map((img) => img.url).filter(Boolean)

        const systemPrompt = prompts.styleGuide.system

        const userPrompt = `Analyze these ${imageUrls.length} mood board images and generate a design system.
Generate exactly 5 color sections in colorSections in this exact order:
1. title: "Primary Colours" with exactly 4 swatches
2. title: "Secondary & Accent Colors" with exactly 4 swatches
3. title: "UI Component Colors" with exactly 6 swatches
4. title: "Utility & Form Colors" with exactly 3 swatches
5. title: "Status & Feedback Colors" with exactly 2 swatches

Also generate exactly 3 typography sections in typographySections.
Extract colors that work harmoniously together and create typography that matches the aesthetic.
Return ONLY the JSON object matching the exact schema structure above.`

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: StyleGuideSchema,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: userPrompt,
                        },
                        ...imageUrls.map((url) => ({
                            type: 'image' as const,
                            image: url as string, // Fix: ensure image is always a string (URL), not undefined
                        })),
                    ],
                },
            ],
        })

        const { ok, balance } = await ConsumeCreditsQuery({ amount: 1 })
        if (!ok) {
            return NextResponse.json(
                { error: 'Failed to consume credits' },
                { status: 500 }
            )
        }

        await fetchMutation(
            api.projects.updateProjectStyleGuide,
            {
                projectId: projectId as Id<'projects'>,
                styleGuideData: result.object,
            },
            { token: await convexAuthNextjsToken() }
        )

        return NextResponse.json({
            success: true,
            styleGuide: result.object,
            message: 'Style guide generated successfully',
            balance,
        })
    } catch (error) {
        console.error('Error generating style guide:', error)
        return NextResponse.json(
            {
                error: 'Failed to generate style guide',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}