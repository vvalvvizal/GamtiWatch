/* eslint-disable no-restricted-globals */

self.addEventListener("install", () => {
  self.skipWaiting();
  console.log("[Service Worker] installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("[Service Worker] activated", event);
});
