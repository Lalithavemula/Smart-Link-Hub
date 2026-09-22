import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from './ui/Card';
import { GripVertical, Edit2, Trash2, Power, ExternalLink } from 'lucide-react';
import { cn } from './ui/Button';

export default function SortableLinkCard({ link, onEdit, onDelete, onToggleActive }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleToggle = async (e) => {
    e.stopPropagation(); // prevent drag
    await onToggleActive(link.id, !(link.active ?? link.isActive));
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("relative group", isDragging && "opacity-50 scale-[1.02] z-50")}>
      <Card className={cn(
        "transition-all duration-200", 
        !(link.active ?? link.isActive) && "opacity-60 grayscale-[0.5]",
        "md:border-x-0 md:border-t-0 md:border-b md:rounded-none md:shadow-none hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}>
        <CardContent className="p-4 md:py-3 md:px-2 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div 
              className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 active:cursor-grabbing p-2 -ml-2"
              {...attributes} 
              {...listeners}
            >
              <GripVertical className="w-5 h-5" />
            </div>
            
            {/* Thumbnail Placeholder */}
            <div className="w-12 h-12 md:w-10 md:h-10 rounded-lg flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold md:text-sm shadow-sm">
              {link.title ? link.title.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
            
          <div className="flex-1 min-w-0 md:flex md:items-center md:gap-4 md:justify-between ml-12 md:ml-0">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{link.title}</h3>
              {link.category && link.category !== 'Other' && (
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium border border-gray-200 dark:border-gray-700">
                  {link.category}
                </span>
              )}
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 truncate max-w-[250px]"
              >
                {link.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            
            <div className="hidden md:flex items-center gap-2 mr-4">
              {(link.active ?? link.isActive) ? (
                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">Active</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">Inactive</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-1 md:gap-2 ml-12 md:ml-0 mt-3 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleToggle}
              className={cn("p-2 rounded-lg transition-colors", (link.active ?? link.isActive) ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800")}
              title="Toggle Status"
            >
              <Power className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onEdit(link)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(link.id)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
