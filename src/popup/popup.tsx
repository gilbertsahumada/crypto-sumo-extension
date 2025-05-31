// src/popup/popup.tsx
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { WalletSelector } from './components/WalletSelector';

export const Popup = () => {
  const [isLoading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['selectedWallet'], (result) => {
      const storedWallet = result.selectedWallet ?? null;
      setSelectedWallet(storedWallet);
      setLoading(false);
    });
  }, []);

  if (isLoading) return null;

  return (
    <div className="popup-container">
      <Header />
      <div className="popup-content">
        <h1 className="text-xl font-bold">Enable Sumo Extension</h1>

        <WalletSelector
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
        />
        {selectedWallet && (
          <div className="notification">
            <span className="text-sm text-yellow-800">
              Only one wallet should be active at a time.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
