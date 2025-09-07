import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, MessageSquare, Star } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import TestimonialForm from './TestimonialForm';
import type { Testimonial } from '~backend/portfolio/list_testimonials';

export default function TestimonialManager() {
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => backend.portfolio.listTestimonials({}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.portfolio.deleteTestimonial({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const testimonials = testimonialsData?.testimonials || [];

  if (isLoading) {
    return <div className="text-center py-8">Loading testimonials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Testimonial Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Testimonial
        </Button>
      </div>

      {showForm && (
        <TestimonialForm
          item={editingItem}
          onClose={handleFormClose}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{testimonial.client_name}</h3>
                {testimonial.client_role && (
                  <p className="text-sm text-muted-foreground">{testimonial.client_role}</p>
                )}
              </div>
              {testimonial.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < testimonial.rating!
                          ? 'text-yellow-500 fill-current'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <blockquote className="text-sm text-muted-foreground mb-4 italic">
              "{testimonial.content}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testimonial.featured && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(testimonial.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(testimonial)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(testimonial.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No testimonials yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
