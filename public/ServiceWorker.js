/* eslint-disable no-restricted-globals */

self.addEventListener("install", () => {
  console.log("[Service Worker] installed");
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] activated", event);
});

self.addEventListener("fetch", (event) => {
  console.log(`[Service Worker] fetched resource ${event.request.url}`);
});
