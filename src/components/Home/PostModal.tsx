/* React + Ionic + Capacitor */
import {
  IonAvatar,
  IonButton, IonButtons, IonCard, IonCol, IonContent, IonFab,
  IonIcon, IonImg, IonItem, IonModal, IonRow, IonTextarea, IonToolbar
} from "@ionic/react";
import { Keyboard } from "@capacitor/keyboard";
import { Camera, GalleryPhoto } from "@capacitor/camera";
import { cameraOutline, closeOutline } from "ionicons/icons";

/* Other imports */
import { useAppContext } from "../../my-context";
import { ClassSelections } from "./ClassSelections";
import { useToast } from "@agney/ir-toast";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

export const PostModal = (props: any) => {

  const photos = props.photos;
  const profilePhoto = props.profilePhoto;
  const setPhotos = props.setPhotos;
  const setBlob = props.setBlob;
  const setShowModal = props.setShowModal;
  const setGifModal = props.setGifModal;
  const isOpen = props.isOpen;
  const prevPostUploading = props.prevPostUploading;
  const postClassName = props.postClassName;
  const postClassNumber = props.postClassNumber;
  const setPostClassName = props.setPostClassName;
  const setPostClassNumber = props.setPostClassNumber;
  const schoolName = props.schoolName;
  const inputRef = props.inputRef;
  const setLocationPinModal = props.setLocationPinModal;

  const context = useAppContext();
  const Toast = useToast();

  const handleRemoveImage = (index: number) => {
    setPhotos((prevPhotos: any) => prevPhotos && prevPhotos.filter((_: any, i: number) => i !== index));
  }

  const takePicture = async () => {
    setPhotos([]);
    try {
      const images = await Camera.pickImages({
        quality: 50,
        limit: 3,
      });
      let blobsArr: any[] = [];
      let photoArr: GalleryPhoto[] = [];
      if (images.photos.length > 3) {
        const toast = Toast.create({ message: 'The maximum allowed photos is 3', duration: 2000, color: 'warning' });
        toast.present();
      }
      for (let i = 0; i < images.photos.length; ++i) {
        let res = await fetch(images.photos[i].webPath!);
        let blobRes = await res.blob();
        blobsArr.push(blobRes);
        photoArr.push(images.photos[i]);
      }
      setPhotos(photoArr.slice(0, 3));
      setBlob(blobsArr);
    } catch (err: any) {
      // Toast.error(err.message.toString());
    }
  };

  return (
    <IonModal backdropDismiss={false} isOpen={isOpen} mode="md" handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
      <IonContent scrollEvents={true}>
        <div style={{ width: "100%" }}>
          <IonToolbar mode="md">
            <IonButtons slot="start">
              <IonButton
                color={"primary"}
                mode="md"
                onClick={() => {
                  setPhotos([]);
                  setBlob([]);
                  setPostClassName("");
                  setPostClassNumber("");
                  setGifModal(false);
                  // handleSetGifs(null);
                  Keyboard.hide().then(() => {
                    setTimeout(() => setShowModal(false), 100)
                  }).catch((err) => {
                    setTimeout(() => setShowModal(false), 100)
                  });
                }}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton
                color="light"
                onClick={() => {
                  setLocationPinModal(true);
                }}
                className={"post-button-modal"}
                fill="clear"
                expand="block"
                id="message"
                disabled={prevPostUploading}
              >
                Post
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </div>
        <IonCard >
          <IonRow class="ion-padding-top">
            {profilePhoto ? (
              <>
                <IonCol size="2.75" style={{ paddingRight: "10px", paddingTop: "10px" }}>
                  <IonAvatar style={{ padding: "7.5px" }}>
                    <img src={profilePhoto} />
                  </IonAvatar>
                </IonCol>
                <IonCol>
                  <IonTextarea
                    aria-label=""
                    spellcheck={true}
                    ref={inputRef}
                    rows={3}
                    maxlength={500}
                    style={context.darkMode ? { color: "white", height: "80px", fontSize: "large", paddingLeft: '5px', paddingRight: '15px' } : { color: "black", height: "80px", fontSize: "large", paddingLeft: '5px', paddingRight: '15px' }}
                    disabled={prevPostUploading}
                    placeholder="Start typing..."
                    id="message"
                  ></IonTextarea>
                </IonCol>
              </>
            )
              : (
                <>
                  <IonTextarea
                    aria-label=""
                    spellcheck={true}
                    ref={inputRef}
                    rows={3}
                    maxlength={500}
                    style={context.darkMode ? { color: "white", height: "80px", fontSize: "large", paddingLeft: '5px', paddingRight: '15px' } : { color: "black", height: "80px", fontSize: "large", paddingLeft: '5px', paddingRight: '15px' }}
                    disabled={prevPostUploading}
                    placeholder="Start typing..."
                    id="message"
                  ></IonTextarea>
                </>
              )}
          </IonRow>
          <br /> <br />
          <IonRow>

            <ClassSelections setPostClassName={setPostClassName} setPostClassNumber={setPostClassNumber} schoolName={schoolName} postClassNumber={postClassNumber} postClassName={postClassName} />

            <IonFab horizontal="end" style={{
              textAlign: "center", alignItems: "center",
              alignSelf: "center", display: "flex", paddingTop: ""
            }}>
              <IonButton
                fill="clear"
                onClick={takePicture}
                color="light"
                disabled={prevPostUploading}
              >
                <IonIcon icon={cameraOutline} />
              </IonButton>
            </IonFab>
          </IonRow>

          {photos && photos.length > 0 ? (
            <>
              <br />
              <br />
              <FadeIn>
                {photos.map((photo: GalleryPhoto, index: number) => {
                  return (
                    <IonCard key={"photo_" + index.toString()}>
                      <div style={{ position: 'relative' }}>
                        <IonImg src={photo?.webPath} style={{ opacity: .9 }} />
                        {/* <div style={{ position: 'absolute', top: '0', right: '0' }}>
                          <IonButton fill='solid' color='light' onClick={() => { handleRemoveImage(index) }}>
                            <IonIcon size='small' icon={closeOutline} />
                          </IonButton>
                        </div> */}
                      </div>
                    </IonCard>
                  )
                })}
              </FadeIn>
            </>
          ) : <> <br></br><br></br> </>}

        </IonCard>
        {prevPostUploading && <p style={{ textAlign: "center" }}>Wait until previous post has <br />uploaded to post again</p>}
      </IonContent>
    </IonModal>
  )
}