importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');


// this is ok
workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.networkFirst()
);

// this also is ok
workbox.routing.registerRoute(
    new RegExp('/search/'),
    workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
    new RegExp('/login/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('/contact-us/'),
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
    new RegExp('/watch/'),
    workbox.strategies.staleWhileRevalidate()
);
workbox.routing.registerRoute(
    new RegExp('/me/'),
    workbox.strategies.staleWhileRevalidate()
);
workbox.routing.registerRoute(
    new RegExp('/settings/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('https://https://okazion.s3.*\.(jpg|jpeg|png)'),
    workbox.strategies.cacheFirst()
);
workbox.precaching.precacheAndRoute([])