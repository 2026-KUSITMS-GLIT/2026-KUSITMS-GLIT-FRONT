self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function () {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  if (!e.data) return;
  const { title, body } = e.data.json().notification;
  e.waitUntil(self.registration.showNotification(title, { body, icon: "/icon-192x192.png" }));
});
