export default function accountChanged() {
    window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
            return null // If account is disconnected, set account to null
        } else {
            return newAccounts[0]; // Set the new connected account
        }
    });
}