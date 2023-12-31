/* Ionic/React + Capacitor */
import {
  IonButton, IonButtons, IonCheckbox, IonIcon,
  IonItem, IonLabel, IonList, IonModal, IonNote, IonRadio, IonRadioGroup, IonTitle, IonToolbar, useIonLoading
} from "@ionic/react";
import { useState } from "react";
import { Geolocation, GeolocationOptions, Geoposition } from "@awesome-cordova-plugins/geolocation";

/* Firebase/Google */
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addMessage, storage } from "../../fbConfig";

/* Other Components */
import { v4 as uuidv4 } from "uuid";
import Map from "@mui/icons-material/Map";
import { useToast } from "@agney/ir-toast";
import { useAppContext } from "../../my-context";
import { davisPOIs, humboldtPOIs } from "../../helpers/maps-config";
import { chevronBackOutline } from "ionicons/icons";

/* options for getting user's location using {@awesome-cordova-plugins/geolocation} */
const locationOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000
};

function area(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
  return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
}

export const LocationPinModal = (props: any) => {

  /* props */
  const isOpen = props.isOpen;
  const user = props.user;
  const blob = props.blob;
  const photo = props.photos;
  const setPhoto = props.setPhoto;
  const setBlob = props.setBlob;
  const inputRef = props.inputRef;
  const schoolName = props.schoolName;
  const setShowModal = props.setShowModal;
  const setGifModal = props.setGifModal;
  const setPostClassName = props.setPostClassName;
  const setPostClassNumber = props.setPostClassNumber;
  const setPrevPostUploading = props.setPrevPostUploading;
  const setShowProgressBar = props.setShowProgressBar;
  const postClassName = props.postClassName;
  const postClassNumber = props.postClassNumber;
  const setLocationPinModal = props.setLocationPinModal;

  /* hooks */
  const context = useAppContext();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  /* state variables */
  const [locationChecked, setLocationChecked] = useState<boolean>(false);
  const [position, setPosition] = useState<Geoposition | null>();
  const [POI, setPOI] = useState<string>("");
  const [checkboxSelection, setCheckboxSelection] = useState<string>("general");

  /**
   * @description Adds a message as a doc in Firestore
   * Includes message data like message, photos, uniqueId (docId), position, 
   * schoolName, notificationsToken, checkboxSelection (postType)
   */
  const messageAdd = async () => {
    console.log(checkboxSelection)
    const messageRefValue = inputRef.current;
    if (!messageRefValue) {
      const toast = Toast.create({ message: 'Input a message!', duration: 2000, color: 'toast-error' });
      toast.present();
      return;
    }
    const message = messageRefValue.value || "";
    if (message.trim().length == 0 && (!blob || blob.length == 0) && (!photo || photo.length == 0)) {
      const toast = Toast.create({ message: 'Input a message!', duration: 2000, color: 'toast-error' });
      toast.present();
    } else if (checkboxSelection === "") {
      const toast = Toast.create({ message: 'Select a post type', duration: 2000, color: 'toast-error' });
      toast.present();
    } else {
      setPrevPostUploading(true);
      setShowProgressBar(true);
      let uniqueId = uuidv4();
      let docId = uuidv4();
      if (blob && photo) {
        setPhoto([]);
        if (user) {
          const promises = [];
          const currentUserUid = user.uid;
          for (var i = 0; i < blob.length; i++) {
            const file = blob[i];
            let storageRef = ref(storage, "images/" + currentUserUid.toString() + uniqueId + i.toString());
            promises.push(uploadBytes(storageRef, file).then(uploadResult => { return getDownloadURL(uploadResult.ref) }))
          }
          const photos = await Promise.all(promises);
          const notificationsToken = localStorage.getItem("notificationsToken") || "";
          console.log(notificationsToken);
          const res = await addMessage(
            message,
            photos,
            uniqueId.toString(),
            position,
            POI,
            schoolName,
            notificationsToken,
            checkboxSelection,
            postClassName,
            postClassNumber,
            docId,
          );
          setBlob([]);
          if (!res) {
            const toast = Toast.create({ message: 'Unable to process message, check internet connection', duration: 2000, color: 'toast-error' });
            toast.present();
            setShowProgressBar(false);
          } else {
            const toast = Toast.create({ message: 'Uploaded!', duration: 2000, color: 'toast-success' });
            toast.present();
            toast.dismiss();
            setLocationChecked(false);
            if (inputRef && inputRef.current) { inputRef.current.value = ""; }
            setPostClassName("");
            setPostClassNumber("");
            setPrevPostUploading(false);
            setShowProgressBar(false);
          }
        }
      } else {
        const notificationsToken = localStorage.getItem("notificationsToken") || "";
        const res = await addMessage(
          message,
          blob,
          uniqueId.toString(),
          position,
          POI,
          schoolName,
          notificationsToken,
          checkboxSelection,
          postClassName,
          postClassNumber,
          docId,
        );
        if (!res) {
          const toast = Toast.create({ message: 'Unable to process message, check your internet connection', duration: 2000, color: 'toast-error' });
          toast.present();
          setShowProgressBar(false);
          setPrevPostUploading(false);
        } else {
          const toast = Toast.create({ message: 'Uploaded', duration: 2000, color: 'toast-success' });
          toast.present();
          toast.dismiss();
          setLocationChecked(false);
          if (inputRef && inputRef.current) { inputRef.current.value = ""; }
          setPostClassName("");
          setPostClassNumber("");
          setShowProgressBar(false);
          setPrevPostUploading(false);
        }
      }
    }
    console.log("message added");
  };

  /**
   * @description Handle the post button
   */
  const handleSendMessage = async () => {
    setLocationPinModal(false);
    setShowModal(false);
    setGifModal(false);
    // setGifs(null);
    messageAdd();
  };

  /**
   * @description sees if the user is currently in a POI based on their location
   * 
   * @param {number} lat the latitude of the user's current position
   * @param {number} long the longitude of the user's current position
   */
  const checkPOI = (lat: number, long: number) => {
    let POIs: Record<string, number[]> = {};
    if (context.schoolName === "Cal Poly Humboldt") {
      POIs = humboldtPOIs;
    } else if (context.schoolName === "UC Davis") {
      POIs = davisPOIs;
    } else if (context.schoolName === "UC Berkeley") {
      // POIs = berkeleyPOIs;
    }
    for (const [key, value] of Object.entries(POIs)) {
      const arr: number[] = value;
      const A = area(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]) +
        area(arr[0], arr[1], arr[6], arr[7], arr[4], arr[5]);
      const A1 = area(lat, long, arr[0], arr[1], arr[2], arr[3]);
      const A2 = area(lat, long, arr[2], arr[3], arr[4], arr[5]);
      const A3 = area(lat, long, arr[4], arr[5], arr[6], arr[7]);
      const A4 = area(lat, long, arr[0], arr[1], arr[6], arr[7]);
      if (Math.abs(A - (A1 + A2 + A3 + A4)) < 0.0000000000000001) {
        console.log("Post is in POI: " + key);
        return key;
      }
    }
    return "";
  };

  /**
   * @description Get the current location of the user
   */
  const getLocation = async () => {
    present({
      duration: 0,
      message: "Getting Location..."
    });
    try {
      const pos = await Geolocation.getCurrentPosition(locationOptions);
      const poi: string = checkPOI(pos.coords.latitude, pos.coords.longitude);
      if ((poi === "") || (!poi) || (poi.length < 0)) {
        const toast = Toast.create({ message: 'Looks like you are not near a pinned location!', duration: 2000, color: 'toast-error' });
        toast.present();
        dismiss();
        return;
      }
      setPOI(poi.trim());
      setPosition(pos);
      const toast = Toast.create({ message: 'Location: ' + poi + ' added!', duration: 2000, color: 'toast-success' });
      toast.present();
      toast.dismiss();
      dismiss();
    } catch (e: any) {
      const toast = Toast.create({ message: 'Location access denied by user, adjust in iOS Settings', duration: 2000, color: 'toast-error' });
      toast.present();
      dismiss();
    }
    dismiss();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={() => {
        setLocationPinModal(false);
      }}
      breakpoints={[0, 0.99]}
      initialBreakpoint={0.99}
      handle={false}
    >
      <div style={{ width: "100%" }}>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonButton
              color={"primary"}
              mode="md"
              onClick={() => {
                setLocationPinModal(false);
              }}
            >
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </div>
      <IonList lines="none" >
        <IonRadioGroup value={checkboxSelection.charAt(0).toUpperCase() + checkboxSelection.slice(1)}>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='general-radio' style={{ fontSize: "1.1em" }} color="general">General</IonLabel>
            <IonRadio aria-labelledby='general-radio' slot="end" value="General" color="general" onIonFocus={() => setCheckboxSelection("general")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='alert-radio' style={{ fontSize: "1.1em" }} color="alert">Alert</IonLabel>
            <IonRadio aria-labelledby="alert-radio" color="alert" slot="end" value="Alert" onIonFocus={() => setCheckboxSelection("alert")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='sighting-radio' style={{ fontSize: "1.1em" }} color="sighting">Sighting</IonLabel>
            <IonRadio aria-labelledby="sighting-radio" color="sighting" slot="end" value="Sighting" onIonFocus={() => setCheckboxSelection("sighting")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='buysell-radio' style={{ fontSize: "1.1em" }} color="buysell">Buy / Sell</IonLabel>
            <IonRadio aria-labelledby="buysell-radio" color="buysell" slot="end" value="Buy/Sell" onIonFocus={() => setCheckboxSelection("buy/Sell")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='housing-radio' style={{ fontSize: "1.1em" }} color="housing" >Housing</IonLabel>
            <IonRadio aria-labelledby="housing-radio" color="housing" slot="end" value="Housing" onIonFocus={() => setCheckboxSelection("housing")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='event-radio' style={{ fontSize: "1.1em" }} color="event" >Event</IonLabel>
            <IonRadio aria-labelledby="event-radio" color="event" slot="end" value="Event" onIonFocus={() => setCheckboxSelection("event")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='research-radio' style={{ fontSize: "1.1em" }} color="research">Research</IonLabel>
            <IonRadio aria-labelledby="research-radio" color="research" slot="end" value="Research" onIonFocus={() => setCheckboxSelection("research")}></IonRadio>
          </IonItem>
          <IonItem style={{ '--min-height': '1vh' }}>
            <IonLabel id='dining-radio' style={{ fontSize: "1.1em" }} color="dining" >Dining</IonLabel>
            <IonRadio aria-labelledby="dining-radio" color="dining" slot="end" value="Dining" onIonFocus={() => setCheckboxSelection("dining")}></IonRadio>
          </IonItem>
        </IonRadioGroup>
      </IonList>

      <div style={{ height: "1vh", padding: '10px' }} />

      <IonList mode="md">
        <IonItem style={{ '--min-height': '1vh' }} mode="md" lines="none">
          {POI.length > 0 ?
            <IonLabel> Add post to map? </IonLabel>
            :
            <IonLabel> Add post to map?*</IonLabel>
          }
          <Map />
          <IonCheckbox
            slot="end"
            checked={locationChecked}
            onIonChange={(e) => {
              setLocationChecked(e.detail.checked);
              if (e.detail.checked) { getLocation(); }
              else { setPosition(null); setPOI(''); }
            }}
          />
        </IonItem>
      </IonList>

      {POI.length > 0 && locationChecked ?
        <IonNote style={{ textAlign: "center" }}>Location: {POI}</IonNote>
        :
        <IonNote style={{ textAlign: "center", width: "95vw", padding: "10px" }}>*Uses your current location to link your post to a on campus.</IonNote>
      }

      <div className="ion-button-container" style={{ marginBottom: "35%" }}>
        <IonButton
          onClick={() => {
            handleSendMessage();
          }}
          className={"login-button"} fill="clear" expand="block"
          id="message"
          style={{ width: "75vw", fontSize: "1.25em" }}
        >
          Post
        </IonButton>
      </div>
    </IonModal>
  )
};