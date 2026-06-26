import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProfilePage } from '@/components/shared';
import { adminApi } from '@/lib/api';

export default function AdminProfile() {
    const handleUpdateProfile = async (data: Record<string, any>) => {
        await adminApi.updateProfile(data as any);
    };

    return (
        <ProfilePage
            layout={AdminLayout}
            pageTitle="My Profile"
            fetchProfile={adminApi.getProfile}
            updateProfile={handleUpdateProfile}
            usernameEditable={true}
            showConfirmPassword={true}
            showRole={false}
        />
    );
}
