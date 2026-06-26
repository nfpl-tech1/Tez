import { Mail, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ProfileData } from "@/lib/types"

interface ProfileSummaryCardProps {
    profile: ProfileData | null;
    showRole?: boolean;
}

export function ProfileSummaryCard({ profile, showRole = true }: ProfileSummaryCardProps) {
    if (!profile) return null;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name & Username */}
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <p className="text-[hsl(var(--muted-foreground))] mb-4">@{profile.username}</p>

                    {/* Info Section */}
                    <div className="w-full pt-4 border-t border-[hsl(var(--border))] space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                            <span className="text-[hsl(var(--muted-foreground))]">{profile.email}</span>
                        </div>
                        {showRole && profile.role && (
                            <div className="flex items-center gap-3 text-sm">
                                <Shield className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                <span className="text-[hsl(var(--muted-foreground))] capitalize">
                                    {profile.role.replace("_", " ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
