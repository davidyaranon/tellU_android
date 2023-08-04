import { useState } from "react";
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";

import { useToast } from "@agney/ir-toast";
import Header from "./Header";
import { useAppContext } from "../my-context";
import { Toolbar } from "./Toolbar";
import { Dialog } from "@capacitor/dialog";
import { deleteUserDataAndAccount } from "../fbConfig";

// global variables

export const DeleteAccount = () => {

  // hooks
  const Toast = useToast();
  const context = useAppContext();

  // state variables
  const [email, setEmail] = useState<string | number>("");
  const [password, setPassword] = useState<string>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const handleDeleteAccount = async () => {
    if(!email) {
      const toast = Toast.create({ message: 'Email not found, try again', duration: 2000, color: 'toast-error' });
      toast.present();
      return;
    }
    if(!password) {
      const toast = Toast.create({ message: 'Enter a password', duration: 2000, color: 'toast-error' });
      toast.present();
      return;
    }
    const { value } = await Dialog.confirm({
      title: 'Delete Account',
      message: `Are you sure you want to delete your account?`,
      okButtonTitle: 'Delete my account'
    });
    if (!value) { return; }
    const areYouSure = await Dialog.confirm({
      title: 'Delete Account',
      message: `Are you REALLY sure you want to delete your account?`,
      okButtonTitle: 'Delete my account'
    });
    if (!areYouSure.value) { return; }
    setButtonDisabled(true);
    const res = await deleteUserDataAndAccount(email.toString(), password);
    if(typeof res === 'string') {
      const toast = Toast.create({ message: res, duration: 2000, color: 'toast-error' });
      toast.present();
    } else {
      Toast.success("Account deleted! Sorry you had to go :(");
    }
    setButtonDisabled(false);
  };

  return (
    <IonPage>
      <Toolbar color="primary" text="Back" />

      <IonContent>

        <IonHeader className='ion-no-border' style={{ padding: "5vh" }}>
          <Header darkMode={context.darkMode} schoolName="" zoom={1.2} />
          <p style={{ textAlign: "center", fontSize: "1.5em", fontFamily: 'sans-serif' }}>Forgot Password</p>
        </IonHeader>

        <p className="ion-text-center" style={{paddingLeft : "15%", paddingRight: "15%"}}>Enter your email and password to delete your tellU account. All user posts will be deleted. No emails/passwords are saved. There is no account recovery once deleted. You can also delete your account within the tellU app.</p>

        <IonLabel color="primary" className="login-label">Email</IonLabel>
        <IonItem className='login-input'>
          <IonInput type="email" value={email} placeholder="Email" onIonChange={(e) => { setEmail(e.detail.value!); }} />
        </IonItem>
        <br />
        <IonLabel color="primary" className="login-label">Password</IonLabel>
        <IonItem className='login-input'>
          <IonInput type="password" value={password} placeholder="Password" onIonChange={(e) => { setPassword(e.detail.value!); }} />
        </IonItem>
        <br />
        <IonButton className="delete-account-button" disabled={buttonDisabled} onClick={() => { handleDeleteAccount(); }} fill="clear" expand="block" id="signInButton" >Delete Account</IonButton>

      </IonContent>
    </IonPage>
  );
};