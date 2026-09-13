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
        netApplication: 'Netapplication',
        netApplicationGw: 'https://portail.myapp.tld',
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
    // ✅ Store SIGNATURE
    const signatureStore = {
        owner: localStorage.getItem('signature_owner') || config.owner,
        signatureBase: config.signatureBase,
        ITSMMyRequest: config.ITSMMyRequest,
        mdpTmpNet: config.mdpTmpNet,
        
        get signature() {
            return (this.owner || '') + this.signatureBase;
        },
        
        updateSignature() {
            localStorage.setItem('signature_owner', this.owner);
        }
    };
    
    // ✅ Store GLOBAL
    const globalStore = {
        serviceDeskLine: config.serviceDeskLine,
        serviceDeskMail: config.serviceDeskMail,
        netApplication: config.netApplication,
        serviceDeskLineQuick: config.serviceDeskLineQuick,
        netApplicationGw: config.netApplicationGw,
    };
    
    // Enregistrer les deux stores
    if (window.Alpine) {
        Alpine.store('signature', signatureStore);
        Alpine.store('global', globalStore);
    } else {
        document.addEventListener('alpine:init', () => {
            Alpine.store('signature', signatureStore);
            Alpine.store('global', globalStore);
        });
    }
});
