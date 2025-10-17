import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.innova.tatto',
  appName: 'tattoo-ai-superapp',
  webDir: 'mobile-dist',
  server: {
    url: "https://cdm5cxbg-3001.use2.devtunnels.ms/"
  }
};

export default config;
