/* React imports */
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";

/* Ionic/Capacitor */
import {
  IonContent, IonHeader, IonButton, IonLoading, IonInput,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonPage, useIonRouter, IonIcon, AlertOptions
} from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { FCM } from "@capacitor-community/fcm";

/* Firebase */
import auth, { updateNotificationsToken } from '../fbConfig';
import { registerWithEmailAndPassword, checkUsernameUniqueness, db } from "../fbConfig";
import { doc, getDoc } from "firebase/firestore";

/* CSS + Other components */
import "../App.css";
import Header from "../components/Shared/Header";
import { useToast } from "@agney/ir-toast";
import { Dialog } from "@capacitor/dialog";
import { Preferences } from "@capacitor/preferences";
import { dynamicNavigate } from "../components/Shared/Navigation";
import { useAppContext } from "../my-context";
import { Toolbar } from "../components/Shared/Toolbar";

/* Global variables */
const emojis = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
const inputNote: React.CSSProperties = {
  fontSize: "0.85em",
  textAlign: "right",
  color: "var(--ion-color-primary)",
  fontFamily: "Arial",
  marginTop: "-1vh",
  height: "0.5vh",
  marginRight: "10vw"
};
const inputNoteError: React.CSSProperties = {
  fontSize: "0.85em",
  textAlign: "right",
  color: "var(--ion-color-toast-error)",
  fontFamily: "Arial",
  marginTop: "-1vh",
  height: "0.5vh",
  marginRight: "10vw"
};
const selectInterfaceOptions: AlertOptions = {
  header: "University",
  subHeader: "Select your university",
  cssClass: 'custom-alert',
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
    }
  ]
}

const Register: React.FC = () => {

  // state variables
  const [emailSignUp, setEmailSignUp] = React.useState("");
  const [userNameSignUp, setUserNameSignUp] = React.useState("");
  const [passwordSignUp, setPasswordSignUp] = React.useState("");
  const [schoolName, setSchoolName] = React.useState("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [schoolEmailEnding, setSchoolEmailEnding] = React.useState("");
  const [busy, setBusy] = React.useState<boolean>(false);

  // hooks
  const [user, loading] = useAuthState(auth);
  const Toast = useToast();
  const router = useIonRouter();
  const history = useHistory();
  const context = useAppContext();

  /**
   * @description Uses Firebase Auth to register using email (emailSignUp) and password (passwordSignUp).
   * User input must meet certain requirements.
   * The user is redirected to the home page upon successful registration.
   */
  async function register() {
    setBusy(true);
    await Preferences.clear();
    context.setSchoolName('');
    if (schoolName) {
      var idx = emailSignUp.lastIndexOf('@');
      if (idx > -1 && (emailSignUp.slice(idx + 1)).toLowerCase() === schoolEmailEnding) {
        // do nothing
      } else {
        const toast = Toast.create({ message: 'Use your University\'s email address', duration: 2000, color: 'toast-error' });
        toast.present();
        setBusy(false);
        return;
      }
    }
    if (userNameSignUp.trim() === "" || passwordSignUp.trim() === "" || emailSignUp.trim() === "") {
      const toast = Toast.create({ message: 'Enter a value in each field', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (schoolName.length == 0) {
      const toast = Toast.create({ message: "Select a University", duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (((emailSignUp.trim() || '').match(emojis) || []).length > 0) {
      const toast = Toast.create({ message: 'Email cannot contain emojis', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (((userNameSignUp.trim() || '').match(emojis) || []).length > 0) {
      const toast = Toast.create({ message: 'Username cannot contain emojis', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (userNameSignUp.trim().length > 15) {
      const toast = Toast.create({ message: 'Username cannot be more than 15 characters', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (passwordSignUp.length < 8) {
      const toast = Toast.create({ message: 'Password must be 8 or more characters', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (userNameSignUp.includes(" ")) {
      const toast = Toast.create({ message: 'Username cannot contain spaces', duration: 2000, color: 'toast-error' });
      toast.present();
    } else {
      const isUnique = await checkUsernameUniqueness(userNameSignUp.trim());
      if (!isUnique) {
        const toast = Toast.create({ message: 'Username has been taken!', duration: 2000, color: 'toast-error' });
        toast.present();
      } else {
        await Dialog.alert({
          title: "Agree to Terms and Conditions",
          message: 'Don\'t post anything offensive, obscene, or harmful! Be nice... read our privacy policy at https://tellu-app.com/page/privacy-policy',
        });
        console.log('checking old reg');
        // check old registration
        const res = await registerWithEmailAndPassword(
          userNameSignUp.trim(),
          emailSignUp.trim(),
          passwordSignUp,
          schoolName
        );
        console.log('reg done');
        if (!res) {
          Toast.error('Registration failed, try again');
        } else {
          console.log('registration done');
          const notificationsToken: string | null = localStorage.getItem("notificationsToken");
          console.log(notificationsToken);
          if (!notificationsToken || notificationsToken.length <= 0) {
            FCM.deleteInstance().then(() => console.log("FCM instance deleted")).catch((err) => console.log(err));
            FCM.getToken().then(async (token) => {
              localStorage.setItem("notificationsToken", token.token);
              await updateNotificationsToken(token.token);
              console.log("FCM TOKEN: " + token.token);
            });
          } else {
            console.log("NOTIFICATIONS TOKEN EXISTS : " + notificationsToken);
            await updateNotificationsToken(notificationsToken);
          }
          const toast = Toast.create({ message: 'Registered Successfully', duration: 2000, color: 'toast-success' });
          toast.present();
          toast.dismiss();
        }
        setBusy(false);
      }
    }
    setBusy(false);
  }

  const setSchool = React.useCallback(async (school: string) => {
    console.log('setting school: ' + school);
    await Preferences.set({ key: "school", value: school });
    context.setSchoolName(school);
    console.log('context and Preferences set');
  }, []);

  React.useEffect(() => {
    setBusy(true);
    if (user) {
      Preferences.get({ key: "school" }).then((res) => {
        if (res.value) {
          console.log(res.value);
          setBusy(false);
          dynamicNavigate(router, 'home', 'root');
          window.location.reload();
        } else {
          let school = "";
          const userRef = doc(db, "userData", user.uid);
          getDoc(userRef).then((userSnap) => {
            if (userSnap.exists()) {
              school = userSnap.data().school;
              console.log(school);
              setSchool(school);
            }
            setBusy(false);
            dynamicNavigate(router, 'home', 'root');
            window.location.reload();
          });
        }
      }).catch((err) => {
        console.log(err);
        setBusy(false);
        history.replace("/home");
        window.location.reload();
      });
    }
    setBusy(false);
    return () => {
      setBusy(false);
    }
  }, [user, loading]);


  return (
    <IonPage>
      <Toolbar color="primary" text={'\n'} />
      <IonContent>
        <IonHeader className="ion-no-border" style={{ paddingBottom: "5vh" }}>
          <Header darkMode={context.darkMode} schoolName="" zoom={1.1} style={{ fontWeight: "bold", margin: 0 }} />
          <p style={{ textAlign: "center", fontSize: "1.5em", fontFamily: 'Arial' }}>Register</p>
        </IonHeader>

        <IonLabel id="university-label" className="login-label">University</IonLabel>
        <IonItem className='register-input-select'>
          <IonSelect
            aria-label="university-label"
            value={schoolName}
            interface="action-sheet"
            interfaceOptions={selectInterfaceOptions}
            placeholder="University of California"
            onIonChange={async (e) => {
              await setSchool(e.detail.value);
              setSchoolName(e.detail.value);
              if (e.detail.value == 'Cal Poly Humboldt') {
                setSchoolEmailEnding('humboldt.edu');
              } else if (e.detail.value == 'UC Berkeley') {
                setSchoolEmailEnding('berkeley.edu');
              } else if (e.detail.value == 'UC Davis') {
                setSchoolEmailEnding('ucdavis.edu');
              }
              // else if (e.detail.value == 'UC Irvine') {
              //   setSchoolEmailEnding('uci.edu');
              // } else if (e.detail.value == 'UCLA') {
              //   setSchoolEmailEnding('ucla.edu');
              // } else if (e.detail.value == 'UC Merced') {
              //   setSchoolEmailEnding('ucmerced.edu');
              // } else if (e.detail.value == 'UC Riverside') {
              //   setSchoolEmailEnding('ucr.edu');
              // } else if (e.detail.value == 'UC San Diego') {
              //   setSchoolEmailEnding('ucsd.edu');
              // } else if (e.detail.value == 'UCSF') {
              //   setSchoolEmailEnding('ucsf.edu');
              // } else if (e.detail.value == 'UC Santa Barbara') {
              //   setSchoolEmailEnding('ucsb.edu');
              // } else if (e.detail.value == 'UC Santa Cruz') {
              //   setSchoolEmailEnding('ucsc.edu');
              // } else if (e.detail.value == 'Cal Poly Pomona') {
              //   setSchoolEmailEnding('cpp.edu');
              // } else if (e.detail.value == 'Cal Poly San Luis Obispo') {
              //   setSchoolEmailEnding('calpoly.edu');
              // } else if (e.detail.value == "Cal State Fullerton") {
              //   setSchoolEmailEnding('fullerton.edu');
              // } else if (e.detail.value == "Cal State East Bay") {
              //   setSchoolEmailEnding('csueastbay.edu');
              // } else if (e.detail.value == "Cal State LA") {
              //   setSchoolEmailEnding('calstatela.edu');
              // } else if (e.detail.value == "Cal Maritime") {
              //   setSchoolEmailEnding('csum.edu');
              // } else if (e.detail.value == "Cal State San Bernardino") {
              //   setSchoolEmailEnding('csusb.edu');
              // } else if (e.detail.value == "Cal State Long Beach") {
              //   setSchoolEmailEnding('csulb.edu');
              // } else if (e.detail.value == "SF State") {
              //   setSchoolEmailEnding('sfsu.edu');
              // } else if (e.detail.value == "San Jose State") {
              //   setSchoolEmailEnding('sjsu.edu');
              // } else if (e.detail.value == "Chico State") {
              //   setSchoolEmailEnding('csuchico.edu');
              // } else if (e.detail.value == "Fresno State") {
              //   setSchoolEmailEnding('csufresno.edu');
              // } else if (e.detail.value == "Stanislaus State") {
              //   setSchoolEmailEnding('csustan.edu');
              // } else if (e.detail.value == "Sac State") {
              //   setSchoolEmailEnding('csus.edu');
              // } else if (e.detail.value == "CSUN") {
              //   setSchoolEmailEnding('csun.edu');
              // } else if (e.detail.value == "CSU Bakersfield") {
              //   setSchoolEmailEnding('csub.edu');
              // } else if (e.detail.value == "CSU Dominguez Hills") {
              //   setSchoolEmailEnding('csudh.edu');
              // } else if (e.detail.value == "CSU Dominguez Hills") {
              //   setSchoolEmailEnding('csudh.edu');
              // } else if (e.detail.value == "CSU Channel Islands") {
              //   setSchoolEmailEnding('csuci.edu');
              // } else if (e.detail.value == "CSU Monterey Bay") {
              //   setSchoolEmailEnding('csumb.edu');
              // }
            }}
          >
            <IonSelectOption value="Cal Poly Humboldt">Cal Poly Humboldt</IonSelectOption>
            {/* <IonSelectOption value="Cal Poly Pomona">Cal Poly Pomona</IonSelectOption>
            <IonSelectOption value="Cal Poly San Luis Obispo">Cal Poly San Luis Obispo</IonSelectOption>
            <IonSelectOption value="Cal State Fullerton">Cal State Fullerton</IonSelectOption>
            <IonSelectOption value="Cal State East Bay">Cal State East Bay</IonSelectOption>
            <IonSelectOption value="Cal State LA">Cal State LA</IonSelectOption>
            <IonSelectOption value="Cal Maritime">Cal Maritime</IonSelectOption>
            <IonSelectOption value="Cal State San Bernardino">Cal State San Bernardino</IonSelectOption>
            <IonSelectOption value="Cal State Long Beach">Cal State Long Beach</IonSelectOption>
            <IonSelectOption value="SF State">SF State</IonSelectOption>
            <IonSelectOption value="San Jose State">San Jose State</IonSelectOption>
            <IonSelectOption value="Chico State">Chico State</IonSelectOption>
            <IonSelectOption value="Fresno State">Fresno State</IonSelectOption>
            <IonSelectOption value="San Diego State">San Diego State</IonSelectOption>
            <IonSelectOption value="Sonoma State">Sonoma State</IonSelectOption>
            <IonSelectOption value="Stanislaus State">Stanislaus State</IonSelectOption>
            <IonSelectOption value="Sac State">Sac State</IonSelectOption>
            <IonSelectOption value="CSUN">CSUN</IonSelectOption>
            <IonSelectOption value="CSU Bakersfield">CSU Bakersfield</IonSelectOption>
            <IonSelectOption value="CSU Dominguez Hills">CSU Dominguez Hills</IonSelectOption>
            <IonSelectOption value="CSU Channel Islands">CSU Channel Islands</IonSelectOption>
            <IonSelectOption value="CSU Monterey Bay">CSU Monterey Bay</IonSelectOption> */}
            <IonSelectOption value="UC Berkeley">UC Berkeley</IonSelectOption>
            <IonSelectOption value="UC Davis">UC Davis</IonSelectOption>
            {/* <IonSelectOption value="UC Irvine">UC Irvine</IonSelectOption>
            <IonSelectOption value="UCLA">UCLA</IonSelectOption>
            <IonSelectOption value="UC Merced">UC Merced</IonSelectOption>
            <IonSelectOption value="UC Riverside">UC Riverside</IonSelectOption>
            <IonSelectOption value="UC San Diego">UC San Diego</IonSelectOption>
            <IonSelectOption value="UCSF">UCSF</IonSelectOption>
            <IonSelectOption value="UC Santa Barbara">UC Santa Barbara</IonSelectOption>
            <IonSelectOption value="UC Santa Cruz">UC Santa Cruz</IonSelectOption> */}
          </IonSelect>
        </IonItem>

        <IonLabel id="school-email-label" className="login-label">School Email</IonLabel>
        <IonItem className='register-input'>
          <IonInput aria-labelledby="school-email-label" clearInput value={emailSignUp} type="email" placeholder="email@email.com" id="emailSignUp" onIonInput={(e: any) => setEmailSignUp(e.detail.value)} />
        </IonItem>
        {emailSignUp.length > 0 && schoolName.length <= 0 ?
          <p style={inputNoteError}>Select a University</p>
          :
          emailSignUp.lastIndexOf('@') > -1 && (emailSignUp.slice(emailSignUp.lastIndexOf('@') + 1)).toLowerCase() !== schoolEmailEnding ?
            <p style={inputNoteError}>Use your University's email</p>
            :
            <p style={inputNoteError}>{" "}</p>
        }

        <IonLabel id="username-label-reg" className="login-label">Username</IonLabel>
        <IonItem className='register-input'>
          <IonInput aria-labelledby="username-label-reg" maxlength={15} clearInput value={userNameSignUp} type="text" placeholder="userName1234" id="userNameSignUp" onIonInput={(e) => { setUserNameSignUp(e.detail.value!) }} />
        </IonItem>
        <p style={inputNote}> {userNameSignUp.length} / 15 </p>

        <IonLabel id="password-label-reg" className="login-label">Password</IonLabel>
        <IonItem className='register-input'>
          <IonInput aria-labelledby="password-label-reg" value={passwordSignUp} clearInput clearOnEdit={false} type={showPassword ? "text" : "password"} placeholder="••••••••" id="passwordSignUp" onIonInput={(e) => setPasswordSignUp(e.detail.value!)} />
          <IonButton slot="end" fill="clear" onClick={() => { setShowPassword(!showPassword) }}>
            <IonIcon color="medium" icon={showPassword ? eyeOutline : eyeOffOutline} />
          </IonButton>
        </IonItem>

        {passwordSignUp.length > 0 && passwordSignUp.length < 8 ?
          <p style={inputNoteError}> {passwordSignUp.length > 0 && passwordSignUp.length < 8 ? "Password must be at least 8 characters" : ""} </p>
          :
          <p style={inputNoteError}> {passwordSignUp.length > 0 && passwordSignUp.length < 8 ? "Password must be at least 8 characters" : ""} </p>
        }

        <div style={{ height: "1%" }} />

        <IonButton className="login-button" onClick={async () => { await register(); }} fill="clear" expand="block" id="signInButton" >Register</IonButton>

        <div style={{ height: "1%" }} />

        <IonLoading
          message="Please wait..."
          duration={0}
          isOpen={busy}
        ></IonLoading>

      </IonContent>
    </IonPage >
  );
};

export default Register;

// test android FCM token: dxpDwKJjTrCRuYmzcPzsQb:APA91bG6Jy-3YB4tSt9i069lXVf3RisORY9jrrqgf8EduSx_pvViVPZ9baAWbf7-9duBdzmbUCz_v4d0CdvZJMDocZ5gyFexg3Hn0rrEjr2jMvzXf9hjoKULnWixGbHaHH5McwZctqxd