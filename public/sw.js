const cacheVersion = '1.3';
const prefix = 'game-static'
const staticCacheName = `${prefix}-v${cacheVersion}`;
const staticCache = [
    '/stylesheets/style.css',
    '/javascripts/index.js',
    '/javascripts/shake.js',
    '/javascripts/index-offline.js',
    '/offline'
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

    event.waitUntil(cleanCache());
});

function handleFetch(event) {
    const request = event.request;
    const url = new URL(request.url);
    let pathname = url.pathname;

    console.log(pathname);
    if (pathname === '/') {
        return fetch('/')
            .then(res => {
                return res;
            })
            .catch(_ => {
                return caches.match('/offline')
            });
    }

    const isStatic = staticCache.some(item => {
        return pathname.includes(item)
    });

    if (isStatic) {
        return caches.match(event.request)
            .catch(_ => {
                return fetch(event.request);
            });
    }
}

self.addEventListener('fetch', event => {
    console.log('feth');
    const request = event.request;
    const url = new URL(request.url);

    const criteria = [
        request.method === 'GET',
        url.origin === location.origin
    ]

    const fetchAvailable = criteria.every(_ => _);
    if (fetchAvailable) {
        event.respondWith(handleFetch(event))
    }
});
