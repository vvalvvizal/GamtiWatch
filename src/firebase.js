// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gamtiwatch.firebaseapp.com",
  projectId: "gamtiwatch",
  storageBucket: "gamtiwatch.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        //console.log("current token for client: ", currentToken);

        // 기존의 토큰과 비교
        const existingToken = localStorage.getItem("fcmToken");
        if (existingToken !== currentToken) {
          localStorage.setItem("fcmToken", currentToken);
          // 여기서 서버에 새로운 토큰을 전송하는 로직 추가
          // 예: sendTokenToServer(currentToken);
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

//알림 권한 요청
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted.");
    // 토큰 요청 호출
    requestForToken();
  } else {
    console.log("Unable to get permission to notify.");
  }
});

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
