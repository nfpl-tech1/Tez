import { TeamLayout } from '@/components/layout/TeamLayout';
import { ProfilePage } from '@/components/shared';
import { teamApi } from '@/lib/api';

export default function Profile() {
    const handleUpdateProfile = async (data: Record<string, any>) => {
        await teamApi.updateProfile(data as any);
    };

    return (
        <ProfilePage
            layout={TeamLayout}
            pageTitle="Profile"
            fetchProfile={teamApi.getProfile}
            updateProfile={handleUpdateProfile}
            usernameEditable={false}
            showConfirmPassword={true}
            showRole={true}
        />
    );
}
