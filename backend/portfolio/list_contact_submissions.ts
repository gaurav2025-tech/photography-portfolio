import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  service_type: string | null;
  event_date: Date | null;
  created_at: Date;
}

export interface ListContactSubmissionsParams {
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface ListContactSubmissionsResponse {
  submissions: ContactSubmission[];
  total: number;
}

// Retrieves contact form submissions.
export const listContactSubmissions = api<ListContactSubmissionsParams, ListContactSubmissionsResponse>(
  { expose: true, method: "GET", path: "/admin/contacts", auth: true },
  async (params) => {
    const limit = params.limit || 50;
    const offset = params.offset || 0;

    const submissions = await portfolioDB.queryAll<ContactSubmission>`
      SELECT id, name, email, phone, subject, message, service_type, event_date, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const totalResult = await portfolioDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM contact_submissions
    `;

    return {
      submissions,
      total: totalResult?.count || 0,
    };
  }
);
