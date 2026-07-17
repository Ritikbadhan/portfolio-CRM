import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  general: {
    siteName: string;
    siteDescription: string;
  };
  branding: {
    logoUrl: string;
    faviconUrl: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    mode: 'light' | 'dark' | 'system';
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  resume: {
    url: string;
    showResume: boolean;
  };
  seo: {
    metaTags: string[];
    keywords: string[];
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
  analytics: {
    googleAnalyticsId: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  redis: {
    url: string;
    port: number;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    general: {
      siteName: { type: String, default: 'My Portfolio' },
      siteDescription: { type: String, default: 'Welcome to my portfolio' },
    },
    branding: {
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
    },
    theme: {
      primaryColor: { type: String, default: '#00e5ff' },
      secondaryColor: { type: String, default: '#651fff' },
      mode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    },
    social: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    resume: {
      url: { type: String, default: '' },
      showResume: { type: Boolean, default: true },
    },
    seo: {
      metaTags: { type: [String], default: [] },
      keywords: { type: [String], default: [] },
    },
    maintenance: {
      enabled: { type: Boolean, default: false },
      message: {
        type: String,
        default: 'We are currently down for maintenance. Please check back later.',
      },
    },
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
    },
    smtp: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
    },
    cloudinary: {
      cloudName: { type: String, default: '' },
      apiKey: { type: String, default: '' },
      apiSecret: { type: String, default: '' },
    },
    redis: {
      url: { type: String, default: '' },
      port: { type: Number, default: 6379 },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to ensure only one settings document ever exists
SettingsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Settings').countDocuments();
    if (count > 0) {
      return next(new Error('Only one settings document can exist.'));
    }
  }
  next();
});

export const Settings =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
