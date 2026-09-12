async function loadConfig() {
    const defaultConfig = {
        owner: '',
        signatureBase: ' - Service Desk',
        ITSMMyRequest: 'https://itsm.com/my_profile',
        mdpTmpNet: 'Mot2PasseTemporaire',
        serviceDeskLineQuick: '911',
        serviceDeskLine: 'XXXXXXXXXX',
        netapplication: 'Netapp',
        serviceDeskMail: 'your-email@company.com',
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
        ITSMMyRequest: config.ITSMMyRequest,
        mdpTmpNet: config.mdpTmpNet,
        serviceDeskLine: config.serviceDeskLine,
        
        get signature() {
            return (this.owner || '') + this.signatureBase;
        },
        
        updateSignature() {
            localStorage.setItem('signature_owner', this.owner);
        }
    };
    
    // Register store immediately (don't wait for alpine:init)
    if (window.Alpine) {
        Alpine.store('signature', window.signatureStore);
    } else {
        document.addEventListener('alpine:init', () => {
            Alpine.store('signature', window.signatureStore);
        });
    }

    window.global = {
        mdpTmpNet: config.mdpTmpNet,
        serviceDeskMail: config.serviceDeskMail,
        serviceDeskLine: config.serviceDeskLine,
    };
});
