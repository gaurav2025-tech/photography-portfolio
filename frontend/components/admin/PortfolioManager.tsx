import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PortfolioForm from './PortfolioForm';
import type { PortfolioItem } from '~backend/portfolio/list_portfolio';

export default function PortfolioManager() {
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: () => backend.portfolio.listPortfolio({}),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => backend.portfolio.listCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.portfolio.deletePortfolioItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast({
        title: 'Success',
        description: 'Portfolio item deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio item',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const portfolioItems = portfolioData?.items || [];
  const categories = categoriesData?.categories || [];

  if (isLoading) {
    return <div className="text-center py-8">Loading portfolio items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Portfolio Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {showForm && (
        <PortfolioForm
          item={editingItem}
          categories={categories}
          onClose={handleFormClose}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="aspect-square">
              <img
                src={item.thumbnail_url || item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.category_name}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.featured && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Order: {item.sort_order}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolioItems.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No portfolio items yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
