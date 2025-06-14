// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js'); 
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js'); 

// Инициализация Firebase в Service Worker
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "friendly-fcm.firebaseapp.com",
  projectId: "friendly-fcm",
  storageBucket: "friendly-fcm.firebasestorage.app",
  messagingSenderId: "G-M35YCWXMNT",
  appId: "1:210160059112:web:aabd4d562c67c24e54ff5d",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Обработка фоновых уведомлений
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Получено фоновое сообщение ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/badge.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});