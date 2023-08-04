import LoadingPage from './pages/LoadingPage';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';

// Ionic/Capacitor + React
import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import {
  IonApp, IonRouterOutlet, setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import { Capacitor } from '@capacitor/core';
import { DeleteAccount } from './pages/DeleteAccount';
import { useAppContext } from './my-context';
import { ToastProvider } from '@agney/ir-toast';

// Global variables
setupIonicReact({ mode: 'md' }); // ios for iPhone, md for Android, affects ALL components
const historyInstance = createBrowserHistory();

const RoutingSystem: React.FunctionComponent = () => {

  const history = useHistory();
  const context = useAppContext();

  React.useEffect(() => {
    context.setDarkMode(true);
    if (Capacitor.getPlatform() === 'web') {
      if (window.location.href.includes('delete-account') || window.location.href.includes('forgot-password')) {
        history.replace('/landing-page');
      } else {
        window.location.href = 'https://apps.apple.com/us/app/tellu/id6443764288?ign-itscg=30200&ign-itsct=apps_box_link';
      }
    }
  }, []);

  return (
    <ToastProvider value={{ duration: 2000 }}>
      <IonRouterOutlet>
        <Route path="/" exact component={LoadingPage} />
        <Route path="/loadingPage" exact component={LoadingPage} />
        <Route path="/landing-page" exact component={LandingPage} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/delete-account" exact component={DeleteAccount} />
      </IonRouterOutlet>
    </ToastProvider>
  )
};


const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter history={historyInstance}>
        <RoutingSystem />
      </IonReactRouter>
    </IonApp>
  )
};

export default App;

