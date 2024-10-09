/* eslint-disable no-restricted-globals */

// install event
//서비스 워커 설치
self.addEventListener("install", (e) => {
  console.log("[Service Worker] installed");
});

// activate event
//서비스 워커 활성화
self.addEventListener("activate", (e) => {
  console.log("[Service Worker] actived", e);
});

// fetch event
//리소스 fetch 이벤트 처리
self.addEventListener("fetch", (e) => {
  console.log("[Service Worker] fetched resource " + e.request.url);
});
