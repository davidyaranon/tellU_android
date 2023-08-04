/**
 * @file Navigation.tsx
 * @fileoverview Provides navigation/history logic for app (going back/pushing forward)
 */

import { RouterDirection, UseIonRouterResult } from "@ionic/react";
import { App as CapacitorApp } from '@capacitor/app';

export const dynamicNavigate = (router : UseIonRouterResult, path: string, direction: RouterDirection) => {
  const action = direction === "forward" ? "push" : "pop";
  router.push(path, direction, action);
}
export const navigateBack = (router : UseIonRouterResult) => {
  if (router.canGoBack()) {
    router.goBack();
  } else {
    CapacitorApp.exitApp();
  }
}