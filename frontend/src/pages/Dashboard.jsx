import React, { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useLinks } from '../hooks/useLinks';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import SortableLinkCard from '../components/SortableLinkCard';
import Loader from '../components/ui/Loader';
import { Plus, Tag } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppStore } from '../store/useAppStore';

const CATEGORIES = ['Social', 'Portfolio', 'Resume', 'Contact', 'Projects', 'Other'];

export const parseLinkTitle = (rawTitle) => {
  const match = rawTitle.match(/^\[(.*?)\] (.*)$/);
  if (match) {
    return { category: match[1], title: match[2] };
  }
  return { category: 'Other', title: rawTitle };
};

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const { links, loading: linksLoading, fetchLinks, createLink, updateLink, deleteLink, setLinks } = useLinks();
  const { addToast } = useToast();
  const updatePreviewData = useAppStore(state => state.updatePreviewData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '', category: 'Social', customCategory: '', active: true, sortOrder: 0 });
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (profile?.id) {
      fetchLinks(profile.id);
    }
  }, [profile, fetchLinks]);

  // Sync links to Live Preview
  useEffect(() => {
    if (links) {
      const parsedLinks = links.map(l => ({ ...l, ...parseLinkTitle(l.title) }));
      updatePreviewData({ links: parsedLinks });
    }
  }, [links, updatePreviewData]);

  const handleOpenModal = (link = null) => {
    if (link) {
      setEditingLink(link);
      const parsed = parseLinkTitle(link.title);
      const isCustom = !CATEGORIES.includes(parsed.category);
      setFormData({ 
        title: parsed.title, 
        category: isCustom ? 'Other' : parsed.category, 
        customCategory: isCustom ? parsed.category : '',
        url: link.url, 
        active: link.active ?? link.isActive ?? true, 
        sortOrder: link.sortOrder 
      });
    } else {
      setEditingLink(null);
      setFormData({ title: '', url: '', category: 'Social', customCategory: '', active: true, sortOrder: links.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;
    setSubmitting(true);
    
    // Combine category and title
    const resolvedCategory = formData.category === 'Other' && formData.customCategory.trim() !== '' 
      ? formData.customCategory.trim() 
      : formData.category;
    const finalTitle = `[${resolvedCategory}] ${formData.title}`;
    const payload = { ...formData, title: finalTitle };

    try {
      if (editingLink) {
        await updateLink(profile.id, editingLink.id, payload);
        addToast('Link updated successfully', 'success');
      } else {
        await createLink(profile.id, payload);
        addToast('Link created successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      addToast(error.response?.data?.message || 'Action failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (linkId, active) => {
    if (!profile?.id) return;
    try {
      const link = links.find(l => l.id === linkId);
      await updateLink(profile.id, linkId, { ...link, active });
      addToast('Status updated', 'success');
    } catch (error) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (linkId) => {
    if (!profile?.id || !window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteLink(profile.id, linkId);
      addToast('Link deleted', 'success');
    } catch (error) {
      addToast('Failed to delete link', 'error');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      
      const newLinks = arrayMove(links, oldIndex, newIndex);
      // Optimistic update
      setLinks(newLinks); 
      
      // Send updates to backend (mocking bulk update or sequential)
      try {
        const linkToUpdate = newLinks[newIndex];
        await updateLink(profile.id, linkToUpdate.id, { ...linkToUpdate, sortOrder: newIndex });
      } catch (err) {
        addToast('Failed to save new order', 'error');
      }
    }
  };

  if (profileLoading || (linksLoading && links.length === 0)) {
    return <div className="flex justify-center py-12"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Links</h1>
          <p className="text-gray-500 mt-1">Manage your public links</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-5 h-5" /> Add New Link
        </Button>
      </div>

      <div className="space-y-4">
        {links.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">You don't have any links yet.</p>
            <Button variant="secondary" className="mt-4" onClick={() => handleOpenModal()}>
              Create your first link
            </Button>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={links.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {links.map(link => (
                <SortableLinkCard 
                  key={link.id} 
                  link={link} 
                  onEdit={handleOpenModal} 
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingLink ? 'Edit Link' : 'Add New Link'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Tag className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {formData.category === 'Other' && (
            <Input
              label="Custom Category Name"
              placeholder="e.g. Merchandise"
              value={formData.customCategory}
              onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
              required
            />
          )}
          <Input
            label="Title"
            placeholder="e.g. My Portfolio"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="URL"
            type="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            required
          />
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="active" 
              checked={formData.active}
              onChange={e => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Set as Active</label>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>
              {editingLink ? 'Save Changes' : 'Add Link'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
