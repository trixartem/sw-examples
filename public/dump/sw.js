const cacheVersion = '1';
const prefix = 'dump-static'
const staticCacheName = `${prefix}-v${cacheVersion}`;
const staticCache = [
    '/dump/index.css',
    '/dump/fonts/71D43E_ZpjerHAsyF2SPuFKPGs1ZzpMvnHX-7fPOuAc.woff2',
    '/dump/fonts/EgJGySadPCEUe4oNA9kAslKPGs1ZzpMvnHX-7fPOuAc.woff2',
    '/dump/fonts/G-CKroWfxRiFDKkMmCHyAgLUuEpTyoUstqEm5AMlJo4.woff2',
    '/dump/fonts/Tirh6-ADimy_yvdLtBSHsVKPGs1ZzpMvnHX-7fPOuAc.woff2',
    '/dump/index.js',
    '/dump/',
    '/dump/images/dump.png',
    '/dump/images/ivanov.jpg',
    '/dump/images/makishvili.jpg',
    '/dump/images/mohov.jpg',
    '/dump/images/yandex_logo.svg',
    '/dump/images/kuzvesov.jpg',
    '/dump/images/grinenko_In2xnde.jpg',
    '/dump/images/lyzlov.jpg',
    '/dump/images/duletski.jpg',
    '/dump/images/prokopov.jpg',
    '/dump/images/alekseenko.jpg',
    '/dump/images/petrov.jpg',
    '/dump/images/kuvaldin.jpg'
];
let installTime = 0;

self.addEventListener('install', event => {

    event.waitUntil(caches
        .open(staticCacheName)
        .then(cache => {
            return cache.addAll(staticCache);
        })
        .then(_ => {
            return self.skipWaiting();
        })
        .catch(err => console.log(err))
    );
});

self.addEventListener('activate', event => {
    installTime = Date.now();
    function cleanCache() {
        return event.waitUntil(caches
            .keys()
            .then(keys => {
                return Promise.all(
                    keys.map(key => {
                        if (key.startsWith(prefix) && key !== staticCacheName) {
                            return caches.delete(key);
                        }
                    })
                );
            }));
    }

    event.waitUntil(Promise.all([cleanCache(), sendMessage()]));
})

self.addEventListener('message', function (event) {
    console.log('[Service Worker] Get post message', event.data);
    function sendMessage() {
        return self.clients.matchAll().then(clients => {
            clients.forEach(function (client) {
                return client.postMessage('The service worker just started up.');
            });
        });
    }

    event.waitUntil(sendMessage());
})

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.', clients);

    event.notification.close();

    event.waitUntil(
        clients.openWindow(`${location.origin}/sw-project/fronttalks/index.html`)
    );
});

function handleFetch(event) {
    const request = event.request;

    return fetch(request)
        .then(res => {
            return res;
        })
        .catch(_ => {
            return caches.match(event.request)
        });
}

self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');

    const title = 'dump 2017';
    const options = {
        body: 'It works.',
        icon: 'images/dump_192.png',
        badge: 'images/dump_192.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    const criteria = [
        request.method === 'GET',
        url.origin === location.origin
    ]

    const fetchAvailable = criteria.every(_ => _);
    console.log(fetchAvailable, 'URL', request.url);
    if (fetchAvailable) {
        event.respondWith(handleFetch(event))
    }
});
