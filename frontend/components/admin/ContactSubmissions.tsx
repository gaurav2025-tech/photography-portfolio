import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Calendar, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { Button } from '@/components/ui/button';
import type { ContactSubmission } from '~backend/portfolio/list_contact_submissions';

export default function ContactSubmissions() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const backend = useBackend();

  const { data: contactData, isLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: () => backend.portfolio.listContactSubmissions({ limit: 100 }),
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const submissions = contactData?.submissions || [];

  if (isLoading) {
    return <div className="text-center py-8">Loading contact submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Contact Submissions</h2>
        <div className="text-sm text-muted-foreground">
          Total: {contactData?.total || 0} submissions
        </div>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <ContactCard
            key={submission.id}
            submission={submission}
            isExpanded={expandedItems.has(submission.id)}
            onToggle={() => toggleExpanded(submission.id)}
          />
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No contact submissions yet.</p>
        </div>
      )}
    </div>
  );
}

interface ContactCardProps {
  submission: ContactSubmission;
  isExpanded: boolean;
  onToggle: () => void;
}

function ContactCard({ submission, isExpanded, onToggle }: ContactCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div
        className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{submission.name}</h3>
              {submission.service_type && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                  {submission.service_type}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {submission.email}
              </div>
              {submission.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {submission.phone}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(submission.created_at)}
              </div>
              {submission.event_date && (
                <div>
                  Event Date: {new Date(submission.event_date).toLocaleDateString()}
                </div>
              )}
            </div>
            {submission.subject && !isExpanded && (
              <p className="text-sm text-foreground mt-2 line-clamp-1">
                Subject: {submission.subject}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border bg-muted/20">
          <div className="pt-4 space-y-3">
            {submission.subject && (
              <div>
                <label className="text-sm font-medium text-foreground">Subject:</label>
                <p className="text-sm text-muted-foreground">{submission.subject}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Message:</label>
              <div className="bg-background rounded-lg p-4 mt-1">
                <p className="text-sm text-foreground whitespace-pre-wrap">{submission.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
