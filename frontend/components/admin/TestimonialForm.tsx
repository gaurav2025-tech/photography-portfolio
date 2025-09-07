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
import type { Testimonial } from '~backend/portfolio/list_testimonials';

interface TestimonialFormProps {
  item?: Testimonial | null;
  onClose: () => void;
}

export default function TestimonialForm({ item, onClose }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    content: '',
    rating: '',
    featured: false,
  });

  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (item) {
      setFormData({
        client_name: item.client_name,
        client_role: item.client_role || '',
        content: item.content,
        rating: item.rating?.toString() || '',
        featured: item.featured,
      });
    }
  }, [item]);

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.portfolio.createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({
        title: 'Success',
        description: 'Testimonial created successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create testimonial',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => backend.portfolio.updateTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({
        title: 'Success',
        description: 'Testimonial updated successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update testimonial',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      client_name: formData.client_name,
      client_role: formData.client_role || undefined,
      content: formData.content,
      rating: formData.rating ? parseInt(formData.rating) : undefined,
      featured: formData.featured,
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
            {item ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Client Name *</label>
            <Input
              value={formData.client_name}
              onChange={(e) => handleInputChange('client_name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Client Role</label>
            <Input
              value={formData.client_role}
              onChange={(e) => handleInputChange('client_role', e.target.value)}
              placeholder="e.g., CEO, Bride, Event Coordinator"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Testimonial Content *</label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <Select value={formData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No rating</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured testimonial
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
