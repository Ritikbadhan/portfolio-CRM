import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z
    .object({
      general: z
        .object({
          siteName: z.string().optional(),
          siteDescription: z.string().optional(),
        })
        .optional(),
      theme: z
        .object({
          primaryColor: z.string().optional(),
          secondaryColor: z.string().optional(),
          mode: z.enum(['light', 'dark', 'system']).optional(),
        })
        .optional(),
      social: z
        .object({
          github: z.string().optional(),
          linkedin: z.string().optional(),
          twitter: z.string().optional(),
        })
        .optional(),
      contact: z
        .object({
          email: z.string().email().optional().or(z.literal('')),
          phone: z.string().optional(),
          address: z.string().optional(),
        })
        .optional(),
      seo: z
        .object({
          metaTags: z.array(z.string()).optional(),
          keywords: z.array(z.string()).optional(),
        })
        .optional(),
      branding: z
        .object({
          logoUrl: z.string().optional(),
          faviconUrl: z.string().optional(),
        })
        .optional(),
      maintenance: z
        .object({
          enabled: z.boolean().optional(),
          message: z.string().optional(),
        })
        .optional(),
      analytics: z
        .object({
          googleAnalyticsId: z.string().optional(),
        })
        .optional(),
      smtp: z
        .object({
          host: z.string().optional(),
          port: z.number().optional(),
          user: z.string().optional(),
          pass: z.string().optional(),
        })
        .optional(),
      cloudinary: z
        .object({
          cloudName: z.string().optional(),
          apiKey: z.string().optional(),
          apiSecret: z.string().optional(),
        })
        .optional(),
      redis: z
        .object({
          url: z.string().optional(),
          port: z.number().optional(),
        })
        .optional(),
    })
    .strict(),
});
