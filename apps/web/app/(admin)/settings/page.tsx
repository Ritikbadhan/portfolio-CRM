'use client';

import { useState } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Paper, Divider } from '@mui/material';
import { useGetAdminSettingsQuery } from '../../../store/features/settings/settingsApi';
import { useGetMeQuery } from '../../../store/features/auth/authApi';
import { GeneralForm } from '../../../components/settings/GeneralForm';
import { ThemeForm } from '../../../components/settings/ThemeForm';
import { BrandingForm } from '../../../components/settings/BrandingForm';
import { ContactForm } from '../../../components/settings/ContactForm';
import { SocialForm } from '../../../components/settings/SocialForm';
import { SeoForm } from '../../../components/settings/SeoForm';
import { MaintenanceForm } from '../../../components/settings/MaintenanceForm';
import { ProfileForm } from '../../../components/settings/ProfileForm';
import { SecurityForm } from '../../../components/settings/SecurityForm';
import { UnsavedChangesDialog } from '../../../components/settings/UnsavedChangesDialog';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && <Box sx={{ width: '100%', maxWidth: '800px' }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const { data: settingsData, isLoading: settingsLoading } = useGetAdminSettingsQuery();
  const { data: userData, isLoading: userLoading } = useGetMeQuery(undefined);

  const [tabValue, setTabValue] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const { showPrompt, checkUnsaved, confirmNavigation, cancelNavigation } =
    useUnsavedChanges(isDirty);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    checkUnsaved(() => setTabValue(newValue));
  };

  const handleDirtyChange = (dirty: boolean) => {
    setIsDirty(dirty);
  };

  if (settingsLoading || userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const settings = settingsData?.data;
  const user = userData?.data?.user;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper
        elevation={0}
        sx={{ display: 'flex', border: 1, borderColor: 'divider', minHeight: 600, mt: 4 }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200 }}
        >
          <Tab label="General" />
          <Tab label="Branding" />
          <Tab label="Theme" />
          <Tab label="Contact" />
          <Tab label="Social Links" />
          <Tab label="SEO" />
          <Tab label="Maintenance" />
          <Divider sx={{ my: 2 }} />
          <Tab label="Profile" />
          <Tab label="Security" />
        </Tabs>

        <Box sx={{ flexGrow: 1, px: 4 }}>
          {/* General */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" mb={3}>
              General Settings
            </Typography>
            <GeneralForm initialData={settings?.general} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* Branding */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" mb={3}>
              Branding
            </Typography>
            <BrandingForm initialData={settings?.branding} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* Theme */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" mb={3}>
              Theme Settings
            </Typography>
            <ThemeForm initialData={settings?.theme} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* Contact */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" mb={3}>
              Contact Information
            </Typography>
            <ContactForm initialData={settings?.contact} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* Social */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" mb={3}>
              Social Links
            </Typography>
            <SocialForm initialData={settings?.social} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* SEO */}
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h5" mb={3}>
              SEO Configuration
            </Typography>
            <SeoForm initialData={settings?.seo} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* Maintenance */}
          <TabPanel value={tabValue} index={6}>
            <Typography variant="h5" mb={3}>
              Maintenance Mode
            </Typography>
            <MaintenanceForm
              initialData={settings?.maintenance}
              onDirtyChange={handleDirtyChange}
            />
          </TabPanel>

          {/* Profile */}
          <TabPanel value={tabValue} index={8}>
            <Typography variant="h5" mb={3}>
              User Profile
            </Typography>
            <ProfileForm initialData={user} onDirtyChange={handleDirtyChange} />
          </TabPanel>

          {/* Security */}
          <TabPanel value={tabValue} index={9}>
            <Typography variant="h5" mb={3}>
              Security
            </Typography>
            <SecurityForm onDirtyChange={handleDirtyChange} />
          </TabPanel>
        </Box>
      </Paper>

      <UnsavedChangesDialog
        open={showPrompt}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </Box>
  );
}
