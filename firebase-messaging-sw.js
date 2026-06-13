// firebase-messaging-sw.js
// Cloudflare Pages のルート ( / ) に置く
// バージョンをメインHTMLと揃えて v12.14.0 に統一

importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBv2-_eFc4JJF3pDX-suKm8ZUtZSaWvY2U",
  authDomain:        "card-base-378b7.firebaseapp.com",
  projectId:         "card-base-378b7",
  storageBucket:     "card-base-378b7.firebasestorage.app",
  messagingSenderId: "542621553038",
  appId:             "1:542621553038:web:dab3b78c0c889d678614df"
});

const messaging = firebase.messaging();

// ── ページが閉じていても届く通知 ──
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  const title = d.title || 'CARD//MANAGER';
  const level = d.level || '';
  const levelLabel = {
    notice:  '注意',
    caution: '要確認',
    warning: '⚠ 警戒',
    high:    '🔶 高警戒',
    crit:    '🔴 緊急',
    expired: '⏰ 期限到達',
  }[level] || '通知';

  const body = [
    d.code  ? `コード: ${d.code}` : null,
    d.remaining ? `残り ${d.remaining}` : null,
  ].filter(Boolean).join('\n') || 'タイマーが終了しました。';

  return self.registration.showNotification(`${levelLabel}: ${title}`, {
    body,
    icon:              '/icon-192.png',
    badge:             '/icon-96.png',
    tag:               `${d.uid || 'card'}-${level}`,
    requireInteraction: level === 'crit' || level === 'expired',
    silent:            false,
    data:              d,
  });
});

// 通知クリック → アプリを開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      if (cs.length > 0) return cs[0].focus();
      return clients.openWindow('/');
    })
  );
});
