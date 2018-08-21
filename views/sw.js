importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');


workbox.setConfig({
    debug: true
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
                maxEntries: 60,
                maxAgeSeconds: 48 * 60 * 60,
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
    new RegExp('/settings/'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    'https://fonts.googleapis.com/css?family=Open+Sans',
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



workbox.precaching.precacheAndRoute([
  {
    "url": "css/index.css",
    "revision": "48515f888df8d104baa40cce9a77fb6c"
  },
  {
    "url": "css/profile-setting.css",
    "revision": "49f81a2598cd487e16a08d8a20897bbd"
  },
  {
    "url": "css/uikit.min.css",
    "revision": "f52e86c40dcdffeb187ebf2714543022"
  },
  {
    "url": "icons/alien.svg",
    "revision": "685dd215ac57efc057a395083b414b5e"
  },
  {
    "url": "icons/armchair.svg",
    "revision": "12d3ca9413882079f3de5159e97a231b"
  },
  {
    "url": "icons/avatar.svg",
    "revision": "f9fda4c4de152a510a94dc250e4b24e1"
  },
  {
    "url": "icons/car.svg",
    "revision": "96aeddd8f82481aa6ddacb3bc22df55e"
  },
  {
    "url": "icons/cat-menu.svg",
    "revision": "11f7d1e4f443f43b3213809685dd786c"
  },
  {
    "url": "icons/checked.svg",
    "revision": "4d1f4254941e8857d82ee18d75c0f7aa"
  },
  {
    "url": "icons/controls.svg",
    "revision": "bb45a068b4132bebf40ca7cb9270c2d2"
  },
  {
    "url": "icons/electronic.svg",
    "revision": "d64d082e012f23bd9f003fa9a48fefeb"
  },
  {
    "url": "icons/employee.svg",
    "revision": "5353e636d7776f77a60f1ad6420e1c20"
  },
  {
    "url": "icons/fashion.svg",
    "revision": "3d041defa0ce8082630f039554b47683"
  },
  {
    "url": "icons/fireworks.svg",
    "revision": "65ece3ed1eb535097c34dcc03282372e"
  },
  {
    "url": "icons/guitar.svg",
    "revision": "9f2ae9caf585ba6433b49b0e7d635fea"
  },
  {
    "url": "icons/house.svg",
    "revision": "7141575c51111e62b2ce1d110ea64088"
  },
  {
    "url": "icons/jigsaw.svg",
    "revision": "6a5c973e9f9966f2109ad9710fe80d53"
  },
  {
    "url": "icons/job.svg",
    "revision": "9293a11f18e5b7eb0a1305943894fb15"
  },
  {
    "url": "icons/logo.png",
    "revision": "a076f275d0fdb3f35ef65ca55fe19aae"
  },
  {
    "url": "icons/logout.svg",
    "revision": "c18075137beee9ecdbe12f51b6baf36e"
  },
  {
    "url": "icons/smart-home.svg",
    "revision": "abe5e6dd61878c18fa4f3f2b63f165d5"
  },
  {
    "url": "icons/spinner-1s.svg",
    "revision": "5b68709dbded2f454772421e1917388e"
  },
  {
    "url": "icons/washer.svg",
    "revision": "69b98e36094a974f6deb1d6d02315b8b"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "b2e9f2723d0163d53a74980e1b44a1e7"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "f077e208211df51016ffc8895d89c9f4"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "c9b3d49dfba6c1d015588e95e1d887ca"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "82d5ec6e979966148d2af130b6ef3e36"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "6d85ccbfd1d1c73f8f0b958cef1988fb"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "eb4baafcd6635938f4af37b61089b183"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "cb6bc4c9de11d9d11246cac55f3dcfd6"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "d32485ec40bb84aa0662b139ff5b0683"
  },
  {
    "url": "img/blank.png",
    "revision": "05a3f5c800a6e949a98ae91aea395cba"
  },
  {
    "url": "img/icon-72x72.png",
    "revision": "cd69a7776ba4cbc973ecb6301450631c"
  },
  {
    "url": "img/nothing_found.png",
    "revision": "e8cd00a66b356049708eaa3d1fa1b8fe"
  },
  {
    "url": "img/okazion.png",
    "revision": "0b0950d8c5cdd0e2962f0b37a57f8f69"
  },
  {
    "url": "img/spinner.gif",
    "revision": "901577a443d7e604df085a9e05f8a0f2"
  },
  {
    "url": "img/text-animation.svg",
    "revision": "c395e10bbdfe62b6c022a257729a6c7c"
  },
  {
    "url": "img/user.svg",
    "revision": "16b2e040b4586f362b1e81003bb0cbd6"
  },
  {
    "url": "js/auth.js",
    "revision": "08841b4a0b6c52444c7232ff0e83913e"
  },
  {
    "url": "js/axios.min.js",
    "revision": "fc5ab06feef9eeba24c6f19e558e79f5"
  },
  {
    "url": "js/cleave-phone.ci.js",
    "revision": "2f393827d5bc37912f60909518c27c30"
  },
  {
    "url": "js/cleave.min.js",
    "revision": "92d76a2e9dcf0dba68a87704c4146537"
  },
  {
    "url": "js/create.js",
    "revision": "6623fa8ab4f902e6cf60b0d58d004a80"
  },
  {
    "url": "js/date.js",
    "revision": "497166e7f447a56c7b279271c6c6e6c8"
  },
  {
    "url": "js/details.js",
    "revision": "2796454fc41086ed11575af0f6027486"
  },
  {
    "url": "js/index.js",
    "revision": "636f73c92a51a481d9c4a57e43cd5a90"
  },
  {
    "url": "js/moment-with-locales.js",
    "revision": "252e3964d14fb38a5b69a1211dcdd2d6"
  },
  {
    "url": "js/profile-setting.js",
    "revision": "d4d204693852bb9de04030a5a8df3bef"
  },
  {
    "url": "js/profile.js",
    "revision": "43498554227088c08a11a003222c06d4"
  },
  {
    "url": "js/uikit-icons.min.js",
    "revision": "db353cb8612a6b3c0b73c0eb218472f4"
  },
  {
    "url": "js/uikit.min.js",
    "revision": "63d225bccb1fd6cc265925dabac76946"
  },
  {
    "url": "js/update-ad.js",
    "revision": "7dc70b5944feba7a58a85105ee4a225a"
  }
])