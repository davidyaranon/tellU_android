/* Ionic/Capacitor */
import { IonContent, IonButton, IonPage, useIonRouter, IonFooter, IonHeader, IonRow, IonCol } from '@ionic/react';

/* CSS + Other components */
import '../App.css';
import { useAppContext } from '../my-context';
import Header from './Header';
import { dynamicNavigate } from './Navigation';

import app_store from '../images/app_store.svg';
import google_play from '../images/google-play-badge.png';


const LandingPage = () => {

  const router = useIonRouter();
  const context = useAppContext();

  return (
    <IonPage>
      <IonContent>
        <div style={{ height: "15vh" }} />

        <IonHeader className="ion-no-border" style={{ paddingBottom: "5vh" }}>
          <Header darkMode={context.darkMode} schoolName="" zoom={1.1} style={{ fontWeight: "bold", margin: 0 }} />
          <p style={{ textAlign: "center", fontSize: "1.5em", fontFamily: 'Arial' }}>University Chats</p>
        </IonHeader>

        <div style={{ height: "5%" }} />
        <IonRow style={{ padding: "1%" }}>
            <IonCol className='ion-text-right'>
              <img src={app_store} alt='iOS App Store logo' className='store-logo' onClick={() => { window.location.href = "https://apps.apple.com/us/app/tellu/id6443764288?ign-itscg=30200&ign-itsct=apps_box_link"; }} />
            </IonCol>
            <IonCol size=".5"></IonCol>
            <IonCol className='ion-text-left'>
              <img src={google_play} alt='Google Play Store logo' className='store-logo' style={{ scale: "1.25", transform: 'translateY(-5%)' }} onClick={() => { window.location.href = ""; }} />
            </IonCol>
          </IonRow>

        <IonFooter>
          <div>
            <IonButton className="login-button" fill="clear" expand="block" id="signInButton" onClick={() => dynamicNavigate(router, '/forgot-password', 'forward')}>Forgot Password</IonButton>
          </div>
          <div style={{ height: "1vh" }} />
          <div>
            <IonButton className="login-button" fill="clear" expand="block" id="signInButton" onClick={() => dynamicNavigate(router, '/delete-account', 'forward')}>Delete Account</IonButton>
          </div>
        </IonFooter>

      </IonContent>
    </IonPage>
  )

}

export default LandingPage;