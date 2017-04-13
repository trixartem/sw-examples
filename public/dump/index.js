const result = document.querySelector('.result');
const applicationServerPublicKey = 'BO6hb6-Dw100SfdNb_ArRB2EOCribRHFT2YyObBkntz49IGDSYDDdUBaDnUxibGWfSouzWz0a7_6D37iUku_7R8';

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function initSW() {
    if ('serviceWorker' in navigator) {
        navigator
            .serviceWorker
            .register('/dump/sw.js');

        navigator.serviceWorker.ready.then(swReg => {
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage('ping');
                    navigator.serviceWorker.addEventListener('message', e => {
                        console.log('GET pong', e);
                    });
                }

                const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                })
                    .then(function (subscription) {
                        console.log('User is subscribed.', subscription)
                    })
                    .catch(err => console.log('Failed to subscribe the user: ', err));
            }
        )
    }
}

initSW();




