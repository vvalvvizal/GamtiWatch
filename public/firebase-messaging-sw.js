// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBvk6Jhm8AyHgM5SSCthV5FMRgigo1EvHU",
  authDomain: "gamtiwatch.firebaseapp.com",
  projectId: "gamtiwatch",
  storageBucket: "gamtiwatch.appspot.com",
  messagingSenderId: "590030782012",
  appId: "1:590030782012:web:aadb8f1cc094c8c5d40d39",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
//백그라운드 실행 serviceworker
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "favicon.ico", // Change this to your icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
