// src/popup/popup.tsx
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { WalletSelector } from './components/WalletSelector';
import Footer from './components/Footer';
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
    <div className="h-full flex flex-col items-center p-[20px] w-full bg-[#030711] text-white gap-[40px]">
      <Header />
      <div className="flex flex-col items-center w-full gap-[20px]">
        <h1 className="text-xl font-bold">Enable Slinks</h1>
        <p className="text-sm  text-center">
          Choose a wallet you would like to interact with. <br />
          What are Slinks?{' '}
          <a
            href="https://docs.sherry.social/"
            target="_blank"
            rel="noreferrer"
            className="text-[#B81058]"
          >
            Learn more
          </a>
        </p>

        <WalletSelector
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
        />
        {selectedWallet && (
          <div className="bg-yellow-100 rounded-lg p-2 flex items-center gap-2 w-full mt-4">
            <span className="text-sm text-yellow-800">
              Only one wallet should be active at a time.
            </span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
