'use strict';
/* global Request, Response, caches, URL, fetch */

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/datalist-polyfill.js',
  '/tachyons.css',
  'https://spreadsheets.google.com/feeds/list/1j9z1tQwSwxclM-ucThVbraR_JaQcvnwnPoDGFLGUFfU/2/public/values'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache.map(function(urlToPrefetch) {
         return new Request(urlToPrefetch, { mode: 'no-cors' });
      })).then(function() {
        console.log('All resources have been fetched and cached.');
      });
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
