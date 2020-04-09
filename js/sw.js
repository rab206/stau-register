'use strict';
/* global Request, Response, caches, URL, fetch */

var urlsToPrefetch = [
    '/'
    ,'/index.html'
    , '/index.js'
    , '/datalist-polyfill.js'
    , '/tachyons.css'
    , 'https://fonts.gstatic.com/s/roboto/v15/CWB0XYA8bzo0kSThX0UTuA.woff2'
    , 'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOFtXRa8TVwTICgirnJhmVJw.woff2'
    , '/eagle_logo_s.png'
    , '/favicon.ico'
];

importScripts('serviceworker-cache-polyfill.js');

var staticCacheName = 'stau-register-v18';

self.oninstall = function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToPrefetch);
    })
  );
};

var expectedCaches = [
  staticCacheName,
];

self.onactivate = function(event) {
  if (self.clients && clients.claim) {
    clients.claim();
  }
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCaches.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
};

self.onfetch = function(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.hostname === "spreadsheets.google.com") {
    
  } else {
    event.respondWith(
      // First we look for something in the caches that
      // matches the request
      caches.match(event.request).then(function(response) {
        // If we get something, we return it, otherwise
        // it's null, and we'll pass the request to
        // fetch, which will use the network.
        return response || fetch(event.request);
      })
    );
  }
};

// self.onfetch = function(event) {
//   var requestURL = new URL(event.request.url);

//   if (requestURL.hostname == 'api.flickr.com') {
//     event.respondWith(flickrAPIResponse(event.request));
//   }
//   else if (/\.staticflickr\.com$/.test(requestURL.hostname)) {
//     event.respondWith(flickrImageResponse(event.request));
//   }
//   else {
//     event.respondWith(
//       caches.match(event.request, {
//         ignoreVary: true
//       })
//     );
//   }
// };