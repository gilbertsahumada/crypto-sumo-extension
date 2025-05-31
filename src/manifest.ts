import { defineManifest } from '@crxjs/vite-plugin';
import packageData from '../package.json';

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development';

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    //16: 'icons/icon-16.png',
    //32: 'icons/icon-32.png',
    //48: 'icons/icon-48.png',
    //128: 'icons/icon-128.png',
  },
  action: {
    default_popup: 'public/popup.html', // Use explicit path to popup.html
    default_title: 'Crypto Sumo',
  },
  background: {
    service_worker: './src/background.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['./src/content.ts'],
      run_at: 'document_idle',
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        //'icons/icon-16.png',
        //'icons/icon-32.png',
        //'icons/icon-48.png',
        //'icons/icon-128.png',
      ],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['storage', 'activeTab', 'scripting'],
});
