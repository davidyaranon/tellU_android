// Ionic/Capacitor + React
import { IonContent, IonNote, IonPage, useIonRouter } from "@ionic/react";
import React from "react";
import { Network } from '@capacitor/network';
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

// Firebase/Google
import auth from "../fbConfig";

// Other imports/components
import { dynamicNavigate } from "../components/Shared/Navigation";
import tellU_logo from "../images/tellU_splash_2_1_2048x2048.png";

// CSS
import "../App.css";
import { useAppContext } from "../my-context";
import { Capacitor } from "@capacitor/core";
import { useHistory } from "react-router";

const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
}

const LoadingPage = () => {

  // hooks
  const context = useAppContext();
  const router = useIonRouter();
  const history = useHistory();
  const [isOffline, setIsOffline] = React.useState<boolean>(false);

  React.useEffect(() => {
    context.setDarkMode(true);
    document.body.classList.toggle("dark");
    context.setDarkMode(true);
    if (Capacitor.getPlatform() === "md") {
      Keyboard.setStyle(keyStyleOptionsDark);
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, [context]);

  /**
   * Auth state listener for Firebase auth
   * Sets tabs visibility based on auth state
   */
  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log({user})
        console.log("logged in");
        context.setShowTabs(true);
        dynamicNavigate(router, '/home', 'root');
      } else {
        const isOffline = await Network.getStatus();
        if (isOffline.connected) {
          console.log("logged out");
          context.setShowTabs(false);
          dynamicNavigate(router, '/landing-page', 'root');
        } else {
          setIsOffline(true);
        }
      }
    });
    return unsub;
  }, []);

  React.useEffect(() => {
    if (Capacitor.getPlatform() === 'web') {
      window.location.href = 'https://apps.apple.com/us/app/tellu/id6443764288?ign-itscg=30200&ign-itsct=apps_box_link';
    }
  }, []);

  /**
   * Shows offline message if user has no connection
   */
  if (isOffline) { // TODO: return an offline image / animation
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="centered">
            <IonNote> You are offline. </IonNote>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  /**
   * Loading screen
   */
  return (
    <IonPage>
      <IonContent fullscreen style={{ "--background": "var(--ion-color-splash-screen-background)" }}>
        <div className="centered">
          <img style={{ scale: "2" }} src={tellU_logo} />
        </div>
      </IonContent>
    </IonPage>
  )
};

export default LoadingPage;