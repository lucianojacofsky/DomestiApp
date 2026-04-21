import { useAuth } from '../App';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import ProfessionalDashboard from '../components/dashboard/ProfessionalDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

export default function Dashboard() {
  const { user, profile } = useAuth();

  if (!user) return null;

  // Hardcoded admin check for demo purposes
  const isAdminEmail = user.email === 'admin@ejemplo.com';

  if (isAdminEmail || profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (!profile) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  switch (profile.role) {
    case 'client':
      return <ClientDashboard />;
    case 'professional':
      return <ProfessionalDashboard />;
    default:
      return <div>Rol no reconocido</div>;
  }
}
