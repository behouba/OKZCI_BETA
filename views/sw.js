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
workbox.precaching.precacheAndRoute([
  {
    "url": "css/index.css",
    "revision": "69bb678cebcc4c477c0db1368b06ebdf"
  },
  {
    "url": "css/profile-setting.css",
    "revision": "cf397fd8dc4e50ba9018546f34904e34"
  },
  {
    "url": "css/uikit-rtl.css",
    "revision": "a662f770db7b51c2ec1f13dc93d45d3e"
  },
  {
    "url": "css/uikit-rtl.min.css",
    "revision": "1f706a3dc826731768e6f0e55dd65f39"
  },
  {
    "url": "css/uikit.css",
    "revision": "6779030e0f368191280d09c1a41e0730"
  },
  {
    "url": "css/uikit.min.css",
    "revision": "ffa2dd61f4ef65657dceeb7ebb770d26"
  },
  {
    "url": "icons/alien.svg",
    "revision": "3cf273300e339c6ea2b2dcdf0ddcc301"
  },
  {
    "url": "icons/armchair.svg",
    "revision": "12d3ca9413882079f3de5159e97a231b"
  },
  {
    "url": "icons/avatar.svg",
    "revision": "301eabd259fa07836a5a4263470c99bd"
  },
  {
    "url": "icons/car.svg",
    "revision": "96aeddd8f82481aa6ddacb3bc22df55e"
  },
  {
    "url": "icons/cat-menu.svg",
    "revision": "7a276086a5eeebfb4fb623197cefb183"
  },
  {
    "url": "icons/controls.svg",
    "revision": "6592eaeef781b4f4ee90894c3f3e1e1c"
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
    "revision": "13271525b2fcbaaedeafd41056ec141d"
  },
  {
    "url": "icons/smart-home.svg",
    "revision": "abe5e6dd61878c18fa4f3f2b63f165d5"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "706da2960d6a36ee6edf1200e773d6bb"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "47e9e15b787901ffc03c8ed8362049b5"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "7dfa181ef18870c13a1c4c3f4a7b40a3"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "46e7dfdf610d236dd41fd1eab0679057"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "6acc44baee2d5ddc71a104502e1b7411"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "5406be9caee2a2f1131401cd0c401231"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "cd69a7776ba4cbc973ecb6301450631c"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "08d19a32323ffa8183ecd7c1fb8aaf92"
  },
  {
    "url": "img/6.gif",
    "revision": "e1bd44076e70a22e6b7477c5013d17c0"
  },
  {
    "url": "img/download.jpg",
    "revision": "596a8c8eaff38f2109364d2f38fe1ada"
  },
  {
    "url": "img/icon-72x72.png",
    "revision": "cd69a7776ba4cbc973ecb6301450631c"
  },
  {
    "url": "img/logo-okz-0.png",
    "revision": "f09f2e77a093b3f7911aeb1c881ba32e"
  },
  {
    "url": "img/logo-okz-1.png",
    "revision": "eab8de30772221672f7912b98f350e39"
  },
  {
    "url": "img/logo-okz.png",
    "revision": "0b0950d8c5cdd0e2962f0b37a57f8f69"
  },
  {
    "url": "img/logo-okz2.png",
    "revision": "09d9b6e4ad093d200a097cb2eccc04dc"
  },
  {
    "url": "img/logo-okzW.png",
    "revision": "2e53b45240c7f376025d4de61bb78e21"
  },
  {
    "url": "img/logo-okzx.png",
    "revision": "2a62e8d68f8cbc6d0195bc3e3619e39d"
  },
  {
    "url": "img/logo-okzy.png",
    "revision": "3f326b6f323be82b603e69780ca13144"
  },
  {
    "url": "img/logo.gif",
    "revision": "34096ec9175b9e0dbf0e7bcd69203dc3"
  },
  {
    "url": "img/nothing_found.png",
    "revision": "e8cd00a66b356049708eaa3d1fa1b8fe"
  },
  {
    "url": "img/text-animation.svg",
    "revision": "c395e10bbdfe62b6c022a257729a6c7c"
  },
  {
    "url": "js/auth.js",
    "revision": "8f224beda7a23cb1212092dc857ff48f"
  },
  {
    "url": "js/axios.min.js",
    "revision": "fc5ab06feef9eeba24c6f19e558e79f5"
  },
  {
    "url": "js/create.js",
    "revision": "715fa72c493e91c823f0e610b7b55804"
  },
  {
    "url": "js/date.js",
    "revision": "497166e7f447a56c7b279271c6c6e6c8"
  },
  {
    "url": "js/details.js",
    "revision": "c15bc5989e4a6a0ff22e15286619b282"
  },
  {
    "url": "js/index.js",
    "revision": "d924b5b08accdd768cec252b3485820a"
  },
  {
    "url": "js/moment-with-locales.js",
    "revision": "252e3964d14fb38a5b69a1211dcdd2d6"
  },
  {
    "url": "js/profile-setting.js",
    "revision": "91d2b8777a3125db60a709166fa7a5fc"
  },
  {
    "url": "js/profile.js",
    "revision": "a2bc5da4ff60eba96e1915dc6bd32c15"
  },
  {
    "url": "js/uikit-core.js",
    "revision": "7eb4ec09c6173bb57a6b6a910aba4c2c"
  },
  {
    "url": "js/uikit-core.min.js",
    "revision": "437b01b14120fee18d778b044387dda4"
  },
  {
    "url": "js/uikit-icons-mytheme.js",
    "revision": "6c4017d0c14a962d1a2055c2d9548da2"
  },
  {
    "url": "js/uikit-icons-mytheme.min.js",
    "revision": "3673cf3aee24b44611a7cc439c64b568"
  },
  {
    "url": "js/uikit-icons.js",
    "revision": "ddc167ddf404e43acae97a99af4954ff"
  },
  {
    "url": "js/uikit-icons.min.js",
    "revision": "bf6fc7341e955b44869f99750b3a585c"
  },
  {
    "url": "js/uikit.js",
    "revision": "035dd1a54fa21fb7ffd6c0ab21fc73e8"
  },
  {
    "url": "js/uikit.min.js",
    "revision": "24d590c770dd6e1d991b537b9ce3d2ee"
  },
  {
    "url": "js/update-ad.js",
    "revision": "2ed095cc2e57a066e3cd40f27fbdd834"
  }
])