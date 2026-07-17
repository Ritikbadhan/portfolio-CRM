import { z } from 'zod';

export const generalSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
});

export const themeSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  mode: z.enum(['light', 'dark', 'system']),
});

export const socialSchema = z.object({
  github: z.string().url('Must be a valid URL').or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').or(z.literal('')),
});

export const contactSchema = z.object({
  email: z.string().email('Must be a valid email').or(z.literal('')),
  phone: z.string().or(z.literal('')),
  address: z.string().or(z.literal('')),
});

export const seoSchema = z.object({
  metaTags: z.array(z.string()),
  keywords: z.array(z.string()),
});

export const brandingSchema = z.object({
  logoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  faviconUrl: z.string().url('Must be a valid URL').or(z.literal('')),
});

export const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message: z.string(),
});
