'use client'
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useEffect } from "react"
import { useAppDispatch } from "@/redux/store"
import { setProfile } from "@/redux/slice/profile"
import { normalizeProfile, ConvexUserRaw } from "@/types/user"

export function ProfileSync() {
    const dispatch = useAppDispatch()
    const currentUser = useQuery(api.user.getCurrentUser)

    useEffect(() => {
        if (currentUser !== undefined) {
            dispatch(setProfile(normalizeProfile(currentUser as ConvexUserRaw | null)))
        }
    }, [currentUser, dispatch])

    return null
}
