import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null
        return await ctx.db.get(userId)
    }
})

export const getUserIdByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, { email }) => {
        const user = await ctx.db
            .query('users')
            .withIndex('email', (q) => q.eq('email', email))
            .first()
        return user?._id ?? null
    },
})

export const updateProfile = mutation({
    args: {
        name: v.optional(v.string()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const patch: { name?: string; image?: string } = {};
        if (args.name !== undefined) patch.name = args.name;
        if (args.image !== undefined) patch.image = args.image;

        await ctx.db.patch(userId, patch);
        return await ctx.db.get(userId);
    },
});