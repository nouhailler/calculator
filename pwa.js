// Variables pour l'installation PWA
let deferredPrompt;

// Écouteur pour l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher le prompt d'installation après un délai
    setTimeout(() => {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt && !localStorage.getItem('pwaInstalled')) {
            installPrompt.classList.add('show');
        }
    }, 3000);
});

// Fonction pour installer la PWA
function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                localStorage.setItem('pwaInstalled', 'true');
                closeInstallPrompt();
            }
            deferredPrompt = null;
        });
    }
}

// Fermer le prompt d'installation
function closeInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.classList.remove('show');
    }
}

// Vérifier si l'application est déjà installée
window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwaInstalled', 'true');
    closeInstallPrompt();
});

// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
