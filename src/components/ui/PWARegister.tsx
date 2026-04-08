"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/sw.js").catch((err) => console.log("PWA SW err: ", err));
        });
      } else {
        // Dev modunda eski yüklenen servis worker varsa zorla kaldır to prevent aggressive caching
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    }
  }, []);

  return null;
}
