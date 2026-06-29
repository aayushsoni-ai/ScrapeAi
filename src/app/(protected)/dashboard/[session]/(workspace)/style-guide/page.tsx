import { ThemeContent } from '@/components/styles/ThemeContent'
import StyleGuideTypography from '@/components/styles/Typography'
import { TabsContent } from '@/components/ui/tabs'
import { MoodBoardImagesQuery, StyleGuideQuery } from '@/convex/query.config'
import { MoodBoardImages } from '@/hooks/use-styles'
import { StyleGuide } from '@/redux/api/style-guide'
import { Palette } from 'lucide-react'
import React from 'react'
import MoodBoard from '@/components/styles/MoodBoard'
import NoProjectSelected from '@/components/shared/NoProjectSelected'
type Props = {
  searchParams: Promise<{
    project: string
  }>
}

const StyleGuidePage = async ({ searchParams }: Props) => {
  const projectId = (await searchParams).project

  if (!projectId) {
    return <NoProjectSelected />
  }

  const existingStyleGuide = await StyleGuideQuery(projectId)
  const guide = existingStyleGuide.styleGuide?._valueJSON as unknown as StyleGuide

  const colorGuide = guide?.colorSections || []
  const typographyGuide = guide?.typographySections || []

  const existingMoodBoardImages = await MoodBoardImagesQuery(projectId)
  const guideImages = existingMoodBoardImages.images._valueJSON as unknown as MoodBoardImages[]

  return (
    <div>
      <TabsContent
        value='colours'
        className="space-y-8"
      >
        {!guideImages.length ? (
          <div className="space-y-8">
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                <Palette className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No colors generated yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Upload images to your mood board and generate an AI-powered
                style guide with colors and typography.
              </p>
            </div>
          </div>
        ) : (
          <ThemeContent colorGuide={colorGuide} />
        )}

      </TabsContent>

      <TabsContent value="typography">
        <StyleGuideTypography typographyGuide={typographyGuide} />
      </TabsContent>

      <TabsContent value="moodboard">
        <MoodBoard guideImages={guideImages} />

      </TabsContent>
    </div >
  )
}

export default StyleGuidePage

