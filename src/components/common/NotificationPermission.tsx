"use client";

import { getToken } from "firebase/messaging";
import { useEffect } from "react";

import { postDeviceToken } from "@/lib/apis/auth";
import { patchAlarmSettings } from "@/lib/apis/notification";
import { getMessagingInstance } from "@/lib/firebase/settingFCM";

export async function requestNotificationPermission() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    await patchAlarmSettings({ isActive: false }).catch(console.error);
    return;
  }

  const messaging = getMessagingInstance();
  if (!messaging) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    await postDeviceToken(token);
  } catch (error) {
    console.error(error);
  }
}

export default function NotificationPermission() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/firebase-messaging-sw.js");
  }, []);

  return null;
}
