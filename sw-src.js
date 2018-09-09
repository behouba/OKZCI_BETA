importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');


workbox.setConfig({
    debug: false
});

// this is ok
workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    new RegExp('/me/'),
    workbox.strategies.networkFirst()
);
// this also is ok
workbox.routing.registerRoute(
    new RegExp('/search/'),
    workbox.strategies.networkFirst({
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ],
    })
);


workbox.routing.registerRoute(
    new RegExp('/login/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('/logout/'),
    workbox.strategies.networkOnly()
);

workbox.routing.registerRoute(
    new RegExp('/politique-de-confidentialité/'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('/conditions/'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('/create/'),
    workbox.strategies.staleWhileRevalidate()
);


workbox.routing.registerRoute(
    new RegExp('/pictures/ad/'),
    workbox.strategies.networkFirst({
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('/settings/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    'https://fonts.googleapis.com/css?family=Montserrat:400,500,600',
    workbox.strategies.cacheFirst(),
);

workbox.routing.registerRoute(
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    workbox.strategies.cacheFirst(),
);

workbox.routing.registerRoute(
    'https://use.fontawesome.com/releases/v5.2.0/css/all.css',
    workbox.strategies.cacheFirst(),
);



workbox.precaching.precacheAndRoute([])