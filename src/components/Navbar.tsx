import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../lib/firebase';
import { Button } from './ui/button';
import { Home, LogOut, User, LayoutDashboard, MessageSquare, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Domesti<span className="text-primary">App</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Panel</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 hidden md:block" />
              <div className="flex items-center gap-3 pl-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-slate-900 leading-none">{profile?.name || 'Usuario'}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1">{profile?.role || 'Admin'}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-xl">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-bold text-slate-600 hover:text-primary rounded-xl px-6">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button className="btn-primary rounded-xl px-6 font-bold">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
