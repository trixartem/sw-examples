const cacheVersion = '1';
const prefix = 'yasubbotnik-static'
const staticCacheName = `${prefix}-v${cacheVersion}`;
const staticCache = [
    '/yasubbotnik/index.css',
    '/yasubbotnik/index.js',
    '/yasubbotnik/',
    '/yasubbotnik/images/alex.jpeg',
    '/yasubbotnik/images/alexander.jpeg',
    '/yasubbotnik/images/artem.jpeg',
    '/yasubbotnik/images/bg.png',
    '/yasubbotnik/images/ivan.jpeg',
    '/yasubbotnik/images/max.jpeg',
    '/yasubbotnik/images/vital.jpeg',
    '/yasubbotnik/images/vital-pot.png',
    '/yasubbotnik/images/vlad-gr.jpeg',
    '/yasubbotnik/images/yasubbotnik_192.png',
    '/yasubbotnik/manifest.json'
];

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

    event.waitUntil(cleanCache());
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
        clients.openWindow(`${location.origin}/yasubbotnik`)
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

    const title = 'Я.Субботник 2017';
    const options = {
        body: 'Работает',
        icon: '/yasubbotnik/images/yasubbotnik_192.png'
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
