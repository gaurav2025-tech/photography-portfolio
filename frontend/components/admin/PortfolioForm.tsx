import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import type { PortfolioItem } from '~backend/portfolio/list_portfolio';
import type { Category } from '~backend/portfolio/list_categories';

interface PortfolioFormProps {
  item?: PortfolioItem | null;
  categories: Category[];
  onClose: () => void;
}

export default function PortfolioForm({ item, categories, onClose }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    category_id: '',
    featured: false,
    sort_order: 0,
  });

  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        image_url: item.image_url,
        thumbnail_url: item.thumbnail_url || '',
        category_id: item.category_id.toString(),
        featured: item.featured,
        sort_order: item.sort_order,
      });
    }
  }, [item]);

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.portfolio.createPortfolioItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast({
        title: 'Success',
        description: 'Portfolio item created successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create portfolio item',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => backend.portfolio.updatePortfolioItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast({
        title: 'Success',
        description: 'Portfolio item updated successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update portfolio item',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      category_id: parseInt(formData.category_id),
      thumbnail_url: formData.thumbnail_url || undefined,
      description: formData.description || undefined,
    };

    if (item) {
      updateMutation.mutate({ ...data, id: item.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold">
            {item ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL *</label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
            <Input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort Order</label>
            <Input
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured item
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : item
                ? 'Update'
                : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
