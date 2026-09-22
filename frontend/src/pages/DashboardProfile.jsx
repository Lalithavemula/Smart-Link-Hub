import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile';
import { useProfile } from '../hooks/useProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { UserCircle, Camera, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().min(1, 'Display Name is required').max(100, 'Display Name must be less than 100 characters'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export default function DashboardProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const updatePreviewData = useAppStore((state) => state.updatePreviewData);
  const fileInputRef = React.useRef(null);

  const { profile, loading: isLoading, fetchProfile, updateProfile: updateGlobalProfile } = useProfile();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      name: '',
      bio: '',
      githubUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
    }
  });

  // Sync form state to Zustand Live Preview instantly
  const formValues = watch();
  useEffect(() => {
    updatePreviewData(formValues);
  }, [formValues, updatePreviewData]);

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || '',
        name: profile.name || '',
        bio: profile.bio || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        twitterUrl: profile.twitterUrl || '',
      });
      updatePreviewData(profile); // initial sync
    }
  }, [profile, reset, updatePreviewData]);

  const mutation = useMutation({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: async (data) => {
      await updateGlobalProfile(data);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => profileApi.uploadProfileImage(file),
    onSuccess: async () => {
      await fetchProfile();
      toast.success('Profile picture updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    // WORKAROUND: If the profile has a toxic HTTP URL (like https://example.com/image.jpg),
    // clear it with a dummy relative string to bypass the backend's unpatched deleteFile crash before uploading.
    if (profile?.profileImageUrl?.startsWith('http')) {
      profileApi.updateProfile({ ...formValues, profileImageUrl: 'temp_dummy_for_delete.jpg' })
        .then(() => uploadMutation.mutate(file))
        .catch(() => uploadMutation.mutate(file));
    } else {
      uploadMutation.mutate(file);
    }
  };

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading profile data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Details</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Edit your public identity and bio.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
        
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
              {uploadMutation.isPending ? (
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              ) : profile?.profileImageUrl ? (
                <img 
                  src={profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:8081${profile.profileImageUrl}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                />
              ) : (
                <UserCircle className="w-16 h-16 text-gray-400 group-hover:opacity-50 transition-opacity" />
              )}
              
              {!uploadMutation.isPending && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp" 
              onChange={handleImageUpload}
            />
          </div>
          <div className="text-center sm:text-left pt-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Click the avatar to upload a new profile picture. Recommended size: 400x400px. Maximum size: 2MB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
          <Input label="Username" {...register('username')} error={errors.username?.message} />
          <Input label="Display Name" {...register('name')} error={errors.name?.message} placeholder="e.g. John Doe" />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              {...register('bio')}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
              rows={4}
              placeholder="Tell the world about yourself..."
            ></textarea>
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
            <Input label="GitHub URL" {...register('githubUrl')} error={errors.githubUrl?.message} placeholder="https://github.com/..." />
            <Input label="LinkedIn URL" {...register('linkedinUrl')} error={errors.linkedinUrl?.message} placeholder="https://linkedin.com/in/..." />
            <Input label="X (Twitter) URL" {...register('twitterUrl')} error={errors.twitterUrl?.message} placeholder="https://twitter.com/..." />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" isLoading={mutation.isPending} className="px-8 py-3 rounded-xl">
            Save Changes
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
