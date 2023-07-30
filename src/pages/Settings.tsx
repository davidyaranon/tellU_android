// Ionic/Capacitor + React
import React from 'react';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonFab, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonNote,
  IonPage, IonRow, IonSearchbar, IonSpinner, IonText, IonTextarea, IonTitle, IonToggle, IonToolbar, useIonLoading, useIonRouter, useIonViewWillEnter,
} from '@ionic/react';
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from '@capacitor/keyboard';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Dialog } from '@capacitor/dialog';
import { Preferences } from '@capacitor/preferences';
import { App as CapacitorApp } from '@capacitor/app';

// Firebase/Google
import auth, { checkUsernameUniqueness, db, getCurrentUserData, getUserLikedPosts, logout, promiseTimeout, spotifySearch, updateUserInfo } from '../fbConfig';
import { useAuthState } from "react-firebase-hooks/auth";

// Other imports/components
import '../App.css';
import { useToast } from '@agney/ir-toast';
import { useAppContext } from '../my-context';
import { useHistory } from 'react-router';
// import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { SettingsHeader } from '../components/Settings/SettingsHeader';
import PostImages from '../components/Shared/PostImages';
import { PostType } from '../components/Shared/PostType';
import ProfilePhoto from '../components/Shared/ProfilePhoto';
import { PostMessage } from '../components/Home/PostMessage';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { checkmarkCircleOutline, chevronBackOutline, logoInstagram, logoSnapchat, logoTiktok, map, refreshOutline, warningSharp } from 'ionicons/icons';
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { timeout } from '../helpers/timeout';
import Spotify from 'react-spotify-embed';
import { navigateBack } from '../components/Shared/Navigation';

const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
}
const keyStyleOptionsLight: KeyboardStyleOptions = {
  style: KeyboardStyle.Light
}
const versionNum: string = '3.2.2';


const Settings: React.FC = () => {

  // hooks  
  const history = useHistory();
  const router = useIonRouter();
  const context = useAppContext();
  const Toast = useToast();
  const [present] = useIonLoading();
  const [schoolName, setSchoolName] = React.useState<string>('');
  const [loadedSlidesArr, setLoadedSlidesArr] = React.useState<boolean[]>([false, false])
  const [userLikedPosts, setUserLikedPosts] = React.useState<any[] | null>(null);
  const [userBio, setUserBio] = React.useState<string>("");
  const [userMajor, setUserMajor] = React.useState<string>("");
  const [userTiktok, setUserTiktok] = React.useState<string>("");
  const [userInstagram, setUserInstagram] = React.useState<string>("");
  const [userSnapchat, setUserSnapchat] = React.useState<string>("");
  const [editableUserBio, setEditableUserBio] = React.useState<string>("");
  const [editableUserMajor, setEditableUserMajor] = React.useState<string>("");
  const [editableUserTiktok, setEditableUserTiktok] = React.useState<string>("");
  const [editableUserInstagram, setEditableUserInstagram] = React.useState<string>("");
  const [editableUserSnapchat, setEditableUserSnapchat] = React.useState<string>("");
  const [showEditEmailModal, setShowEditEmailModal] = React.useState<boolean>(false);
  const [userDataHasLoaded, setUserDataHasLoaded] = React.useState<boolean>(false);
  const [showEditUsernameModal, setShowEditUsernameModal] = React.useState<boolean>(false);
  const [passwordReAuth, setPasswordReAuth] = React.useState("");
  const [email, setEmail] = React.useState<string>("");
  const [editableEmail, setEditableEmail] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const [editableUserName, setEditableUserName] = React.useState<string>("");
  const spotifyTextSearch = React.useRef<HTMLIonSearchbarElement>(null);
  const [spotifyModal, setSpotifyModal] = React.useState<boolean>(false);
  const [spotifyLoading, setSpotifyLoading] = React.useState<boolean>(false);
  const [spotifyResults, setSpotifyResults] = React.useState<any[]>([]);
  const [spotifyUri, setSpotifyUri] = React.useState<string>("");
  const [editableSpotifyUri, setEditableSpotifyUri] = React.useState<string>("");
  const [showAboutModal, setShowAboutModal] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [aboutEdit, setAboutEdit] = React.useState<boolean>(true);
  const [user, loading, error] = useAuthState(auth);
  const contentRef = React.useRef<HTMLIonContentElement>(null);
  const [credentialsModal, setCredentialsModal] = React.useState<boolean>(false);
  const [credentialsUserModal, setCredentialsUserModal] = React.useState<boolean>(false);
  const emojis = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;


  /**
   * @description handles the use of the hardware back button and determines which modal(s) to close.
   */
  const handleSetModalStates = React.useCallback((showSpotifyModal: boolean, showAboutModal: boolean) => {
    setSpotifyModal(showSpotifyModal);
    setShowAboutModal(showAboutModal);
    setShowEditEmailModal(false);
    setShowEditUsernameModal(false);
  }, []);

  React.useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        console.log("BACK BUTTON SETTINGS PAGE");
        if (spotifyModal === true) {
          handleSetModalStates(false, true);
        } else if (showAboutModal === true || showEditEmailModal === true || showEditUsernameModal === true) {
          handleSetModalStates(false, false);
        } else {
          CapacitorApp.exitApp();
        }
        Keyboard.hide().then(() => {
          setTimeout(() => {
            setShowAboutModal(false);
            setEditableUserBio(userBio);
            setEditableUserInstagram(userInstagram);
            setEditableUserMajor(userMajor);
            setEditableUserTiktok(userTiktok);
            setEditableUserSnapchat(userSnapchat);
            setEditableSpotifyUri(spotifyUri);
          }, 100);
        }).catch((err) => {
          setTimeout(() => {
            setShowAboutModal(false);
            setEditableUserBio(userBio);
            setEditableUserInstagram(userInstagram);
            setEditableUserMajor(userMajor);
            setEditableUserTiktok(userTiktok);
            setEditableUserSnapchat(userSnapchat);
            setEditableSpotifyUri(spotifyUri);
          }, 100);
        });
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [handleSetModalStates, spotifyModal, showAboutModal, showEditEmailModal, showEditUsernameModal, router]);


  const handleEditAbout = () => {
    if (user && user.uid) {
      if (!userDataHasLoaded) {
        const gotUserData = promiseTimeout(7500, getCurrentUserData());
        gotUserData.then((res: any) => {
          if (res) {
            setUserBio(res.bio);
            setUserMajor(res.major);
            setUserInstagram(res.instagram);
            setUserSnapchat(res.snapchat);
            setUserTiktok(res.tiktok);
            setSpotifyUri(res.spotify);
            setEditableUserBio(res.bio);
            setEditableUserMajor(res.major);
            setEditableUserInstagram(res.instagram);
            setEditableUserSnapchat(res.snapchat);
            setEditableUserTiktok(res.tiktok);
            setEditableSpotifyUri(res.spotify);
          } else {
            const toast = Toast.create({ message: 'Trouble loading data', duration: 2000, color: 'toast-error' });
            toast.present();
            setAboutEdit(false);
          }
          setUserDataHasLoaded(true);
        });
        gotUserData.catch((err) => {
          Toast.error(err);
        });
      }
      setShowAboutModal(true);
    } else {
      const toast = Toast.create({ message: 'Trouble handling request', duration: 2000, color: 'toast-error' });
      toast.present();
    }
  }

  const handleSpotifySearch = async () => {
    await timeout(100);
    if (spotifyTextSearch && spotifyTextSearch.current) {
      if (spotifyTextSearch.current.value) {
        const text: string = spotifyTextSearch.current.value;
        console.log(text);
        if (text.length <= 0) {
          const toast = Toast.create({ message: 'Enter a search query', duration: 2000, color: 'toast-error' });
          toast.present();
          return;
        }
        spotifyTextSearch.current.value = "";
        setSpotifyLoading(true);
        spotifySearch(text).then((res: any) => {
          setSpotifyResults(res);
          if (res && res.length == 0) {
            const toast = Toast.create({ message: 'No results', duration: 2000, color: 'toast-error' });
            toast.present();
          }
          console.log({ res });
          setSpotifyLoading(false);
        }).catch((err) => {
          console.log(err);
          const toast = Toast.create({ message: 'Unable to get results', duration: 2000, color: 'toast-error' });
          toast.present();
          setSpotifyLoading(false);
        });
      }
    }
  };

  const isEnterPressed = (key: string) => {
    if (key === "Enter") {
      Keyboard.hide();
      handleSpotifySearch();
    }
  };

  /**
   * @description Loads user's liked posts
   */
  const loadUserLikes = () => {
    if (schoolName && user) {
      const hasLoaded = promiseTimeout(5000, getUserLikedPosts(user.uid));
      hasLoaded.then((res) => {
        if (res) {
          setUserLikedPosts(res.userLikes);
          // setLastLikesKey(res.lastKey);
        }
      });
      hasLoaded.catch((err) => {
        Toast.error(err);
      });
    }
  };

  /**
   * @description Enables/disables blurring of sensitive content throughout app
   * 
   * @param {boolean} isChecked whether the sensitivity toggle is enabled or disabled (checked or unchecked)
   */
  const toggleSensitivity = async (isChecked: boolean) => {
    console.log("sensitivity", isChecked);
    context.setSensitivityToggled(isChecked);
    await Preferences.set({ key: 'sensitivityToggled', value: JSON.stringify(isChecked) });
  };

  /**
   * @description handles the checkbox state change and enables/disables dark mode in maps tiler
   * 
   * @param {boolean} isChecked whether the checkbox is checked or not
   */
  const handleChangeMapTile = async (isChecked: boolean): Promise<void> => {
    if (isChecked) {
      context.setMapTilerId('streets-v2-dark');
      await Preferences.set({ key: "mapTilerId", value: "streets-v2-dark" });
    } else {
      context.setMapTilerId('streets');
      await Preferences.set({ key: "mapTilerId", value: "streets" });
    }
  };

  /**
   * @description Logs authenticated user out of application
   * Redirects to Register page upon success
   */
  const handleLogout = async () => {
    const value = await Dialog.confirm({
      title: 'Logout',
      message: `Are you sure you want to logout of your account?`,
      okButtonTitle: 'Logout'
    });
    if (!value.value) { return; }
    present({
      duration: 2500,
      message: "Logging out..."
    });
    // if (user && (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'md')) {
    //   await GoogleAuth.signOut();
    // }
    context.setShowTabs(false);
    await Preferences.clear();
    context.setSchoolName('');
    await logout();
    const toast = Toast.create({ message: 'Logged out', duration: 2000, color: 'toast-success' });
    toast.present();
    toast.dismiss();
  }

  /**
   * @description updates user info in Firestore database
   * 
   */
  const handleUpdateAboutUser = async () => {
    setUserDataHasLoaded(false);
    if (String(editableUserBio).trim() == String(userBio).trim()
      && String(editableUserInstagram).trim() == String(userInstagram).trim()
      && String(editableUserSnapchat).trim() == String(userSnapchat).trim()
      && String(editableUserMajor).trim() == String(userMajor).trim()
      && String(editableUserTiktok).trim() == String(userTiktok).trim()
      && String(editableSpotifyUri).trim() == String(spotifyUri).trim()) {
      const toast = Toast.create({ message: 'No changes made', duration: 2000, color: 'toast-error' });
      toast.present();
      setUserDataHasLoaded(true);
      return;
    }
    let userDataUpdated = promiseTimeout(10000, updateUserInfo(editableUserBio, editableUserInstagram, editableUserMajor, editableUserSnapchat, editableUserTiktok, editableSpotifyUri));
    userDataUpdated.then((res) => {
      if (res) {
        setUserBio(editableUserBio);
        setUserSnapchat(editableUserSnapchat);
        setUserInstagram(editableUserInstagram);
        setUserTiktok(editableUserTiktok);
        setUserMajor(editableUserMajor);
        setSpotifyUri(editableSpotifyUri);
        Keyboard.hide().then(() => {
          setTimeout(() => setShowAboutModal(false), 100);
        }).catch((err) => {
          setTimeout(() => setShowAboutModal(false), 100);
        })
        const toast = Toast.create({ message: 'Updated!', duration: 2000, color: 'toast-success' });
        toast.present();
        toast.dismiss();
      } else {
        const toast = Toast.create({ message: 'Something went wrong, try again', duration: 2000, color: 'toast-error' });
        toast.present();
      }
      setUserDataHasLoaded(true);
    });
    userDataUpdated.catch((err) => {
      Toast.error(err);
      setUserDataHasLoaded(true);
    });
    setUserDataHasLoaded(true);
  };

  async function handleEmailChange() {
    setBusy(true);
    if (user && user.email) {
      if (user.email == editableEmail) {
        const toast = Toast.create({ message: 'No changes made', duration: 2000, color: 'toast-error' });
        toast.present();
        setBusy(false);
        Keyboard.hide().then(() => {
          setTimeout(() => setCredentialsModal(false), 100);
        }).catch((err) => {
          setTimeout(() => setCredentialsModal(false), 100);
        });
      } else {
        const credentials = EmailAuthProvider.credential(
          user.email!,
          passwordReAuth
        );
        reauthenticateWithCredential(user, credentials)
          .then(() => {
            updateEmail(user, editableEmail)
              .then(() => {
                if (user && user.uid) {
                  const userDataRef = doc(db, "userData", user.uid);
                  updateDoc(userDataRef, {
                    userEmail: editableEmail,
                  })
                    .then(() => {
                      const toast = Toast.create({ message: 'Updated email!', duration: 2000, color: 'toast-success' });
                      toast.present();
                      toast.dismiss();
                      setEmail(editableEmail);
                      Keyboard.hide().then(() => {
                        setTimeout(() => setCredentialsModal(false), 100);
                      }).catch((err) => {
                        setTimeout(() => setCredentialsModal(false), 100);
                      });
                      setBusy(false);
                    })
                    .catch((err) => {
                      Toast.error(err.message.toString());
                      setEditableEmail(email);
                      setBusy(false);
                    });
                } else {
                  const toast = Toast.create({ message: 'Email updated but view not updated', duration: 2000, color: 'toast-error' });
                  toast.present();
                  setEditableEmail(email);
                  setBusy(false);
                }
              })
              .catch((err) => {
                Toast.error(err.message.toString());
                setEditableEmail(email);
                setBusy(false);
              });
          })
          .catch((err) => {
            Toast.error(err.message.toString());
            setEditableEmail(email);
            setBusy(false);
          });
      }
    } else {
      const toast = Toast.create({ message: 'Unable to update email', duration: 2000, color: 'toast-error' });
      toast.present();
      setEditableEmail(email);
      setBusy(false);
    }
  }

  async function handleUsernameChange() {
    Keyboard.hide().then(() => {
      setTimeout(() => setCredentialsUserModal(false), 100);
    }).catch((err) => {
      setTimeout(() => setCredentialsUserModal(false), 100);
    });
    setBusy(true);
    const isUnique = await checkUsernameUniqueness(editableUserName.trim());
    if (!isUnique) {
      const toast = Toast.create({ message: 'Username has been taken', duration: 2000, color: 'toast-error' });
      toast.present();
      setEditableUserName(userName);
      setBusy(false);
      setPasswordReAuth("");
    } else {
      if (user && user.displayName) {
        const credentials = EmailAuthProvider.credential(
          user.email!,
          passwordReAuth
        );
        reauthenticateWithCredential(user, credentials)
          .then(() => {
            const usernameChange = promiseTimeout(
              20000,
              updateProfile(user, {
                displayName: editableUserName,
              })
            );
            usernameChange.then(() => {
              if (user && user.uid) {
                const userDataRef = doc(db, "userData", user.uid);
                const usernameDocChange = promiseTimeout(
                  20000,
                  updateDoc(userDataRef, {
                    userName: editableUserName,
                  })
                );
                usernameDocChange.then(() => {
                  const toast = Toast.create({ message: 'Updated username!', duration: 2000, color: 'toast-success' });
                  toast.present();
                  toast.dismiss();
                  setUserName(editableUserName);
                  Keyboard.hide().then(() => {
                    setTimeout(() => setCredentialsUserModal(false), 100);
                  }).catch((err) => {
                    setTimeout(() => setCredentialsUserModal(false), 100);
                  });
                  setBusy(false);
                });
                usernameDocChange.catch((err: any) => {
                  Toast.error(err);
                  setEditableUserName(userName);
                  setBusy(false);
                });
              } else {
                const toast = Toast.create({ message: 'Unable to update username', duration: 2000, color: 'toast-error' });
                toast.present();
              }
            });
            usernameChange.catch((err: any) => {
              Toast.error(err);
              setEditableUserName(userName);
              setBusy(false);
            });
          })
          .catch((err) => {
            Toast.error(err.message.toString());
            setBusy(false);
            setEditableUserName(userName);
          });
      } else {
        const toast = Toast.create({ message: 'User not defined!', duration: 2000, color: 'toast-error' });
        toast.present();
        setBusy(false);
        setEditableUserName(userName);
      }
    }
  }

  const handleUserCheckmark = () => {
    if (emojis.test(editableUserName)) {
      const toast = Toast.create({ message: 'Username cannot contain emojis', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (editableUserName.trim().length <= 0) {
      const toast = Toast.create({ message: 'Username cannot be blank', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (editableUserName.trim().length > 15) {
      const toast = Toast.create({ message: 'Username cannot be more than 15 characters', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (editableUserName.includes(" ")) {
      const toast = Toast.create({ message: 'Username cannot contain spaces', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (editableUserName.trim() != userName.trim()) {
      setCredentialsUserModal(true);
    } else {
      const toast = Toast.create({ message: 'No changes made', duration: 2000, color: 'toast-error' });
      toast.present();
    }
  };

  const handleCheckmark = () => {
    if (emojis.test(editableEmail)) {
      const toast = Toast.create({ message: 'Email cannot contain emojis', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (editableEmail.trim().length <= 0) {
      const toast = Toast.create({ message: 'Email cannot be blank', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (editableEmail.trim() != email.trim()) {
      setCredentialsModal(true);
    } else {
      const toast = Toast.create({ message: 'No changes made', duration: 2000, color: 'toast-error' });
      toast.present();
    }
  };

  React.useEffect(() => {
    context.setDarkMode(true);
    document.body.classList.toggle("dark");
    context.setDarkMode(true);
    Keyboard.setStyle(keyStyleOptionsDark);
    StatusBar.setStyle({ style: Style.Dark });
  }, [context]);

  React.useEffect(() => {
    context.setShowTabs(true);
  }, [context]);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("logged out");
        context.setShowTabs(false);
        history.replace("/landing-page");
      }
    });
    return unsub;
  }, []);

  /**
   * Loads school from local storage (Preferences API)
   */
  const setSchool = React.useCallback(async () => {
    const school = await Preferences.get({ key: 'school' });
    if (school && school.value) {
      setSchoolName(school.value);
    } else {
      const toast = Toast.create({ message: 'Something went wrong when retrieving school', duration: 2000, color: 'toast-error' });
      toast.present();
    }
  }, []);

  React.useEffect(() => {
    setSchool();
  }, []);

  React.useEffect(() => {
    console.log("notificationsToken: ", localStorage.getItem("notificationsToken"));
    setBusy(true);
    if (!user && !loading) {
      history.replace("/landing-page");
    } else {
      if (!loading && user) {
        setEmail(user.email!);
        setEditableEmail(user.email!);
        setUserName(user.displayName!);
        setEditableUserName(user.displayName!);
        setBusy(false);
      }
      return () => { };
    }
  }, [user]);

  useIonViewWillEnter(() => {
    StatusBar.setStyle({ style: Style.Dark })
  });


  /**
   * Settings page
   */
  return (
    <IonPage className="ion-page-ios-notch">
      <IonContent ref={contentRef} scrollY={false}>
        <SettingsHeader schoolName={schoolName} logout={handleLogout} user={user} editableUsername={editableUserName} />

        {/* <Swiper
          id="settings-swiper"
          pagination={{ dynamicBullets: true }}
          modules={[Pagination]}
          slidesPerView={1}
          onSlideChange={(e) => {
            switch (e.realIndex) {
              case 0:
                break;
              case 1:
                if (!loadedSlidesArr[1]) {
                  let tempArr: boolean[] = loadedSlidesArr;
                  tempArr[1] = true;
                  setLoadedSlidesArr(tempArr);
                  loadUserLikes();
                }
                break;
              default:
                break;
            }
          }}
        >
        <SwiperSlide> */}
        <IonHeader class="ion-no-border" style={{ textAlign: "center", fontSize: "1em", color: "#898989", transform: "translateY(15%)" }}>
          Settings
        </IonHeader>

        <IonList mode="md" inset={true}>
          <IonItem key="singleton_item_3" mode="md">
            <IonRow>
              <IonLabel mode="md">
                <IonText color="medium">
                  <p> Email </p>
                </IonText>
              </IonLabel>
            </IonRow>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <IonRow>
              {editableEmail.length > 20 ?
                <p style={{ fontSize: "0.85em" }}>{editableEmail.substring(0, 20) + "..."}</p>
                :
                <p style={{ fontSize: "0.85em" }}>{editableEmail}</p>

              }
            </IonRow>
            <IonButton color="medium" slot="end" onClick={() => setShowEditEmailModal(true)}>
              Edit
            </IonButton>
          </IonItem>
          <IonItem key="singleton_item_4" mode="md">
            <IonRow>
              <IonLabel mode="md">
                <IonText color="medium">
                  <p> Username </p>
                </IonText>
              </IonLabel>
            </IonRow>
            &nbsp;&nbsp;
            <IonRow>
              {editableUserName.length > 20 ?
                <p style={{ fontSize: "0.85em" }}>{editableUserName.substring(0, 20) + "..."}</p>
                :
                <p style={{ fontSize: "0.85em" }}>{editableUserName}</p>

              }
            </IonRow>
            <IonButton color="medium" slot="end" onClick={() => setShowEditUsernameModal(true)}>
              Edit
            </IonButton>
          </IonItem>
          <IonItem mode="md">
            <IonRow>
              <IonLabel mode="md">
                <IonText color="medium">
                  <p> About </p>
                </IonText>
              </IonLabel>
            </IonRow>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <IonRow>
              <p style={{ fontSize: "0.85em", }}>...</p>
            </IonRow>
            <IonButton color="medium" slot="end" onClick={handleEditAbout}>
              Edit
            </IonButton>
          </IonItem>
        </IonList>
        <IonList mode="md" inset={true}>
          <IonItem mode="md">
            <p style={{ fontSize: "0.85em" }}> Hide Sensitive Content</p>&nbsp;&nbsp;
            <IonIcon color="medium" icon={warningSharp} />
            <IonToggle
              id="themeToggle"
              slot="end"
              checked={context.sensitivityToggled}
              enableOnOffLabels={true}
              color={"primary"}
              onIonChange={(e) => { toggleSensitivity(e.detail.checked); Haptics.impact({ style: ImpactStyle.Light }); }}
            />
          </IonItem>
          <IonItem mode="md">
            <p style={{ fontSize: "0.85em" }}>Dark Maps</p>&nbsp;&nbsp;
            <IonIcon color="medium" icon={map} />
            <IonToggle
              id="themeToggle"
              slot="end"
              checked={context.mapTilerId === "streets-v2-dark"}
              enableOnOffLabels={true}
              color={"primary"}
              onIonChange={(e) => { handleChangeMapTile(e.detail.checked); Haptics.impact({ style: ImpactStyle.Light }); }}
            />
          </IonItem>
        </IonList>
        {/* </SwiperSlide> */}
        {/* <SwiperSlide>
            <IonFab style={{ transform: "translateY(-10%)" }} horizontal="end">
              <IonButton mode="md" fill="clear" onClick={loadUserLikes} color={"primary"}>
                <IonIcon icon={refreshOutline} />
              </IonButton>
            </IonFab>
            <div style={{ height: "2vh" }} />
            <IonHeader
              class="ion-no-border"
              style={{
                textAlign: "center",
                fontSize: "1em",
                color: "#898989",
                transform: "translateY(15%)"
              }}
            >
              Liked Posts
            </IonHeader>
            <IonCard className="user-card">
              <IonContent>
                <div>
                  {userLikedPosts ? (
                    <>
                      {userLikedPosts.map((post, index) => {
                        return (
                          <IonList key={post.key + index.toString()} mode="md" lines="none" inset>
                            <IonItem lines="none" mode="md" onClick={() => { history.push("/post/" + schoolName + "/" + post.userName + "/" + post.key); }}>
                              <IonLabel>
                                <IonText color="medium">
                                  <IonAvatar class="posts-avatar" onClick={(e) => { e.stopPropagation(); history.push("/about/" + schoolName + "/" + post.uid); }} >
                                    <ProfilePhoto uid={post.uid} />
                                  </IonAvatar>
                                  <p> {post.userName} </p>
                                </IonText>
                                <PostType type={post.postType} marker={post.marker} location={post.location} timestamp={post.timestamp} />
                                <PostMessage message={post.message} classNumber={post.classNumber} classname={post.className} reports={post.reports || 0} />
                                <PostImages userName={post.userName} imgSrc={post.imgSrc || []} reports={post.reports || 0} />
                              </IonLabel>
                            </IonItem>
                          </IonList>
                        )
                      })}
                    </>
                  ) :
                    <IonSpinner color={"primary"} className='ion-spinner'></IonSpinner>
                  }
                  {userLikedPosts && userLikedPosts.length <= 0 ? (
                    <p style={{ fontWeight: "bold", textAlign: "center" }}>No likes yet!</p>
                  ) : (null)}
                </div>
                <br /> <br /><br /> <br /><br /> <br />
              </IonContent>
            </IonCard>
          </SwiperSlide>
        </Swiper> */}

        <IonLoading
          message="Please wait..."
          duration={5000}
          isOpen={busy}
        ></IonLoading>

        <IonFab horizontal='end' vertical='bottom'>
          <IonNote>v.{versionNum}</IonNote>
        </IonFab>

      </IonContent>

      <IonModal
        handle={false} breakpoints={[0, 1]} initialBreakpoint={1}
        isOpen={spotifyModal}
        onDidDismiss={() => {
          Keyboard.hide();
        }}
      >
        <IonContent >
          <IonToolbar mode="md">
            <IonButtons >
              <IonButton
                color={"primary"}
                mode="md"
                onClick={() => {
                  Keyboard.hide().then(() => {
                    setSpotifyModal(false);
                    if (spotifyTextSearch && spotifyTextSearch.current) {
                      spotifyTextSearch.current.value = "";
                    }
                    setSpotifyResults([]);
                  }).catch((err) => {
                    setSpotifyModal(false);
                    if (spotifyTextSearch && spotifyTextSearch.current) {
                      spotifyTextSearch.current.value = "";
                    }
                    setSpotifyResults([]);
                  });
                }}
              >
                <IonIcon icon={chevronBackOutline} /> Back
              </IonButton>
            </IonButtons>
            <IonCardTitle slot="end" style={{ margin: "15px" }}>Spotify Search</IonCardTitle>
          </IonToolbar>
          <br />
          <IonToolbar mode="md" >
            <IonSearchbar color={context.darkMode ? "" : "light"} debounce={0} enterkeyhint="search" onKeyDown={e => isEnterPressed(e.key)} ref={spotifyTextSearch} animated={true}></IonSearchbar>
          </IonToolbar>
          {spotifyLoading &&
            <IonSpinner color={"primary"} className='ion-spinner' />
          }
          {spotifyResults && spotifyResults.length > 0 &&
            <>
              <IonList style={{ "--background": "#0D1117" }} mode="md">
                {spotifyResults.map((track, index) => {
                  return (
                    <FadeIn key={track.id + index.toString()} delay={1000} transitionDuration={750}>
                      <IonItem className='spotify-emb' mode="md" lines="none">
                        <Spotify allow="encrypted-media" style={{ width: "80vw", backgroundColor: "#2f2f2f", borderRadius: "15px", maxHeight: "80px", opacity: 100, colorScheme: "normal" }} wide link={"https://open.spotify.com/track/" + track.uri.toString().substring(14)} />
                        <IonButton style={{ alignItems: "center", textAlign: "center", width: "25vw" }} key={track.id + index.toString()} color="medium" mode="md" fill="clear" onClick={() => { setEditableSpotifyUri(track.uri); setSpotifyModal(false); if (spotifyTextSearch && spotifyTextSearch.current) { spotifyTextSearch.current.value = ""; } setSpotifyResults([]); }}>
                          <IonIcon size='large' icon={checkmarkCircleOutline} />
                        </IonButton>
                      </IonItem>
                      <div style={{ height: "20px", backgroundColor: "#0D1117" }}> </div>
                    </FadeIn>
                  )
                })}
              </IonList>
            </>
          }
        </IonContent>
      </IonModal>

      <IonModal backdropDismiss={false} mode="md" isOpen={showAboutModal} handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
        <IonContent>
          <div slot="fixed" style={{ width: "100%" }}>
            <IonToolbar mode="md" >
              <IonButtons >
                <IonButton
                  color={"primary"}
                  mode="md"
                  onClick={() => {
                    Keyboard.hide().then(() => {
                      setTimeout(() => {
                        setShowAboutModal(false);
                        setEditableUserBio(userBio);
                        setEditableUserInstagram(userInstagram);
                        setEditableUserMajor(userMajor);
                        setEditableUserTiktok(userTiktok);
                        setEditableUserSnapchat(userSnapchat);
                        setEditableSpotifyUri(spotifyUri);
                      }, 100);
                    }).catch((err) => {
                      setTimeout(() => {
                        setShowAboutModal(false);
                        setEditableUserBio(userBio);
                        setEditableUserInstagram(userInstagram);
                        setEditableUserMajor(userMajor);
                        setEditableUserTiktok(userTiktok);
                        setEditableUserSnapchat(userSnapchat);
                        setEditableSpotifyUri(spotifyUri);
                      }, 100);
                    })

                  }}
                >
                  <IonIcon icon={chevronBackOutline} />
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  color={"primary"}
                  disabled={!aboutEdit}
                  slot="end"
                  mode="md"
                  onClick={() => { handleUpdateAboutUser(); }}
                >Save</IonButton>
              </IonButtons>
            </IonToolbar>
          </div>
          <IonLoading isOpen={!userDataHasLoaded} spinner="dots" />
          <br /> <br /> < br />
          <div style={{ textAlign: "center" }}>
            <IonNote style={{ textAlign: "center" }}>Click on your Username in the <br />Settings menu to see your user profile!</IonNote>
          </div>
          <IonCard mode="md">
            <IonCardContent>
              <IonLabel>About</IonLabel>
              <IonTextarea
                style={{ fontWeight: "bold", color: 'var(--ion-color-light)' }}
                rows={4}
                mode="md"
                id="bio"
                color={"primary"}
                maxlength={150}
                value={editableUserBio}
                onIonInput={(e: any) => {
                  setEditableUserBio(e.detail.value);
                }}
              />
            </IonCardContent>
          </IonCard>
          <IonCard mode="md">
            <IonCardContent>
              <IonLabel>Major</IonLabel>
              <IonInput
                style={{ fontWeight: "bold", color: 'var(--ion-color-light)' }}
                mode="md"
                id="major"
                color={"primary"}
                maxlength={25}
                value={editableUserMajor}
                onIonInput={(e) => {
                  setEditableUserMajor(e.detail.value!);
                }}
              />
            </IonCardContent>
          </IonCard>
          <IonCard mode="md">
            <IonCardContent>
              <IonLabel>Snapchat <IonIcon icon={logoSnapchat} /> </IonLabel>
              <IonInput
                style={{ fontWeight: "bold", color: 'var(--ion-color-light)' }}
                mode="md"
                id="bio"
                color={"primary"}
                maxlength={25}
                value={editableUserSnapchat}
                onIonInput={(e: any) => {
                  setEditableUserSnapchat(e.detail.value);
                }}
              />
            </IonCardContent>
          </IonCard>
          <IonCard mode="md">
            <IonCardContent>
              <IonLabel>Instagram <IonIcon icon={logoInstagram} /> </IonLabel>
              <IonInput
                style={{ fontWeight: "bold", color: 'var(--ion-color-light)' }}
                mode="md"
                id="bio"
                color={"primary"}
                maxlength={25}
                value={editableUserInstagram}
                onIonInput={(e: any) => {
                  setEditableUserInstagram(e.detail.value);
                }}
              />
            </IonCardContent>
          </IonCard>
          <IonCard mode="md">
            <IonCardContent>
              <IonLabel>TikTok <IonIcon icon={logoTiktok} /> </IonLabel>
              <IonInput
                style={{ fontWeight: "bold", color: 'var(--ion-color-light)' }}
                mode="md"
                id="bio"
                color={"primary"}
                maxlength={25}
                value={editableUserTiktok}
                onIonInput={(e: any) => {
                  setEditableUserTiktok(e.detail.value);
                }}
              />
            </IonCardContent>
          </IonCard>
          <IonCard mode="md">
            <IonCardContent>
              <IonLabel>Spotify Song Spotlight</IonLabel>
              <br /><br />
              {editableSpotifyUri && editableSpotifyUri.length > 0 &&
                <Spotify allow="encrypted-media" style={{ width: "82.5vw", backgroundColor: "#2f2f2f", borderRadius: "15px", maxHeight: "80px", opacity: 100, colorScheme: "normal" }} wide link={"https://open.spotify.com/track/" + editableSpotifyUri.substring(14)} />
              }
              {editableSpotifyUri && editableSpotifyUri.length > 0 ?
                <IonRow>
                  <IonCol>
                    <IonButton
                      color="toast-error"
                      mode="md"
                      shape="round"
                      fill="clear"
                      expand="block"
                      onClick={() => { setEditableSpotifyUri(""); }}
                    >
                      Remove
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      color={"primary"}
                      mode="md"
                      shape="round"
                      fill="clear"
                      expand="block" onClick={() => {
                        setSpotifyModal(true);
                      }}>
                      Change
                    </IonButton>
                  </IonCol>
                </IonRow>
                :
                <IonRow>
                  <IonCol>
                    <IonButton
                      color="transparent"
                      mode="md"
                      shape="round"
                      fill="clear"
                      expand="block" onClick={() => {
                        setSpotifyModal(true);
                      }}>
                      Add
                    </IonButton>
                  </IonCol>
                </IonRow>
              }

            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>

      <IonModal backdropDismiss={false} isOpen={showEditEmailModal} mode="md" handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
        <IonContent>
          <div slot="fixed" style={{ width: "100%" }}>
            <IonToolbar mode="md" >
              <IonButtons >
                <IonButton
                  color={"primary"}
                  mode="md"
                  onClick={() => {
                    Keyboard.hide().then(() => {
                      setTimeout(() => setShowEditEmailModal(false), 100);
                    }).catch((err) => {
                      setTimeout(() => setShowEditEmailModal(false), 100);
                    });
                    if (user && user.email) { setEditableEmail(user.email); }
                  }}
                >
                  <IonIcon icon={chevronBackOutline} />
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton mode="md" color={"primary"} fill="clear" onClick={handleCheckmark} disabled={!aboutEdit}>Save</IonButton>
              </IonButtons>
            </IonToolbar>
          </div>
          <br /> <br /> <br />

          <IonItem mode="md">
            <IonInput
              mode="md"
              style={{ width: "75vw" }}
              readonly={false}
              value={editableEmail}
              onIonInput={(e) => {
                if (typeof e.detail.value === "string")
                  setEditableEmail(e.detail.value || "");
              }}
            ></IonInput>
          </IonItem>
        </IonContent>
      </IonModal>

      <IonModal backdropDismiss={false} isOpen={showEditUsernameModal} handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
        <IonContent>
          <div slot="fixed" style={{ width: "100%" }}>
            <IonToolbar mode="md" >
              <IonButtons >
                <IonButton
                  color={"primary"}
                  mode="md"
                  onClick={() => {
                    Keyboard.hide().then(() => {
                      setTimeout(() => setShowEditUsernameModal(false), 100);
                    }).catch((err) => {
                      setTimeout(() => setShowEditUsernameModal(false), 100);
                    });
                    if (user && user.displayName) { setEditableUserName(user.displayName); }
                  }}
                >
                  <IonIcon icon={chevronBackOutline} />
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton mode="md" color={"primary"} fill="clear" disabled={!aboutEdit} onClick={handleUserCheckmark}>Save</IonButton>
              </IonButtons>
            </IonToolbar>
          </div>
          <br /><br /><br />
          <IonItem mode="md">
            <IonInput
              mode="md"
              style={{ width: "75vw" }}
              readonly={false}
              value={editableUserName}
              onIonInput={(e) => {
                if (typeof e.detail.value === "string")
                  setEditableUserName(e.detail.value || "");
              }}
            ></IonInput>
          </IonItem>
        </IonContent>
      </IonModal>

      <IonModal backdropDismiss={false} isOpen={credentialsModal} handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
        <IonContent>
          <div className="ion-modal">
            <IonHeader mode="md" className='ion-no-border'>
              <IonTitle color="light" class="ion-title">
                {" "}
                <div>Email Change</div>{" "}
              </IonTitle>
            </IonHeader>
            <div>
              <br></br>
            </div>
            <IonList inset={true} mode="md" className="sign-in-sign-up-list">
              <IonItem key="singleton_item" mode="md" className="ion-item-style">
                <IonInput
                  color="transparent"
                  mode="md"
                  clearOnEdit={false}
                  value={passwordReAuth}
                  type="password"
                  placeholder="Enter your password again..."
                  id="passwordSignIn"
                  onIonInput={(e: any) => setPasswordReAuth(e.detail.value)}
                ></IonInput>
              </IonItem>
              <br />
              <IonButton
                color="toast-error"
                mode="md"
                onClick={() => {
                  Keyboard.hide().then(() => {
                    setTimeout(() => setCredentialsModal(false), 100);
                  }).catch((err) => {
                    setTimeout(() => setCredentialsModal(false), 100);
                  });
                  setEditableEmail(email);
                }}
                fill="clear"
                id="cancelButton"
              >
                Cancel
              </IonButton>
              <IonButton
                color={"primary"}
                mode="md"
                onClick={handleEmailChange}
                fill="clear"
                id="signInButton"
              >
                Authenticate
              </IonButton>
              <br />
              <br />
            </IonList>
          </div>
        </IonContent>
      </IonModal>

      <IonModal backdropDismiss={false} isOpen={credentialsUserModal} handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
        <IonContent>
          <div className="ion-modal">
            <IonHeader mode="md" className='ion-no-border'>
              <IonTitle color="light" className="ion-title">
                {" "}
                <div>Username Change</div>{" "}
              </IonTitle>
            </IonHeader>
            <div>
              <br></br>
            </div>
            <IonList inset={true} mode="md" className="sign-in-sign-up-list">
              <IonItem key="singleton_item_2" mode="md" className="ion-item-style">
                <IonInput
                  color="transparent"
                  mode="md"
                  clearOnEdit={false}
                  value={passwordReAuth}
                  type="password"
                  placeholder="Enter your password again..."
                  id="passwordSignIn"
                  onIonInput={(e: any) => setPasswordReAuth(e.detail.value)}
                ></IonInput>
              </IonItem>
              <br />
              <IonButton
                color="toast-error"
                mode="md"
                onClick={() => {
                  Keyboard.hide().then(() => {
                    setTimeout(() => setCredentialsUserModal(false), 100);
                  }).catch((err) => {
                    setTimeout(() => setCredentialsUserModal(false), 100);
                  });
                  setEditableUserName(userName);
                  setPasswordReAuth("");
                }}
                fill="clear"
                id="cancelButton"
              >
                Cancel
              </IonButton>
              <IonButton
                color={"primary"}
                mode="md"
                fill="clear"
                onClick={handleUsernameChange}
                id="signInButton"
              >
                Authenticate
              </IonButton>
              <br />
              <br />
            </IonList>
          </div>
        </IonContent>
      </IonModal>

    </IonPage>


  );

};

export default Settings;
