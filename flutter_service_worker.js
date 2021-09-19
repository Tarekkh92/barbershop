'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"version.json": "b907a1bc66353eb4e6723a694edd8c4d",
"assets/FontManifest.json": "8376c762c7d7c32376e903b8076c5d3d",
"assets/fonts/MateSC-Regular.ttf": "7bf94e2757cb9628cc0c607cc251642d",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/fonts/Scheherazade-Regular.ttf": "d82eefb238aa76b3ad68cbcbced904c8",
"assets/fonts/Oswald-VariableFont_wght.ttf": "a6e5446a7c5789aabc9b37eaaf72134d",
"assets/NOTICES": "db710f4b9e0c9c28324f60e7734025c3",
"assets/assets/home-blog2.png": "251729b5b5f8a01a20a7a343f22fc4cb",
"assets/assets/signature.png": "20744f53016f1cfb4288dd46ae5a18a3",
"assets/assets/gallery3-tablet.png": "2df44b764feedaf7eb04ed70db88b330",
"assets/assets/pricing2en.png": "16826ec2694541e3cc49e335202521a5",
"assets/assets/gallery1.png": "77eb0ceb122bb5cbdedc93f3c9000fbd",
"assets/assets/team2.png": "c12afd5179e2e95561c36209e670e7eb",
"assets/assets/gallery2.png": "df30a6a2fe6b6a38e26243fc3ae329c6",
"assets/assets/Capture2.png": "ad18a6fdf7e93115aee32aa79ba88000",
"assets/assets/Capture.png": "10be6c0241998a52ab468b835c5f1799",
"assets/assets/home-blog1.png": "7efda50b207508de738a5307bc6204f3",
"assets/assets/gallery2-mobile.png": "7547bdfd5ed0da8d79fda3502ddf17fa",
"assets/assets/about-en.png": "a64e32d1a754a0820821f4e4be9a6345",
"assets/assets/pricing1ar.png": "a7ac33841c1c069328045299b41110e2",
"assets/assets/pricing2ar.png": "74e33d046986d6b8cd25199a4dc61302",
"assets/assets/gallery4.png": "8d8035306344ad1ae211272228c65b9e",
"assets/assets/about-ar.png": "ce8959013d11046dd6af9d5e81dfea66",
"assets/assets/gallery2-tablet.png": "153f3fc83fd2b47206922d96e697a47b",
"assets/assets/logo.png": "7ef77253edc16da41662ac80ae575fa9",
"assets/assets/team_bg.png": "819b0e85fe7166cb09c084c52155d712",
"assets/assets/Capture1.png": "a5b7b5c08a6bc5bec79f3bff91091b5f",
"assets/assets/team3.png": "139805123f52bde3a0ad98f53b7f6691",
"assets/assets/team1.png": "ca6b334d7000cd4e82b16dd4d318b1c6",
"assets/assets/background.png": "2dc3726320560c900c527c1b51300ccd",
"assets/assets/gallery3.png": "779f80c00d7d135f37bbea4ff6667e9f",
"assets/assets/pricing1.png": "0c38c976849bdcbbacb6198196f98115",
"assets/assets/background-face.png": "9d80bac97a55027f2b2530949552486a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "3241d1d9c15448a4da96df05f3292ffe",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "eaed33dc9678381a55cb5c13edaf241d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "ffed6899ceb84c60a1efa51c809a57e4",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/AssetManifest.json": "ff44446960225bf0ed9dabb70496bd60",
"main.dart.js": "c28f28dd8aad972aa3e9d2c5005fbe63",
"index.html": "2a206f9f62cbc500b3c94d62a1a0e3b0",
"/": "2a206f9f62cbc500b3c94d62a1a0e3b0",
"manifest.json": "2fa5f076d0f0100db57256d4c5398a97",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
