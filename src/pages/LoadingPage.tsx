// Ionic/Capacitor + React
import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

// Other imports/components
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
  const history = useHistory();

  React.useEffect(() => {
    context.setDarkMode(true);
    document.body.classList.toggle("dark");
    context.setDarkMode(true);
    if (Capacitor.getPlatform() === "md") {
      Keyboard.setStyle(keyStyleOptionsDark);
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, [context]);

  React.useEffect(() => {
    if (Capacitor.getPlatform() === 'web') {
      if (window.location.href.includes('delete-account') || window.location.href.includes('forgot-password')) {
        history.replace('/landing-page');
      } else {
        window.location.href = 'https://apps.apple.com/us/app/tellu/id6443764288?ign-itscg=30200&ign-itsct=apps_box_link';
      }
    }
  }, []);

  /**
   * Loading screen
   */
  return (
    <IonPage>
      <IonContent scrollY={false} fullscreen style={{ "--background": "var(--ion-color-splash-screen-background)" }}>
        <div className="centered">
          <img style={{ scale: "2" }} src={tellU_logo} />
        </div>
      </IonContent>
    </IonPage>
  )
};

export default LoadingPage;