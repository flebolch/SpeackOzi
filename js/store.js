async function loadConfig() {
    const defaultConfig = {
        owner: '',
        signatureBase: ' - Service Desk',
        ITSMMyRequest: 'https://itsm.com/my_profile',
    };
    
    try {
        const { privateConfig } = await import('./private_store.js');
        return { ...defaultConfig, ...privateConfig };
    } catch (error) {
        console.warn('Using default configuration:', error.message);
        return defaultConfig;
    }
}

loadConfig().then(config => {
    window.signatureStore = {
        owner: localStorage.getItem('signature_owner') || config.owner,
        signatureBase: config.signatureBase,
        silvaMyRequest: config.silvaMyRequest,
        
        get signature() {
            return (this.owner || '') + this.signatureBase;
        },
        
        updateSignature() {
            localStorage.setItem('signature_owner', this.owner);
        }
    };
    
    document.addEventListener('alpine:init', () => {
        Alpine.store('signature', window.signatureStore);
    });
});
