import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import { error } from "console"

export const getMoodBoardImages = query({
    args: { projectId: v.id('projects') },
    handler: async (ctx, { projectId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return []
        }

        const project = await ctx.db.get(projectId)
        if (!project || project.userId !== userId) {
            return []
        }

        const storageIds = project.moodBoardImages || []
        const images = await Promise.all(
            storageIds.map(async (storageId, index) => {
                try {
                    const url = await ctx.storage.getUrl(storageId)
                    return {
                        id: `convex-${storageId}`, // Unique ID for client-side tracking
                        storageId,
                        url,
                        uploaded: true,
                        uploading: false,
                        index, // Preserve order
                    }
                } catch (error) {
                    return null
                }
            })
        )

        // Filter out any failed URLs and sort by index
        return images
            .filter((image) => image !== null)
            .sort((a, b) => a!.index - b!.index)
    },
})

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error('Not authenticated')
        return await ctx.storage.generateUploadUrl()
    }
})

export const saveMoodBoardImage = mutation({
    args: { projectId: v.id('projects'), storageId: v.string() },
    handler: async (ctx, { projectId, storageId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error('Not authenticated')

        const project = await ctx.db.get(projectId)
        if (!project || project.userId !== userId) {
            throw new Error('Access denied')
        }

        const currentImages = project.moodBoardImages || []
        await ctx.db.patch(projectId, {
            moodBoardImages: [...currentImages, storageId],
            lastModified: Date.now()
        })
    }
})

export const removeMoodBoardImage = mutation({
    args: { projectId: v.id('projects'), storageId: v.string() },
    handler: async (ctx, { projectId, storageId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error('Not authenticated')

        const project = await ctx.db.get(projectId)
        if (!project || project.userId !== userId) {
            throw new Error('Access denied')
        }

        const currentImages = project.moodBoardImages || []
        await ctx.db.patch(projectId, {
            moodBoardImages: currentImages.filter((id) => id !== storageId),
            lastModified: Date.now()
        })

        try {
            await ctx.storage.delete(storageId)
        } catch (e) {
            console.error("Failed to delete file from storage:", e)
        }
    }
})

export const addMoodBoardImage = mutation({
    args: {
        projectId: v.id('projects'),
        storageId: v.id('_storage'),
    },
    handler: async (ctx, { projectId, storageId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error('Not authenticated')
        }

        // Get the project and verify ownership
        const project = await ctx.db.get(projectId)
        if (!project) {
            throw new Error('Project not found')
        }

        if (project.userId !== userId) {
            throw new Error('Access denied')
        }

        const currentImages = project.moodBoardImages || []
        if (currentImages.length >= 5) {
            throw new Error('Maximum 5 moodboard images allowed')
        }
        const updatedImages = [...currentImages, storageId]
        await ctx.db.patch(projectId, {
            moodBoardImages: updatedImages,
            lastModified: Date.now(),
        })
        return { success: true, imageCount: updatedImages.length }
    },
})