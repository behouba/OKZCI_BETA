importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');


workbox.setConfig({
    debug: false
});

// // this is ok
// workbox.routing.registerRoute(
//     new RegExp('/'),
//     workbox.strategies.networkFirst()
// );
// workbox.routing.registerRoute(
//     new RegExp('/me/'),
//     workbox.strategies.networkFirst()
// );
// // this also is ok
// workbox.routing.registerRoute(
//     new RegExp('/search/'),
//     workbox.strategies.networkFirst({
//         plugins: [
//             new workbox.expiration.Plugin({
//                 maxEntries: 20,
//                 maxAgeSeconds: 24 * 60 * 60,
//             }),
//         ],
//     })
// );


workbox.routing.registerRoute(
    new RegExp('/login/'),
    workbox.strategies.staleWhileRevalidate()
);

// workbox.routing.registerRoute(
//     new RegExp('/logout/'),
//     workbox.strategies.networkOnly()
// );

// workbox.routing.registerRoute(
//     new RegExp('/politique-de-confidentialité/'),
//     workbox.strategies.cacheFirst()
// );

// workbox.routing.registerRoute(
//     new RegExp('/conditions/'),
//     workbox.strategies.cacheFirst()
// );

workbox.routing.registerRoute(
    new RegExp('/create/'),
    workbox.strategies.staleWhileRevalidate()
);


// workbox.routing.registerRoute(
//     new RegExp('/pictures/ad/'),
//     workbox.strategies.networkFirst({
//         plugins: [
//             new workbox.expiration.Plugin({
//                 maxEntries: 30,
//                 maxAgeSeconds: 24 * 60 * 60,
//             }),
//         ],
//     })
// );

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



workbox.precaching.precacheAndRoute([
  {
    "url": "css/index.css",
    "revision": "f3afe213f16453adfc2569c88d3bd96c"
  },
  {
    "url": "css/profile-setting.css",
    "revision": "8c8e4915feeb080d3414baebe12104d6"
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
    "revision": "f4213f5fee22f4ba43de1772d4b97e7d"
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
    "url": "icons/logout.svg",
    "revision": "c18075137beee9ecdbe12f51b6baf36e"
  },
  {
    "url": "icons/smart-home.svg",
    "revision": "abe5e6dd61878c18fa4f3f2b63f165d5"
  },
  {
    "url": "icons/spinner-1s.svg",
    "revision": "6b7bf2beb55ec4f021877df378794299"
  },
  {
    "url": "icons/washer.svg",
    "revision": "40baa42fad2035e9e43df4bbf28a5c13"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "744c76318ff9b6c40e00eb8376764d0d"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "46f4eab47398d1400bcc2dd7692ffa95"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "c43d4eb0a56310032ef905de0e8e3c19"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "568d182ef88044aeb433dfdbf740d90e"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "112fdbb7072ff859347f709b82f3603c"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "112fdbb7072ff859347f709b82f3603c"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "5bc5d6a87309255b71e97ab47c3b0df4"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "45317060ca13424d89842f968336a610"
  },
  {
    "url": "img/blank.png",
    "revision": "4ed421ea03a03d7c80aa28270b75e3be"
  },
  {
    "url": "img/no_user.svg",
    "revision": "9bf531f6c7c8c48da55d3bd2a0ada48e"
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
    "revision": "d03e6da2c4422beb5d7f14cba32c67ab"
  },
  {
    "url": "js/axios.min.js",
    "revision": "fc5ab06feef9eeba24c6f19e558e79f5"
  },
  {
    "url": "js/cleave-phone.ci.js",
    "revision": "f4970bf9a35577b57f20cdb52b50e7fe"
  },
  {
    "url": "js/cleave.min.js",
    "revision": "e12f6011309adf625a6ca68e1f3fcbb8"
  },
  {
    "url": "js/create.js",
    "revision": "952d645394f0953b0e010510853282a3"
  },
  {
    "url": "js/date.js",
    "revision": "497166e7f447a56c7b279271c6c6e6c8"
  },
  {
    "url": "js/details.js",
    "revision": "e977d7dffd90c02c082a9cc874375e70"
  },
  {
    "url": "js/index.js",
    "revision": "163378e08a5526fc00322e6c0c5855a9"
  },
  {
    "url": "js/moment-with-locales.js",
    "revision": "252e3964d14fb38a5b69a1211dcdd2d6"
  },
  {
    "url": "js/profile-setting.js",
    "revision": "7e2373c02dffc551283d6c24320506d3"
  },
  {
    "url": "js/profile.js",
    "revision": "0ed139f8a86c334cf00ffa10475d92db"
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