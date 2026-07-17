import { baseApi } from '../../baseApi';
import { ApiResponse } from '@portfolio/types';

// Matching ISettings from backend but typing strictly for frontend
export interface ISettings {
  general: { siteName: string; siteDescription: string };
  branding: { logoUrl: string; faviconUrl: string };
  theme: { primaryColor: string; secondaryColor: string; mode: 'light' | 'dark' | 'system' };
  social: { github: string; linkedin: string; twitter: string };
  contact: { email: string; phone: string; address: string };
  resume: { url: string; showResume: boolean };
  seo: { metaTags: string[]; keywords: string[] };
  maintenance: { enabled: boolean; message: string };
  analytics: { googleAnalyticsId: string };
  // Only admins get these
  smtp?: { host: string; port: number; user: string; pass: string };
  cloudinary?: { cloudName: string; apiKey: string; apiSecret: string };
  redis?: { url: string; port: number };
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<ApiResponse<ISettings>, void>({
      query: () => ({ url: '/settings' }),
      providesTags: ['Settings'],
    }),
    getAdminSettings: builder.query<ApiResponse<ISettings>, void>({
      query: () => ({ url: '/settings/admin' }),
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<ApiResponse<ISettings>, Partial<ISettings>>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateTheme: builder.mutation<ApiResponse<ISettings>, { theme: ISettings['theme'] }>({
      query: (body) => ({
        url: '/settings/theme',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateSocial: builder.mutation<ApiResponse<ISettings>, { social: ISettings['social'] }>({
      query: (body) => ({
        url: '/settings/social',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateContact: builder.mutation<ApiResponse<ISettings>, { contact: ISettings['contact'] }>({
      query: (body) => ({
        url: '/settings/contact',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateSeo: builder.mutation<ApiResponse<ISettings>, { seo: ISettings['seo'] }>({
      query: (body) => ({
        url: '/settings/seo',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    updateBranding: builder.mutation<ApiResponse<ISettings>, { branding: ISettings['branding'] }>({
      query: (body) => ({
        url: '/settings/branding',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    uploadLogo: builder.mutation<ApiResponse<ISettings['branding']>, void>({
      query: () => ({
        url: '/settings/upload/logo',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
    uploadFavicon: builder.mutation<ApiResponse<ISettings['branding']>, void>({
      query: () => ({
        url: '/settings/upload/favicon',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
    resetSettings: builder.mutation<ApiResponse<ISettings>, void>({
      query: () => ({
        url: '/settings/reset',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetAdminSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateThemeMutation,
  useUpdateSocialMutation,
  useUpdateContactMutation,
  useUpdateSeoMutation,
  useUpdateBrandingMutation,
  useUploadLogoMutation,
  useUploadFaviconMutation,
  useResetSettingsMutation,
} = settingsApi;
