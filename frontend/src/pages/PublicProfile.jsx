import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { profileApi } from '../api/profile';
import { linksApi } from '../api/links';
import Loader from '../components/ui/Loader';
import SocialIcons from '../components/SocialIcons';
import { UserCircle, LayoutGrid, List } from 'lucide-react';
import { cn } from '../components/ui/Button';

export const parseLinkTitle = (rawTitle) => {
  const match = rawTitle.match(/^\[(.*?)\] (.*)$/);
  if (match) {
    return { category: match[1], title: match[2] };
  }
  return { category: 'Other', title: rawTitle };
};

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState('list'); // 'list' or 'grid'
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // Load theme from localStorage (MVP implementation)
    const savedTheme = localStorage.getItem('smartlink_theme') || 'default';
    setTheme(savedTheme);
    const loadProfile = async () => {
      try {
        setLoading(true);
        const responseData = await profileApi.getPublicProfile(username);
        if (responseData && responseData.profile) {
          setProfile(responseData.profile);
          
          // The backend already returns active links in the responseData.links array
          // We just need to parse their categories and sort them
          if (responseData.links && Array.isArray(responseData.links)) {
            const parsed = responseData.links
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map(l => ({ ...l, ...parseLinkTitle(l.title) }));
            setLinks(parsed);
          }
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  // Apply SEO Settings (MVP via localStorage for demo)
  useEffect(() => {
    if (profile) {
      const savedSeo = localStorage.getItem('smartlink_seo');
      if (savedSeo) {
        try {
          const seo = JSON.parse(savedSeo);
          
          if (seo.metaTitle) {
            document.title = seo.metaTitle;
          } else {
            document.title = `${profile.username} | SmartLink Hub`;
          }

          // Update Meta Description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
          }
          metaDesc.content = seo.metaDescription || profile.bio || 'Check out my SmartLink Hub profile!';

          // Update OG Image
          let ogImage = document.querySelector('meta[property="og:image"]');
          if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
          }
          if (seo.ogImage) {
            ogImage.content = seo.ogImage;
          }
        } catch (e) {
          // ignore
        }
      } else {
        document.title = `${profile.username} | SmartLink Hub`;
      }
    }
    
    // Cleanup on unmount (optional, but good practice)
    return () => {
      document.title = 'SmartLink Hub';
    };
  }, [profile]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Loader /></div>;
  }

  if (error || !profile) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">{error || 'Profile not found'}</div>;
  }

  // Theme Maps
  const themeStyles = {
    default: { bg: 'bg-gray-50 dark:bg-gray-950', text: 'text-gray-900 dark:text-gray-100', card: 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800', accent: 'bg-gradient-to-br from-primary-400 to-purple-500' },
    developer: { bg: 'bg-[#0a0a0a]', text: 'text-gray-100', card: 'bg-[#111] border-gray-800', accent: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
    creator: { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-gray-900 dark:text-gray-100', card: 'bg-white dark:bg-purple-900 border-purple-100 dark:border-purple-800', accent: 'bg-gradient-to-br from-pink-500 to-rose-500' },
    corporate: { bg: 'bg-slate-100 dark:bg-slate-900', text: 'text-slate-900 dark:text-slate-100', card: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700', accent: 'bg-gradient-to-br from-blue-600 to-blue-800' },
    student: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-950 dark:text-emerald-50', card: 'bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-800', accent: 'bg-gradient-to-br from-teal-400 to-emerald-500' },
  };

  const currentTheme = themeStyles[theme] || themeStyles.default;

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500 relative z-10">
        
        {/* Profile Header */}
        <div className={cn("text-center space-y-4 p-8 rounded-3xl border", currentTheme.card)}>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600 mb-2 overflow-hidden">
            {profile.profileImageUrl ? (
              <img 
                src={profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:8081${profile.profileImageUrl}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <UserCircle className="w-16 h-16" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">@{profile.username}</h1>
            {profile.bio && <p className="mt-3 max-w-md mx-auto text-lg opacity-80">{profile.bio}</p>}
          </div>
          
          <div className="pt-2 flex flex-col items-center gap-4">
            <SocialIcons links={{
              githubUrl: profile.githubUrl,
              linkedinUrl: profile.linkedinUrl,
              youtubeUrl: profile.youtubeUrl,
              twitterUrl: profile.twitterUrl,
              instagramUrl: profile.instagramUrl,
            }} />
            
            {/* Layout Toggle */}
            {links.length > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-max">
                <button 
                  onClick={() => setLayout('list')} 
                  className={cn("p-2 rounded-full transition-all", layout === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400')}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setLayout('grid')} 
                  className={cn("p-2 rounded-full transition-all", layout === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className={cn(
          "transition-all duration-300",
          layout === 'grid' ? "grid grid-cols-2 gap-4" : "space-y-4"
        )}>
          {links.length === 0 ? (
            <p className="text-center py-8 col-span-full opacity-60">No active links available.</p>
          ) : (
            links.map((link, idx) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 border border-white/50 dark:border-gray-700 transition-all transform hover:-translate-y-1 overflow-hidden",
                  layout === 'grid' ? "flex flex-col text-center" : "flex items-center px-4 py-3 w-full"
                )}
              >
                {/* Media Thumbnail Placeholder */}
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center text-white font-bold",
                  currentTheme.accent,
                  layout === 'grid' ? "w-full aspect-video text-2xl" : "w-12 h-12 rounded-xl text-lg mr-4"
                )}>
                  {link.title.charAt(0).toUpperCase()}
                </div>

                <div className={cn(
                  layout === 'grid' ? "p-4" : "flex-1 flex flex-col justify-center text-center pr-12"
                )}>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                    {link.title}
                  </span>
                  {link.category !== 'Other' && layout === 'list' && (
                    <span className="text-xs text-primary-500 mt-1 font-medium">{link.category}</span>
                  )}
                </div>
              </a>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center pt-8">
          <a href="/" className="text-sm font-semibold text-gray-400 hover:text-gray-600">
            Powered by SmartLink Hub
          </a>
        </div>
      </div>
    </div>
  );
}
