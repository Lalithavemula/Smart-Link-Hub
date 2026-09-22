import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Settings, Globe, Shield, CreditCard, Info, Loader2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const seoSchema = z.object({
  metaTitle: z.string().max(60, 'Meta title should be under 60 characters for best SEO').optional().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description should be under 160 characters').optional().or(z.literal('')),
  ogImage: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
});

const Tooltip = ({ content }) => (
  <div className="group relative flex items-center">
    <Info className="w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors cursor-help" />
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2.5 bg-gray-900 dark:bg-gray-700 text-xs text-white rounded-xl shadow-xl text-center z-10 animate-in fade-in slide-in-from-bottom-1 duration-200">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
    </div>
  </div>
);

export default function DashboardSettings() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(seoSchema),
    mode: 'onChange',
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      ogImage: ''
    }
  });

  const metaTitle = watch('metaTitle') || '';
  const metaDescription = watch('metaDescription') || '';

  useEffect(() => {
    // Load SEO settings from localStorage (MVP implementation)
    const saved = localStorage.getItem('smartlink_seo');
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, [reset]);

  const onSubmit = async (data) => {
    // Simulate API delay for a premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    localStorage.setItem('smartlink_seo', JSON.stringify(data));
    reset(data); // Resets isDirty to false
    toast.success('Settings saved successfully.');
  };

  const handleReset = () => {
    const saved = localStorage.getItem('smartlink_seo');
    if (saved) {
      reset(JSON.parse(saved));
    } else {
      reset({ metaTitle: '', metaDescription: '', ogImage: '' });
    }
    toast('Changes have been reset.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-500" />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your account preferences and public SEO metadata.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Nav/Categories */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-semibold rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all">
            <Globe className="w-5 h-5" /> SEO & Social
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <Shield className="w-5 h-5" /> Privacy & Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <CreditCard className="w-5 h-5" /> Billing & Plan
          </button>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="dark:bg-gray-900 dark:border-gray-800 shadow-sm border-gray-200 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Public Profile SEO</h2>
                  <p className="text-base text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                    Customize how your SmartLink Hub profile appears when shared on search engines and social media platforms like Twitter, LinkedIn, and Facebook.
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Meta Title */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Meta Title</label>
                        <Tooltip content="The title of your profile that appears in browser tabs and search engine results." />
                      </div>
                      <span className={`text-xs font-medium ${metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                        {metaTitle.length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      {...register('metaTitle')}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white
                        ${errors.metaTitle ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'}
                      `}
                      placeholder="e.g. John Doe | Full Stack Developer & Creator"
                    />
                    {errors.metaTitle && (
                      <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> {errors.metaTitle.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Meta Description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Meta Description</label>
                        <Tooltip content="A short summary of your page. High-quality descriptions can improve your search ranking." />
                      </div>
                      <span className={`text-xs font-medium ${metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                        {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      {...register('metaDescription')}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white resize-y min-h-[100px]
                        ${errors.metaDescription ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'}
                      `}
                      placeholder="e.g. Discover all my links, latest projects, and social profiles in one place."
                    />
                    {errors.metaDescription && (
                      <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> {errors.metaDescription.message}
                      </p>
                    )}
                  </div>

                  {/* OG Image */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Open Graph Image URL</label>
                        <Tooltip content="The preview image shown when your link is shared on social media (must be a valid URL)." />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        {...register('ogImage')}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition-all bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white
                          ${errors.ogImage ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-primary-500 focus:ring-primary-500/20'}
                        `}
                        placeholder="https://example.com/my-banner.jpg"
                      />
                      {!errors.ogImage && watch('ogImage') && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in" />
                      )}
                    </div>
                    {errors.ogImage && (
                      <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> {errors.ogImage.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={isSubmitting || !isDirty}
                    className="px-6 py-2.5 rounded-xl font-medium"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Changes
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !isDirty}
                    className="px-8 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-500/20 relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
