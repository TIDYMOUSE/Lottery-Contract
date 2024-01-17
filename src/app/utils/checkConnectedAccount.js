export default async function checkConnectedAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        return accounts[0]
    }
    return null
}