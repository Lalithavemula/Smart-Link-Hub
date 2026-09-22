import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, LogOut, Sun, Moon, Globe, Settings, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">SmartLink Hub</Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 dark:hover:text-primary-400 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                {profile?.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:8081${profile.profileImageUrl}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                ) : profile?.username ? (
                  profile.username.charAt(0).toUpperCase()
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block dark:text-gray-200 pr-2">
                {profile?.username || 'User'}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 text-primary-700 dark:text-primary-400">
                    {profile?.profileImageUrl ? (
                      <img 
                        src={profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:8081${profile.profileImageUrl}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{profile?.name || profile?.username || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <Link 
                    to="/dashboard/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link 
                    to={`/u/${profile?.username}`} 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    View Public Profile
                  </Link>
                  <Link 
                    to="/dashboard/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2" />
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 dark:border-gray-800 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Logout</h3>
              <button onClick={() => setShowLogoutConfirm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm shadow-red-600/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
