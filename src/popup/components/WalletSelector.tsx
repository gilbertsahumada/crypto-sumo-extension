// src/popup/components/WalletSelector.tsx
import { useCallback } from 'react';

const WalletButton = ({
  title,
  subtitle,
  icon,
  isSelected,
  onClick,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`wallet-button ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {icon}
      <div className="wallet-info">
        <span className="font-medium text-sm">{title}</span>
        {subtitle && <span className="text-xs text-white">{subtitle}</span>}
      </div>
      <div className="ml-auto">
        {isSelected ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            style={{ color: '#8B5CF6' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <div className="w-5 h-5 border border-gray-500 rounded" />
        )}
      </div>
    </div>
  );
};

export const WalletSelector = ({
  selectedWallet,
  setSelectedWallet,
}: {
  selectedWallet?: string | null;
  setSelectedWallet: (wallet: string | null) => void;
}) => {
  const selectWallet = useCallback(
    (wallet: string) => {
      setSelectedWallet(wallet);
      chrome.storage.local.set({ selectedWallet: wallet });
      chrome.tabs.query({ url: '*://*.twitter.com/*' }, (tabs) => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { type: 'walletChanged' });
          }
        }
      });
    },

    [setSelectedWallet],
  );

  const unselectWallet = useCallback(() => {
    setSelectedWallet(null);
    chrome.storage.local.remove(['selectedWallet']);
  }, [setSelectedWallet]);

  return (
    <div className="wallet-selector">
      <WalletButton
        title="Core Wallet"
        subtitle="Use with Avalanche C-Chain"
        icon={""}
        isSelected={selectedWallet === 'core'}
        onClick={() =>
          selectedWallet === 'core' ? unselectWallet() : selectWallet('core')
        }
      />
      <WalletButton
        title="Rabby Wallet"
        subtitle="EVM-focused, privacy-friendly"
        icon={""}
        isSelected={selectedWallet === 'rabby'}
        onClick={() =>
          selectedWallet === 'rabby' ? unselectWallet() : selectWallet('rabby')
        }
      />
      <WalletButton
        title="MetaMask"
        subtitle="EVM-focused, privacy-friendly"
        icon={""}
        isSelected={selectedWallet === 'metamask'}
        onClick={() =>
          selectedWallet === 'metamask'
            ? unselectWallet()
            : selectWallet('metamask')
        }
      />
    </div>
  );
};
