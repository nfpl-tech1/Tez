import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryProvider } from '@/providers';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import TeamMembers from '@/pages/admin/TeamMembers';
import PendingTools from '@/pages/admin/PendingTools';
import ReviewTool from '@/pages/admin/ReviewTool';
import Departments from '@/pages/admin/Departments';
import AdminProfile from '@/pages/admin/AdminProfile';
import AdminEditTool from '@/pages/admin/EditTool';
import AdminAllTools from '@/pages/admin/AdminAllTools';
import Dashboard from '@/pages/team/Dashboard';
import AllTools from '@/pages/team/AllTools';
import UploadTool from '@/pages/team/UploadTool';
import EditTool from '@/pages/team/EditTool';
import Issues from '@/pages/team/Issues';
import Profile from '@/pages/team/Profile';
import PublicTools from '@/pages/public/PublicTools';
import ToolDetail from '@/pages/public/ToolDetail';

// Protected Route Components
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'team_member' }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/team/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--primary))]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicTools />} />
      <Route path="/tools" element={<PublicTools />} />
      <Route path="/tools/:id" element={<ToolDetail />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/team/dashboard'} /> : <LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/team-members" element={<ProtectedRoute requiredRole="admin"><TeamMembers /></ProtectedRoute>} />
      <Route path="/admin/tools/pending" element={<ProtectedRoute requiredRole="admin"><PendingTools /></ProtectedRoute>} />
      <Route path="/admin/tools" element={<ProtectedRoute requiredRole="admin"><AdminAllTools /></ProtectedRoute>} />
      <Route path="/admin/tools/:id/review" element={<ProtectedRoute requiredRole="admin"><ReviewTool /></ProtectedRoute>} />
      <Route path="/admin/tools/:id/edit" element={<ProtectedRoute requiredRole="admin"><AdminEditTool /></ProtectedRoute>} />
      <Route path="/admin/departments" element={<ProtectedRoute requiredRole="admin"><Departments /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminProfile /></ProtectedRoute>} />

      {/* Team Member Routes */}
      <Route path="/team/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/team/tools" element={<ProtectedRoute><AllTools /></ProtectedRoute>} />
      <Route path="/team/tools/new" element={<ProtectedRoute><UploadTool /></ProtectedRoute>} />
      <Route path="/team/tools/:id/edit" element={<ProtectedRoute><EditTool /></ProtectedRoute>} />
      <Route path="/team/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
      <Route path="/team/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
