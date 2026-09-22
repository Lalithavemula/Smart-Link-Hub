import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useLinks } from '../hooks/useLinks';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, UserCircle, QrCode, ArrowRight, BarChart3 } from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();
  
  const { profile, loading: isLoading } = useProfile();

  const { links, fetchLinks } = useLinks();

  React.useEffect(() => {
    if (profile?.id) fetchLinks(profile.id);
  }, [profile, fetchLinks]);

  const calculateCompletion = (profile, links) => {
    if (!profile) return 0;
    let score = 0;
    if (profile.username) score += 25;
    if (profile.bio) score += 25;
    if (profile.profileImageUrl) score += 25;
    if (links && links.length > 0) score += 25;
    return score;
  };

  const completionScore = calculateCompletion(profile, links);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {profile?.name || user?.username}! Here's what's happening.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Links</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{links ? links.length : 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:shadow-md transition-shadow opacity-70">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clicks</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Coming Soon</h3>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Completion Card */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Completion</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Complete your profile to get the most out of SmartLink Hub.</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${completionScore}%` }}
              ></div>
            </div>
            <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{completionScore}%</span>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 text-sm ${profile?.username ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${profile?.username ? 'border-primary-500 bg-primary-50 text-primary-500' : 'border-gray-300'}`}>
                {profile?.username && "✓"}
              </div>
              Create a username
            </div>
            <div className={`flex items-center gap-3 text-sm ${profile?.bio ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${profile?.bio ? 'border-primary-500 bg-primary-50 text-primary-500' : 'border-gray-300'}`}>
                {profile?.bio && "✓"}
              </div>
              Write a short bio
            </div>
            <div className={`flex items-center gap-3 text-sm ${profile?.profileImageUrl ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${profile?.profileImageUrl ? 'border-primary-500 bg-primary-50 text-primary-500' : 'border-gray-300'}`}>
                {profile?.profileImageUrl && "✓"}
              </div>
              Upload a profile picture
            </div>
            <div className={`flex items-center gap-3 text-sm ${links?.length > 0 ? 'text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${links?.length > 0 ? 'border-primary-500 bg-primary-50 text-primary-500' : 'border-gray-300'}`}>
                {links?.length > 0 && "✓"}
              </div>
              Add your first link
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          
          <Link to="/dashboard/links" className="group flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                <LinkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Manage Links</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
          </Link>

          <Link to="/dashboard/profile" className="group flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                {profile?.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:8081${profile.profileImageUrl}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                ) : (
                  <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                )}
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Edit Profile</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
          </Link>

          <Link to="/dashboard/qr" className="group flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                <QrCode className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Get QR Code</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
