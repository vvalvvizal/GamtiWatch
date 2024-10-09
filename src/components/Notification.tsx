import React, { useState, useEffect } from "react";
import { requestForToken, onMessageListener } from "../firebase"; // Firebase 함수들 가져오기
import { ToastContainer, toast } from "react-toastify"; // react-toastify 임포트
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [shownNotification, setShownNotification] = useState(false); // 알림이 이미 표시되었는지 여부

  const notify = () => {
    // 이미 알림이 표시되었다면 중복으로 표시하지 않음
    if (!shownNotification) {
      toast(<ToastDisplay />);
      setShownNotification(true); // 알림을 표시했음을 기록
    }
  };
  // Toast 메시지 내용 정의
  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    );
  }
  useEffect(() => {
    if (notification?.title) {
      notify(); // 알림 띄우기
    }
  }, [notification]);

  // FCM을 위한 토큰 요청 및 메시지 리스너
  useEffect(() => {
    requestForToken(); //firebase의 requestForToken메소드 호출

    const unsubscribe = onMessageListener()
      .then((payload: any) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
      })
      .catch((err: Error) => console.log("알림 리스너 실패: ", err));
    return () => {
      // unsubscribe를 통해 리스너 해제
      // onMessageListener에서는 해제할 필요가 없으므로 삭제
    };
  }, []);
  return <ToastContainer />;
};

export default Notification;
