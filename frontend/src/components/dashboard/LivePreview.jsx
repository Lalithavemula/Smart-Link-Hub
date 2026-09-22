import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UserCircle } from 'lucide-react';
import SocialIcons from '../SocialIcons';

export default function LivePreview() {
  const { previewData, previewTheme } = useAppStore();

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium text-center px-4">
        Start editing your profile to see the live preview here.
      </div>
    );
  }

  const themeStyles = {
    default: { bg: 'bg-gray-50 dark:bg-gray-900', text: 'text-gray-900 dark:text-gray-100', card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700', accent: 'bg-gradient-to-br from-primary-400 to-purple-500' },
    developer: { bg: 'bg-[#0a0a0a]', text: 'text-gray-100', card: 'bg-[#111] border-gray-800', accent: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
    creator: { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-gray-900 dark:text-gray-100', card: 'bg-white dark:bg-purple-900 border-purple-100 dark:border-purple-800', accent: 'bg-gradient-to-br from-pink-500 to-rose-500' },
    corporate: { bg: 'bg-slate-100 dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100', card: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700', accent: 'bg-gradient-to-br from-blue-600 to-blue-800' },
    student: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-950 dark:text-emerald-50', card: 'bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-800', accent: 'bg-gradient-to-br from-teal-400 to-emerald-500' },
  };

  const activeTheme = previewData.customTheme || localStorage.getItem('smartlink_theme') || 'default';
  const currentTheme = themeStyles[activeTheme] || themeStyles.default;

  return (
    <div className={`h-full w-full overflow-y-auto hide-scrollbar pb-10 transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text}`}>
      <div className="flex flex-col items-center pt-10 px-4 space-y-6">
        
        {/* Avatar Placeholder */}
        <div className={`w-20 h-20 rounded-full shadow-sm flex items-center justify-center border ${currentTheme.card} ${currentTheme.text}`}>
          <UserCircle className="w-12 h-12 opacity-50" />
        </div>

        {/* Profile Info */}
        <div className="text-center">
          <h1 className="text-lg font-bold">{previewData.username ? `@${previewData.username}` : '@username'}</h1>
          <p className={`mt-2 text-sm max-w-[250px] mx-auto opacity-80`}>
            {previewData.bio || 'Your bio will appear here...'}
          </p>
        </div>

        {/* Social Icons (if previewData has them) */}
        <SocialIcons links={{
          githubUrl: previewData.githubUrl,
          linkedinUrl: previewData.linkedinUrl,
          youtubeUrl: previewData.youtubeUrl,
          twitterUrl: previewData.twitterUrl,
          instagramUrl: previewData.instagramUrl,
        }} />

        {/* Links List */}
        <div className="w-full space-y-3 mt-4">
          {previewData.links && previewData.links.length > 0 ? (
            previewData.links.map((link, idx) => (
              <div
                key={link.id || idx}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl shadow-sm border transition-transform transform hover:-translate-y-1 ${currentTheme.card}`}
              >
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 text-white font-bold flex items-center justify-center text-xs mr-3 ${currentTheme.accent}`}>
                  {link.title ? link.title.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="font-semibold text-sm line-clamp-1">
                  {link.title || 'Untitled Link'}
                </span>
              </div>
            ))
          ) : (
             <div className="text-center text-xs opacity-50 py-4 border border-dashed rounded-xl mt-4">
                Links will appear here
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
