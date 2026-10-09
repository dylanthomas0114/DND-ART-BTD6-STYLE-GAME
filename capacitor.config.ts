import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arcaneramparts.game',
  appName: 'Arcane Ramparts',
  webDir: 'dist',
  backgroundColor: '#1b1410',
  android: {
    backgroundColor: '#1b1410',
  },
  ios: {
    backgroundColor: '#1b1410',
    contentInset: 'never',
  },
};

export default config;
