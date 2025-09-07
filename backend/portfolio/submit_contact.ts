import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface SubmitContactParams {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  service_type?: string;
  event_date?: string;
}

export interface SubmitContactResponse {
  success: boolean;
  message: string;
}

// Submits a contact form inquiry.
export const submitContact = api<SubmitContactParams, SubmitContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (params) => {
    const eventDate = params.event_date ? new Date(params.event_date) : null;
    
    await portfolioDB.exec`
      INSERT INTO contact_submissions 
      (name, email, phone, subject, message, service_type, event_date)
      VALUES (${params.name}, ${params.email}, ${params.phone}, ${params.subject}, 
              ${params.message}, ${params.service_type}, ${eventDate})
    `;
    
    return {
      success: true,
      message: "Thank you for your inquiry! We'll get back to you soon."
    };
  }
);
