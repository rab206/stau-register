'use strict';
/* global Response, caches, URL, fetch */

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/datalist-polyfill.js',
  '/tachyons.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(oldCache) {
          if (CACHE_NAME != oldCache) {
            return caches.delete(oldCache);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    // go to network first
    fetch(event.request).then(response => {
      return response;
    }).catch(() =>
      caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // if no network and cache hit fails then return a dummy response
        return new Response('Sorry the page was not cached and you are offline');
      })
    )
  );
});
