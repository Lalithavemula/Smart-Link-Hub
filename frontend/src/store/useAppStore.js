import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Live Preview State
  previewData: null,
  setPreviewData: (data) => set({ previewData: data }),
  updatePreviewData: (updates) => set((state) => ({ 
    previewData: { ...state.previewData, ...updates } 
  })),

  // Global Dashboard Preferences
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // Theme Overrides for Preview
  previewTheme: 'light',
  setPreviewTheme: (theme) => set({ previewTheme: theme }),
}));
