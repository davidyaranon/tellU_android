// Pages
import Home from './pages/Home';
import LoadingPage from './pages/LoadingPage';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Maps from './pages/Maps';
import Class from './pages/Class';
import Post from './pages/Post';
import DirectMessages from './pages/DirectMessages';
import PostTypes from './pages/PostTypes';
import ChatRoom from './pages/ChatRoom';
import Notifications from './pages/Notifications';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Events from './pages/Events';
import UserProfile from './pages/UserProfile';
import MapMarkerInfo from './pages/MapMarkerInfo';
import HumboldtHank from './pages/HumboldtHank';

// Ionic/Capacitor + React
import React, { useCallback } from 'react';
import { Route, useHistory } from 'react-router-dom';
import {
  IonApp, IonIcon, IonRouterOutlet, IonTabBar,
  IonTabButton, IonTabs, setupIonicReact, useIonToast,
} from '@ionic/react';
import { useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import {
  calendarOutline, calendarSharp, homeOutline, homeSharp,
  mapOutline, mapSharp, personOutline, personSharp
} from 'ionicons/icons';
import { SplashScreen } from '@capacitor/splash-screen';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed, PushNotifications,
  PushNotificationSchema
} from '@capacitor/push-notifications';
import {
  Keyboard, KeyboardStyle,
  KeyboardStyleOptions,
} from "@capacitor/keyboard";
import { StatusBar, Style } from '@capacitor/status-bar';

// CSS
import "./App.css";
import './theme/variables.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Other imports
import { createBrowserHistory } from "history";
import { ToastProvider } from "@agney/ir-toast";
import { useAppContext } from "./my-context";
import { FCM } from '@capacitor-community/fcm';
import aiIconFilled from './images/aiFilled.svg';
import aiIconUnfilled from './images/aiUnfilled.svg';
import AppUrlListener from './AppUrlListener';

// Global variables
setupIonicReact({ mode: 'md' }); // ios for iPhone, md for Android, affects ALL components
const historyInstance = createBrowserHistory();
SplashScreen.show({
  autoHide: true,
  fadeInDuration: 300,
  fadeOutDuration: 300,
});
StatusBar.setOverlaysWebView({ overlay: false });
const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
}

const RoutingSystem: React.FunctionComponent = () => {

  /* hooks */
  const context = useAppContext();
  const history = useHistory();
  const [present] = useIonToast();

  /* state variables */
  const [selectedTab, setSelectedTab] = React.useState<string>('home');

  /**
   * A function that presents an in-app toast notification
   * when they receive a DM push notification
   * 
   * @param {string} message the message to be displayed
   * @param {string} url the url to be opened if a user clicks the notification
   * @param {string} position where the toast will be displayed on the screen (top, middle, bottom)
   */
  const presentToast = (message: string, url: string, position: 'top' | 'middle' | 'bottom') => {
    message = message.replace(' sent a DM', "");
    present({
      message: message,
      duration: 3500,
      position: position,
      buttons: [
        {
          text: 'Open',
          role: 'info',
          handler: () => { history.push(url); }
        },
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => { }
        }
      ],
      cssClass: 'toast-options',
    });
  }

  // React.useEffect(() => {
  //   if (Capacitor.getPlatform() === 'web') {
  //     history.replace('/landing-page');
  //     window.location.href = 'https://apps.apple.com/us/app/tellu/id6443764288?ign-itscg=30200&ign-itsct=apps_box_link';
  //   }
  // }, []);

  const handlePushNotificationListeners = useCallback(() => {
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        let urlJSON = notification.data["gcm.notification.data"]
        let noBackSlashes = urlJSON.toString().replaceAll('\\', '');
        let removedUrl = noBackSlashes.substring(7, noBackSlashes.length);
        let finalUrl = removedUrl.slice(1, removedUrl.length - 2);
        presentToast(notification.body || "", finalUrl || "", 'top');
      },
    ).then(() => {
      console.log('adding listener for push notif received');
    });
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // alert('clicked on notif');
        let urlJSON = notification.notification.data["gcm.notification.data"]
        let noBackSlashes = urlJSON.toString().replaceAll('\\', '');
        let removedUrl = noBackSlashes.substring(7, noBackSlashes.length);
        let finalUrl = removedUrl.slice(1, removedUrl.length - 2);
        history.push(finalUrl);
      },
    ).then(() => {
      console.log('adding listener for notif action performed');
    });
  }, [])

  /**
   * Runs once on app load
   * Adds a listener to PushNotifications
   */
  useEffect(() => {
    if (context.initLoad)
      handlePushNotificationListeners();
  }, [context.initLoad]);

  return (

    /* Allows use of toast popups throughout app using the useToast() hook */
    <ToastProvider value={{ color: "primary", duration: 2000 }}>

      <AppUrlListener></AppUrlListener>

      {/* Routing */}
      <IonTabs onIonTabsDidChange={(e) => { setSelectedTab(e.detail.tab) }}>

        <IonRouterOutlet>
          <Route path="/" exact component={LoadingPage} />
          <Route path="/loadingPage" exact component={LoadingPage} />
          <Route path="/landing-page" exact component={LandingPage} />
          <Route path="/sign-in" exact component={SignIn} />
          <Route path="/forgot-password" exact component={ForgotPassword} />
          <Route path="/register" exact component={Register} />
          <Route path="/:tab(home)" exact component={Home} />
          <Route path="/:tab(maps)" exact component={Maps} />
          <Route path="/:tab(events)" exact component={Events} />
          <Route path="/:tab(settings)" exact component={Settings} />
          <Route path="/:tab(hank)" exact component={HumboldtHank} />
          <Route path="/markerInfo/:school/:title" component={MapMarkerInfo} />
          <Route path="/about/:school/:uid" component={UserProfile} />
          <Route path="/post/:school/:userName/:key" component={Post} />
          <Route path="/direct/:schoolName/:directMessageId" component={DirectMessages} />
          <Route path="/chatroom/:schoolName/:collectionPath" component={ChatRoom} />
          <Route path="/privacy-policy" exact component={PrivacyPolicy} />
          <Route path="/notifications" exact component={Notifications} />
          <Route path="/class/:schoolName/:className" component={Class} />
          <Route path="/type/:schoolName/:type" exact component={PostTypes} />
        </IonRouterOutlet>

        {/* Bottom Tabs / Tab Bar */}
        <IonTabBar style={context.showTabs ? {} : { display: "none" }} slot="bottom">
          <IonTabButton className={context.darkMode ? "tab-dark" : "tab-light"} tab="home" href="/home">
            Home
            <IonIcon size='medium' style={{ bottom: "-20px" }} icon={selectedTab === 'home' ? homeSharp : homeOutline} color={selectedTab === 'home' ? "primary" : "light"} />
          </IonTabButton>

          <IonTabButton className={context.darkMode ? "tab-dark" : "tab-light"} tab="events" href="/events">
            Events
            <IonIcon size='medium' icon={selectedTab === 'events' ? calendarSharp : calendarOutline} color={selectedTab === 'events' ? "primary" : "light"} />
          </IonTabButton>

          <IonTabButton tab="hank" href="/hank">
            AI
            {selectedTab === 'hank' ? <IonIcon style={{ transform: "scale(1.2)" }} src={aiIconFilled} /> : <IonIcon style={{ transform: "scale(1.2)" }} src={aiIconUnfilled} />}
          </IonTabButton>

          <IonTabButton className={context.darkMode ? "tab-dark" : "tab-light"} tab="maps" href="/maps">
            Map
            <IonIcon size='medium' icon={selectedTab === 'maps' ? mapSharp : mapOutline} color={selectedTab === 'maps' ? "primary" : "light"} />
          </IonTabButton>

          <IonTabButton className={context.darkMode ? "tab-dark" : "tab-light"} tab="settings" href="/settings">
            Settings
            <IonIcon size='medium' icon={selectedTab === 'settings' ? personSharp : personOutline} color={selectedTab === "settings" ? "primary" : "light"} />
          </IonTabButton>
        </IonTabBar>

      </IonTabs>

    </ToastProvider>
  )
};


const App: React.FC = () => {

  // hooks
  const context = useAppContext();

  /**
   * @description Runs on app startup.
   * Enables dark mode if it had been enabled previously.
   * Dark mode is enabled by default on iOS devices.
   */
  const handleDarkMode = React.useCallback(async () => {
    document.body.classList.toggle("dark");
    context.setDarkMode(true);
    if (Capacitor.getPlatform() === 'md') {
      Keyboard.setStyle(keyStyleOptionsDark);
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, []);


  const handleMapTiler = React.useCallback(async () => {
    const mapId = await Preferences.get({ key: "mapTilerId" });
    if (!mapId.value) {
      context.setMapTilerId('streets');
    } else {
      context.setMapTilerId(mapId.value);
    }
  }, []);


  /**
   * @description Runs on app startup.
   * Enables post sensitivity if it had been enabled previously
   */
  const handleSensitivityToggle = React.useCallback(async () => {
    const isChecked = await Preferences.get({ key: "sensitivityToggled" });
    if (isChecked.value === "false") {
      context.setSensitivityToggled(false);
    } else {
      context.setSensitivityToggled(true);
    }
  }, []);

  /**
   * @description A function that will check permissions for push notifications on iOS.
   * If accepted, user will be registered to receive push notifications
   * and will be assigned a unique token to identify them . 
   * Uses Google FCM to send push notifications.
   */
  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    console.log(permStatus.receive);
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      } else {
        PushNotifications.register().then(() => {
          FCM.getToken().then((token) => {
            localStorage.setItem("notificationsToken", token.token);
            console.log('setting notif token item: ', token.token);
            console.log(token.token);
          });
        });
      }
    }
  };

  /**
   * @description set school name context
   */
  const setSchoolName = React.useCallback(async () => {
    const schoolName = await Preferences.get({ key: 'school' });
    if (schoolName.value)
      context.setSchoolName(schoolName.value);
  }, []);

  /**
   * @description Dark mode use effect
   */
  useEffect(() => {
    setSchoolName().catch((err) => console.log(err));
    handleDarkMode().catch((err) => { console.log(err); });
    handleMapTiler().catch((err) => { console.log(err); });
    handleSensitivityToggle().catch((err) => { console.log(err); });
    registerNotifications();
  }, []);


  return (
    <IonApp>
      <IonReactRouter history={historyInstance}>
        <RoutingSystem />
      </IonReactRouter>
    </IonApp>
  )
};

export default App;

