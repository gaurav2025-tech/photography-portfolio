import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import type { BlogPost } from '~backend/portfolio/list_blog';

interface BlogFormProps {
  item?: BlogPost | null;
  onClose: () => void;
}

export default function BlogForm({ item, onClose }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    published: false,
  });

  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || '',
        content: item.content,
        featured_image_url: item.featured_image_url || '',
        published: item.published,
      });
    }
  }, [item]);

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.portfolio.createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog post',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => backend.portfolio.updateBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog post',
        variant: 'destructive',
      });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !item ? generateSlug(title) : prev.slug, // Only auto-generate for new posts
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      featured_image_url: formData.featured_image_url || undefined,
      published: formData.published,
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
      <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold">
            {item ? 'Edit Blog Post' : 'Add New Blog Post'}
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
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              required
              placeholder="blog-post-url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              placeholder="Brief description of the blog post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image URL</label>
            <Input
              type="url"
              value={formData.featured_image_url}
              onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={12}
              required
              placeholder="Write your blog post content here... You can use HTML tags for formatting."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange('published', checked)}
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish immediately
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
