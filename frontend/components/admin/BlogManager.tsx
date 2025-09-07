import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import BlogForm from './BlogForm';
import type { BlogPost } from '~backend/portfolio/list_blog';

export default function BlogManager() {
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: () => backend.portfolio.listBlog({}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.portfolio.deleteBlogPost({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (item: BlogPost) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const posts = blogData?.posts || [];

  if (isLoading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Blog Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Post
        </Button>
      </div>

      {showForm && (
        <BlogForm
          item={editingItem}
          onClose={handleFormClose}
        />
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start gap-4">
              {post.featured_image_url && (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Slug: /{post.slug}</p>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {post.published && (
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded">
                        Published
                      </span>
                    )}
                    {!post.published && (
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(post.created_at).toLocaleDateString()}
                    {post.published_at && (
                      <span className="ml-4">
                        Published: {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {post.published && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
