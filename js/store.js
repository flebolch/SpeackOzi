// js/store.js
window.signatureStore = {
    owner: localStorage.getItem('signature_owner') || '',
    signatureBase: ' - Service Desk Axa',
    
    get signature() {
        return (this.owner || '') + this.signatureBase;
    },
    
    updateSignature() {
        localStorage.setItem('signature_owner', this.owner);
    }
};

// Initialize Alpine store after Alpine loads
document.addEventListener('alpine:init', () => {
    Alpine.store('signature', window.signatureStore);
});
