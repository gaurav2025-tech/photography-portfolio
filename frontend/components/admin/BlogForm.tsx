import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from './ImageUpload';
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
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');

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
        meta_title: item.meta_title || '',
        meta_description: item.meta_description || '',
        meta_keywords: item.meta_keywords || '',
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
      slug: !item ? generateSlug(title) : prev.slug,
      meta_title: !item || !prev.meta_title ? title : prev.meta_title,
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
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      meta_keywords: formData.meta_keywords || undefined,
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
      <div className="bg-card rounded-lg border border-border max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold">
            {item ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
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
                <label className="block text-sm font-medium mb-4">Featured Image</label>
                <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'upload' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="mt-4">
                    <ImageUpload
                      value={formData.featured_image_url}
                      onChange={(url) => handleInputChange('featured_image_url', url)}
                      folder="blog/featured"
                    />
                  </TabsContent>
                  
                  <TabsContent value="url" className="mt-4">
                    <Input
                      type="url"
                      value={formData.featured_image_url}
                      onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </TabsContent>
                </Tabs>
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
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 mt-6">
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-foreground mb-2">SEO Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Optimize your blog post for search engines by setting custom meta tags.
                  If left empty, the system will use defaults based on your title and excerpt.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Title
                  <span className="text-xs text-muted-foreground ml-2">(max 150 characters)</span>
                </label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  maxLength={150}
                  placeholder="SEO-optimized title for search engines"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.meta_title.length}/150 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                  <span className="text-xs text-muted-foreground ml-2">(max 300 characters)</span>
                </label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Brief, compelling description that will appear in search results"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.meta_description.length}/300 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Keywords
                  <span className="text-xs text-muted-foreground ml-2">(comma-separated)</span>
                </label>
                <Input
                  value={formData.meta_keywords}
                  onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  placeholder="photography, wedding, portrait, videography"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter relevant keywords separated by commas. Keep it focused and relevant.
                </p>
              </div>

              {/* SEO Preview */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h5 className="font-medium text-foreground mb-3">Search Engine Preview</h5>
                <div className="space-y-2">
                  <div className="text-blue-600 text-lg font-medium">
                    {formData.meta_title || formData.title || 'Your Blog Post Title'}
                  </div>
                  <div className="text-green-700 text-sm">
                    https://yoursite.com/blog/{formData.slug || 'your-post-slug'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.meta_description || formData.excerpt || 'Your blog post description will appear here...'}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-6 border-t border-border mt-6">
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
