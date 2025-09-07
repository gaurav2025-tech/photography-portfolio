import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Image, 
  MessageSquare, 
  FileText, 
  Mail, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioManager from '../components/admin/PortfolioManager';
import TestimonialManager from '../components/admin/TestimonialManager';
import BlogManager from '../components/admin/BlogManager';
import ContactSubmissions from '../components/admin/ContactSubmissions';

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioManager />
          </TabsContent>

          <TabsContent value="testimonials" className="mt-6">
            <TestimonialManager />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogManager />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <ContactSubmissions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
