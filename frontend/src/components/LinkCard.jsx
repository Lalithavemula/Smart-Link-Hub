import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { GripVertical, Edit2, Trash2, Power, ExternalLink } from 'lucide-react';
import { cn } from './ui/Button';

export default function LinkCard({ link, onEdit, onDelete, onToggleActive }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await onToggleActive(link.id, !link.isActive);
    setLoading(false);
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", !link.isActive && "opacity-60")}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing">
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">{link.title}</h3>
            {link.isActive ? (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Active</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">Inactive</span>
            )}
          </div>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary-600 hover:underline flex items-center gap-1 truncate"
          >
            {link.url} <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleToggle}
            disabled={loading}
            className={cn("p-2 rounded-lg transition-colors", link.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100")}
            title="Toggle Status"
          >
            <Power className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onEdit(link)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(link.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
