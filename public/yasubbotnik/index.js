const result = document.querySelector('.result');
const applicationServerPublicKey = 'BLMDTb6F4fH_f8lNWmmkj_4HHo-bcpjzL0YJwE3klN3J-ZFhPf-FvTyPY0wJdZx2wESxDBYjexvbTyEqLdORfeo';

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
            .register('/yasubbotnik/sw.js');

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


// web-push send-notification --ttl=30 --gcm-api-key=AIzaSyD0TiQ0CVZ7wUkHeDzz6GU3IR-SQUuceSY --vapid-pvtkey=QOFJxQp67sX2Jx3x793VGAwgFqIsy4f79bXdv2grb1E --vapid-subject="mailto:trixartem2@gmail.com" --vapid-pubkey="BLMDTb6F4fH_f8lNWmmkj_4HHo-bcpjzL0YJwE3klN3J-ZFhPf-FvTyPY0wJdZx2wESxDBYjexvbTyEqLdORfeo"  --endpoint="https://fcm.googleapis.com/fcm/send/dlOcZ6Mv93U:APA91bGaUCyh5a2c7MVZTY89p70LhcCjvU229g6rxo83fupwrzy4ccCxsXiPkIP7QL3JKcfm0875-F_1EhnBlNmJ6Y7Q4HcLKKtUVpXSCAe42ibFor5aVVzmdpesJfgGXdAni-aWCH6X"




