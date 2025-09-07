import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onPublicIdChange?: (publicId: string) => void;
  folder?: string;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onPublicIdChange,
  folder = "portfolio",
  className = "",
  disabled = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backend = useBackend();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: (imageData: string) => backend.storage.uploadImage({ imageData, folder }),
    onSuccess: (data) => {
      onChange(data.secureUrl);
      if (onPublicIdChange) {
        onPublicIdChange(data.publicId);
      }
      setPreview(data.secureUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      uploadMutation.mutate(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || uploadMutation.isPending) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploadMutation.isPending) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (disabled || uploadMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onChange('');
    if (onPublicIdChange) {
      onPublicIdChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${disabled || uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
          ${preview ? 'border-solid' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploadMutation.isPending}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              disabled={disabled || uploadMutation.isPending}
            >
              <X className="w-4 h-4" />
            </Button>
            {uploadMutation.isPending && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-white rounded-lg p-4 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop your image here, or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!preview && !uploadMutation.isPending && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Image
        </Button>
      )}
    </div>
  );
}
