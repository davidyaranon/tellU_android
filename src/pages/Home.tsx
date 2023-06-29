import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import '../App.css';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth, { getAppVersionNum } from '../fbConfig';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Dialog } from '@capacitor/dialog';
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from '@capacitor/keyboard';
import { Preferences } from '@capacitor/preferences';
import { useAppContext } from '../my-context';
import { timeout } from '../components/Shared/Timeout';
import { SplashScreen } from '@capacitor/splash-screen';
import { dynamicNavigate } from '../components/Shared/Navigation';

const versionNum: string = '3.2.2';
const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
}

const Home: React.FC = () => {
  
  const context = useAppContext();
  const router = useIonRouter();
  const [user, loading, error] = useAuthState(auth);

  /**
   * Loads school from local storage (Preferences API).
   * Currently just defaults to Cal Poly Humboldt.
   * 
   * @todo TODO: Add support for all other schools.
   */
  // const setSchool = React.useCallback(async () => {
  //   const school = await Preferences.get({ key: 'school' });
  //   if (school && school.value) {
  //     setSchoolName(school.value);
  //   } else {
  //     setSchoolName('Cal Poly Humboldt');
  //     await Preferences.set( {key : "school", value: "Cal Poly Humboldt" } );
  //   }
  // }, []);

  const handleGoToNewPage = () => {
    dynamicNavigate(router, '/newPage', 'forward');
  };

  React.useEffect(() => {
    context.setDarkMode(true);
    document.body.classList.toggle("dark");
    context.setDarkMode(true);
    if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'md') {
      Keyboard.setStyle(keyStyleOptionsDark);
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, []);

  const hideSplashScreen = React.useCallback(async () => {
    await timeout(250);
    SplashScreen.hide();
  }, []);

  /**
   * Hides splash screen on mount
   */
  React.useEffect(() => {
    hideSplashScreen();
  }, []);

  /**
   * Calls setSchool on mount
   */
  // React.useEffect(() => {
  //   setSchool();
  // }, [setSchool]);

  /**
   * Sets the showTabs variable in the context to true
   */
  useIonViewWillEnter(() => {
    if (context.showTabs === false) {
      context.setShowTabs(true);
    }
  });

  const handleGetVersion = React.useCallback(async () => {
    const serverVersion = await getAppVersionNum();
    if (serverVersion !== versionNum) {
      await Dialog.alert({
        title: "App Update Available",
        message: 'Consider updating to the latest version of tellU!',
      });
    }
  }, [])

  React.useEffect(() => {
    handleGetVersion();
  }, []);

  useIonViewWillEnter(() => {
    if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'md') {
      StatusBar.setStyle({ style: Style.Dark })
    }
  });



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonButton onClick={handleGoToNewPage} />

      </IonContent>
    </IonPage>
  );
};

export default Home;
