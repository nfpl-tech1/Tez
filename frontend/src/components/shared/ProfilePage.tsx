import { useState, useEffect, type ReactNode } from "react"
import { LoadingState } from "./LoadingState"
import { ProfileSummaryCard, ProfileEditForm } from "./profile"
import type { ProfileData } from "@/lib/types"

export type { ProfileData } // Re-export for backward compatibility if needed, or remove?
// Given I moved it, other files might import it from here?
// grep check? "import { ProfileData } from ...ProfilePage"
// AdminProfile.tsx might use it.
// I'll re-export it to be safe or update imports?
// Re-exporting: export type { ProfileData } from '@/lib/types';
// But better to update consumers.
// I'll start with just importing it. If build fails, I'll fix consumers.
// Actually, `ProfilePage` exported `ProfileData`.
// I'll add `export type { ProfileData } from "@/lib/types"` line.

export interface ProfilePageProps {
    /** Layout component that wraps the profile page */
    layout: React.ComponentType<{ title: string; children: ReactNode }>
    /** Page title shown in the layout */
    pageTitle: string
    /** Function to fetch the user's profile data */
    fetchProfile: () => Promise<ProfileData>
    /** Function to update the user's profile */
    updateProfile: (data: Record<string, unknown>) => Promise<unknown>
    /** Whether the username field is editable (default: false for team, true for admin) */
    usernameEditable?: boolean
    /** Whether to show confirm password field (default: true) */
    showConfirmPassword?: boolean
    /** Whether to show the role badge in the profile card */
    showRole?: boolean
}

export function ProfilePage({
    layout: Layout,
    pageTitle,
    fetchProfile,
    updateProfile,
    usernameEditable = false,
    showConfirmPassword = true,
    showRole = true,
}: ProfilePageProps) {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const data = await fetchProfile()
            setProfile(data)
        } catch (err) {
            console.error("Failed to load profile:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (data: Record<string, unknown>) => {
        try {
            await updateProfile(data)
            // Refresh profile data
            const updatedProfile = await fetchProfile()
            setProfile(updatedProfile)
        } catch (err: any) {
            // Throw error with message for the form to catch and display
            const msg = err.response?.data?.detail || "Failed to update profile";
            throw new Error(msg);
        }
    }

    if (loading) {
        return (
            <Layout title={pageTitle}>
                <LoadingState fullScreen message="Loading profile..." />
            </Layout>
        )
    }

    return (
        <Layout title={pageTitle}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card - Left Side */}
                <div className="lg:col-span-1">
                    <ProfileSummaryCard profile={profile} showRole={showRole} />
                </div>

                {/* Edit Form - Right Side */}
                <div className="lg:col-span-2">
                    {profile && (
                        <ProfileEditForm
                            initialData={profile}
                            onSubmit={handleUpdate}
                            usernameEditable={usernameEditable}
                            showConfirmPassword={showConfirmPassword}
                        />
                    )}
                </div>
            </div>
        </Layout>
    )
}
