import { connectProvider, providerKeyFor, switchChainRequest, sendTransactionRequest, simulateContractCall, } from '@sherrylinks/slinks/ext';
async function handleWalletCommunication(type, wallet, tabId, payload) {
    if (type === 'connect') {
        const providerKey = providerKeyFor(wallet);
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: connectProvider,
            args: [providerKey],
        });
        return result ?? { error: 'No result from connect' };
    }
    if (type === 'switch_chain') {
        const { hexChainId } = payload;
        const providerKey = providerKeyFor(wallet);
        const [res] = await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: switchChainRequest,
            args: [hexChainId, providerKey],
        });
        return res?.result ?? { error: 'No result from switch_chain' };
    }
    if (type === 'send_transaction') {
        try {
            const { to, value, data, from } = payload;
            const providerKey = providerKeyFor(wallet);
            const [res] = await chrome.scripting.executeScript({
                target: { tabId },
                world: 'MAIN',
                func: sendTransactionRequest,
                args: [to, value, data, providerKey, from],
            });
            console.log('🎯 Final response from MAIN world:', res?.result);
            return res?.result ?? { error: 'No result from send_transaction' };
        }
        catch (e) {
            console.log('🧨 send_transaction outer catch:', e);
            return { error: e?.message ?? 'Internal error in send_transaction' };
        }
    }
    if (type === 'simulate_contract') {
        try {
            const { address, data, from, value } = payload;
            if (!from || !from.startsWith('0x')) {
                return { error: 'Invalid from address in simulate_contract' };
            }
            const providerKey = providerKeyFor(wallet);
            const [res] = await chrome.scripting.executeScript({
                target: { tabId },
                world: 'MAIN',
                func: simulateContractCall,
                args: [
                    String(address),
                    String(data),
                    String(from),
                    String(value ?? '0x0'),
                    providerKey,
                ],
            });
            return res?.result ?? { error: 'No result from simulate_contract' };
        }
        catch (err) {
            console.error('[Background] ❌ simulate_contract exception:', err);
            return { error: err?.message ?? 'Malformed simulate_contract payload' };
        }
    }
    throw new Error(`Unsupported message type: ${type}`);
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    const tabId = sender.tab?.id;
    if (!tabId) {
        console.warn('[BG] no tabId → ignoring');
        return;
    }
    if (msg.type === 'getSelectedWallet') {
        chrome.storage.local.get(['selectedWallet']).then((storage) => {
            sendResponse(storage.selectedWallet);
        });
        return true;
    }
    if (!msg.wallet)
        return false;
    handleWalletCommunication(msg.type, msg.wallet, tabId, msg.payload)
        .then((res) => sendResponse(res))
        .catch((err) => console.error('[BG] error handling message', err));
    return true;
});
