import { FolderKanban, LayoutDashboard, ListChecks, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Project Workspace</p>
            <h1 className="text-xl font-semibold text-ink">Task Board</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon size={17} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button className="btn-secondary px-3" onClick={logout} title="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}
