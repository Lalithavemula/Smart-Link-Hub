import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Link as LinkIcon, BarChart3, QrCode, Palette, Settings, X, ExternalLink } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { profile } = useProfile();

  const links = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { to: '/dashboard/profile', label: 'Profile', icon: <UserCircle className="w-5 h-5" /> },
    { to: '/dashboard/links', label: 'Links', icon: <LinkIcon className="w-5 h-5" /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/dashboard/qr', label: 'QR Center', icon: <QrCode className="w-5 h-5" /> },
    { to: '/dashboard/themes', label: 'Themes', icon: <Palette className="w-5 h-5" /> },
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100 dark:border-gray-800">
          <span className="font-semibold text-gray-900 dark:text-gray-100">Menu</span>
          <button onClick={onClose} className="p-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-1">
            {links.map((link) => {
              const isActive = link.exact 
                ? location.pathname === link.to 
                : location.pathname.startsWith(link.to);
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
                  onClick={() => window.innerWidth < 768 && onClose()}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {profile?.username && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Link 
              to={`/u/${profile.username}`} 
              target="_blank"
              className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors border border-gray-200 dark:border-gray-700 shadow-sm group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                  {profile?.profileImageUrl ? (
                    <img 
                      src={profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:8081${profile.profileImageUrl}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <UserCircle className="w-5 h-5" />
                  )}
                </div>
                <span>View Profile</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
