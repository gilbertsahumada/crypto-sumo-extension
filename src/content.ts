import '@sherrylinks/slinks/index.css';
import {
  SherryExtensionAdapter,
  setupSlinksObserverEVM,
  ProviderKey,
} from '@sherrylinks/slinks/ext';
import { setClientKey, MiniAppDirectory } from '@sherrylinks/slinks-core';

export async function initSlinksObserver() {
  const clientKey = ""
  setClientKey(clientKey);

  const directory = MiniAppDirectory.getInstance();
  try {
    await directory.init({ refreshInterval: 60 * 60 * 1000 });
    console.log('[Sherry Ext] MiniApp Directory Initialized.');
  } catch (e) {
    console.error('[Sherry Ext] Failed to initialize MiniApp Directory:', e);
    return;
  }

  const wallet: string | null = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'getSelectedWallet' }, (res) => {
      resolve(res ?? null);
    });
  });

  if (!wallet) {
    console.warn('[Sherry] ❌ No wallet selected. Nothing to initialize.');
    return;
  }

  const adapter = new SherryExtensionAdapter(wallet as ProviderKey);
  console.log('[sherrylinks] 🧠 Iniciando setupSlinksObserverEVM...');
  setupSlinksObserverEVM(adapter);
}

initSlinksObserver();
