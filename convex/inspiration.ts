import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error('Not authenticated')
        }

        // Generate upload URL that expires in 1 hour
        return await ctx.storage.generateUploadUrl()
    },
})

export const getInspirationImages = query({
    args: {
        projectId: v.id('projects'),
    },
    handler: async (ctx, { projectId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return []
        }

        // Get the project and verify ownership
        const project = await ctx.db.get(projectId)
        if (!project || project.userId !== userId) {
            return []
        }

        // Get storage IDs
        const storageIds = project.inspirationImages || []

        // Generate URLs for each image
        const images = await Promise.all(
            storageIds.map(async (storageId, index) => {
                try {
                    const url = await ctx.storage.getUrl(storageId)
                    return {
                        id: `inspiration-${storageId}`, // Unique ID for client-side tracking
                        storageId,
                        url,
                        uploaded: true,
                        uploading: false,
                        index, // Preserve order
                    }
                } catch (error) {
                    console.warn(
                        `⚠️ [Convex] Failed to get URL for inspiration storage ID ${storageId}:`,
                        error
                    )
                    return null
                }
            })
        )

        // Filter out any failed URLs and sort by index
        const validImages = images
            .filter((image) => image !== null)
            .sort((a, b) => a!.index - b!.index)

        return validImages
    },
})


export const addInspirationImage = mutation({
    args: {
        projectId: v.id('projects'),
        storageId: v.id('_storage'),
    },
    handler: async (ctx, { projectId, storageId }) => {
        // 1. Authenticate the user session
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error('Not authenticated')
        }

        // 2. Fetch the project and verify existence
        const project = await ctx.db.get(projectId)
        if (!project) {
            throw new Error('Project not found')
        }

        // 3. Authorization check: Ensure user owns the project
        if (project.userId !== userId) {
            throw new Error('Not authorized to modify this project')
        }

        // 4. De-duplicate check: Prevent adding the exact same storage item twice
        const currentImages = project.inspirationImages || []
        if (currentImages.includes(storageId)) {
            return { success: true, message: 'Image already added' }
        }

        // 5. Guard check: Enforce maximum image ceiling limits
        if (currentImages.length >= 6) {
            throw new Error('Maximum of 6 inspiration images allowed per project')
        }

        // 6. Append the new storage entry and patch the database array
        const updatedImages = [...currentImages, storageId];

        await ctx.db.patch(projectId, {
            inspirationImages: updatedImages,
            lastModified: Date.now(),
        })

        return {
            success: true,
            message: 'Inspiration image added successfully',
            totalImages: updatedImages.length,
        }
    },
})

export const removeInspirationImage = mutation({
    args: {
        projectId: v.id('projects'),
        storageId: v.id('_storage'),
    },
    handler: async (ctx, { projectId, storageId }) => {
        // 1. Authenticate the user session
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error('Not authenticated')
        }

        // 2. Fetch the project and verify existence
        const project = await ctx.db.get(projectId)
        if (!project) {
            throw new Error('Project not found')
        }

        // 3. Authorization check: Ensure user owns the project
        if (project.userId !== userId) {
            throw new Error('Not authorized to modify this project')
        }

        const currentImages = project.inspirationImages || []

        // 4. Filter out the specific storageId from your array reference
        const updatedImages = currentImages.filter((id) => id !== storageId)

        // 5. Only proceed with database adjustments if the target item was found
        if (currentImages.length !== updatedImages.length) {
            await ctx.db.patch(projectId, {
                inspirationImages: updatedImages,
                lastModified: Date.now(),
            })

            // 6. Optimal Housekeeping: Wipe the actual binary payload file out of storage buckets
            try {
                await ctx.storage.delete(storageId)
            } catch (storageError) {
                // Log warning but prevent failing the whole transaction if the file was missing
                console.warn(
                    `⚠️ [Convex] Reference removed, but failed to delete asset ${storageId} from file storage:`,
                    storageError
                )
            }
        }

        return {
            success: true,
            message: 'Inspiration image removed successfully',
            totalImages: updatedImages.length,
        }
    },
})