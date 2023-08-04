/* Ionic/Capacitor */
import { IonContent, IonButton, IonPage, useIonRouter, IonFooter, IonHeader } from '@ionic/react';


/* CSS + Other components */
import '../App.css';
import { useAppContext } from '../my-context';
import Header from './Header';
import { dynamicNavigate } from './Navigation';


const LandingPage = () => {

  const router = useIonRouter();
  const context = useAppContext();

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div style={{ height: "15vh" }} />

        <IonHeader className="ion-no-border" style={{ paddingBottom: "5vh" }}>
          <Header darkMode={context.darkMode} schoolName="" zoom={1.1} style={{ fontWeight: "bold", margin: 0 }} />
          <p style={{ textAlign: "center", fontSize: "1.5em", fontFamily: 'Arial' }}>University Chats</p>
        </IonHeader>

        <div style={{ height: "30%" }} />

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