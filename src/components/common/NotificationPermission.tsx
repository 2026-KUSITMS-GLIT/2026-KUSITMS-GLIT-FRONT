"use client";

import { getToken } from "firebase/messaging";
import { useEffect } from "react";

import { postDeviceToken } from "@/lib/apis/auth";
import { getMessagingInstance } from "@/lib/firebase/settingFCM";

export default function NotificationPermission() {
  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    const run = async () => {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      if (Notification.permission === "denied") return;

      const permission =
        Notification.permission === "granted" ? "granted" : await Notification.requestPermission();

      if (permission !== "granted") return;

      const messaging = getMessagingInstance();
      if (!messaging) return;

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      await postDeviceToken(token);
    };

    run().catch(console.error);
  }, []);

  return null;
}
