import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type SidebarProps = {
  role: string | null;
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const base = role === 'librarian' ? '/librarian' : '/member';

  const links = role === 'librarian'
    ? [
        { to: `${base}/dashboard`, label: 'Dashboard' },
        { to: `${base}/books`, label: 'Manage Books' },
        { to: `${base}/copies`, label: 'Book Copies' },
        { to: `${base}/loans`, label: 'All Loans' },
        { to: `${base}/returns`, label: 'Process Returns' },
        { to: `${base}/fines`, label: 'Fine Payments' },
        { to: `${base}/settings`, label: 'Library Settings' },
      ]
    : [
        { to: `${base}/dashboard`, label: 'Dashboard' },
        { to: `${base}/books`, label: 'Browse Books' },
        { to: `${base}/loans`, label: 'My Loans' },
        { to: `${base}/reservations`, label: 'My Reservations' },
        { to: `${base}/fines`, label: 'My Fines' },
        { to: `${base}/account`, label: 'Account Details' },
      ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        <div className="p-4 border-b">
          <div className="font-bold text-xl text-blue-900 tracking-tight">Library System</div>
          <div className="text-xs text-gray-500 capitalize mt-1">Logged as {role ?? 'User'}</div>
        </div>
        <nav className="flex flex-col p-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded text-sm transition ${
                location.pathname.startsWith(link.to)
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t space-y-2">
        <div className="text-xs text-gray-500 truncate" title={user?.email}>
          {user?.email}
        </div>
        <button
          onClick={() => signOut()}
          className="w-full px-3 py-2 text-sm text-left font-medium text-red-600 rounded hover:bg-red-50 transition"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

