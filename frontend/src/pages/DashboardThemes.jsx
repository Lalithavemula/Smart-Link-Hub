import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent } from '../components/ui/Card';
import { Palette, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_THEMES = [
  { id: 'default', name: 'Default Blue', color: 'bg-blue-500', desc: 'The classic SmartLink Hub look.' },
  { id: 'developer', name: 'Developer Dark', color: 'bg-gray-900', desc: 'Sleek, minimal, high contrast.' },
  { id: 'creator', name: 'Creator Pop', color: 'bg-purple-500', desc: 'Vibrant and energetic.' },
  { id: 'corporate', name: 'Corporate Clean', color: 'bg-slate-700', desc: 'Professional and trustworthy.' },
  { id: 'student', name: 'Student Minimal', color: 'bg-emerald-500', desc: 'Fresh and lightweight.' },
];

export default function DashboardThemes() {
  const { previewTheme, updatePreviewData } = useAppStore();
  const [activeTheme, setActiveTheme] = useState('default');

  // Load from local storage for MVP frontend demo
  useEffect(() => {
    const saved = localStorage.getItem('smartlink_theme') || 'default';
    setActiveTheme(saved);
  }, []);

  const handleSelectTheme = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('smartlink_theme', themeId);
    toast.success(`Theme updated to ${themeId}`);
    
    // In a real app, this would save to the backend Profile entity.
    // Here we sync it to Zustand so the Live Preview can update its colors (if implemented).
    updatePreviewData({ customTheme: themeId });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Palette className="w-8 h-8 text-primary-500" />
          Appearance
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize the look and feel of your public profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRESET_THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <Card 
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${isActive ? 'ring-2 ring-primary-500 dark:ring-primary-400 scale-[1.02]' : 'hover:scale-[1.01] dark:bg-gray-800 dark:border-gray-700'}`}
            >
              <CardContent className="p-0">
                <div className={`h-32 rounded-t-xl ${theme.color} w-full relative`}>
                  {isActive && (
                    <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                  {/* Mock UI inside the theme card */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 shadow-sm flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <div className="pt-12 pb-6 px-6 text-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{theme.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{theme.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
