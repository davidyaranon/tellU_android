import React from "react";
import { IonFab, IonFabButton, IonFabList, IonIcon, IonImg, useIonRouter } from "@ionic/react";
import { useAppContext } from "../../my-context"
import GifIcon from '@mui/icons-material/Gif';
import { add, chatboxEllipsesOutline, statsChartOutline } from "ionicons/icons";
import { GalleryPhoto } from "@capacitor/camera";
import { GifModal } from "./GifModal";
import { PostModal } from "./PostModal";
import { PollModal } from "./PollModal";
import { LocationPinModal } from "./LocationPinModal";

export const MakePost = (props: any) => {

  const context = useAppContext();

  const schoolName = props.schoolName;
  const setShowProgressBar = props.handleSetShowProgressBar;
  const profilePhoto = props.profilePhoto;
  const user = props.user;

  const [photo, setPhoto] = React.useState<GalleryPhoto[] | null>([]);
  const [blob, setBlob] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showGifModal, setShowGifModal] = React.useState<boolean>(false);
  const [showPollModal, setShowPollModal] = React.useState<boolean>(false);
  const [postClassNumber, setPostClassNumber] = React.useState<string>("");
  const [postClassName, setPostClassName] = React.useState<string>("");
  const [prevPostUploading, setPrevPostUploading] = React.useState<boolean>(false);
  const [showLocationPinModal, setShowLocationPinModal] = React.useState<boolean>(false);

  const inputRef = React.useRef<HTMLIonTextareaElement>(null);

  /**
   * @description handles state update of location pin modal from child components
   * 
   * @param {boolean} show boolean to show or hide modal
   */
  const handleSetLocationPinModal = React.useCallback((show: boolean) => {
    setShowLocationPinModal(show);
  }, []);

  /**
   * @description handles state update of previous post uploading from child components
   * 
   * @param {boolean} loading boolean to show or hide progress bar
   */
  const handleSetPreviousPostLoading = React.useCallback((loading: boolean) => {
    setPrevPostUploading(loading);
  }, []);

  /**
   * @description handles state update of post class name from child components
   * 
   * @param {string} selection class name
   */
  const handleSetPostClassName = React.useCallback((selection: string) => {
    setPostClassName(selection);
  }, []);

  /**
   * @description handles state update of post class number from child components
   * 
   * @param {string} selection class number
   */
  const handleSetPostClassNumber = React.useCallback((selection: string) => {
    setPostClassNumber(selection);
  }, []);

  /**
   * @description handles state update of poll modal from child components
   * 
   * @param {boolean} show boolean to show or hide modal
   */
  const handleSetShowPollModal = React.useCallback((show: boolean) => {
    setShowPollModal(show);
  }, []);

  /**
   * @description handles state update of blob from child components
   * 
   * @param {any} blob photo data
   */
  const handleSetBlob = React.useCallback((blob: any) => {
    setBlob(blob);
  }, []);

  /**
   * @description handles state update of photos array from child components
   * 
   * @param {GalleryPhoto[]} photo array of photos
   */
  const handleSetPhotos = React.useCallback((photos: GalleryPhoto[]) => {
    setPhoto(photos);
  }, []);

  /**
   * @description handles state update of post modal from child components
   * 
   * @param {boolean} show boolean to show or hide modal
   */
  const handleSetGifModal = React.useCallback((show: boolean) => {
    setShowGifModal(show);
  }, []);

  /**
   * @description handles state update of gif modal from child components
   * 
   * @param {boolean} show boolean to show or hide modal
   */
  const handleSetShowModal = React.useCallback((show: boolean) => {
    setShowModal(show);
  }, []);

  /**
   * @description handles the use of the hardware back button and determines which modals to close.
   */
  const handleSetModalStates = React.useCallback((showModal: boolean, showLocationPinModal: boolean, showGifModal: boolean, showPollModal: boolean) => {
    setShowModal(showModal);
    setShowLocationPinModal(showLocationPinModal);
    setShowGifModal(showGifModal);
    setShowPollModal(showPollModal);
  }, []);

  React.useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        console.log("BACK BUTTON MAKE POST");
        if (showLocationPinModal === true) {
          handleSetModalStates(true, false, false, false);
        } else if (showModal === true || showGifModal === true || showPollModal === true) {
          handleSetModalStates(false, false, false, false);
        }
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [handleSetModalStates, showLocationPinModal, showModal, showPollModal, showGifModal]);




  return (
    <>
      <LocationPinModal
        isOpen={showLocationPinModal} setLocationPinModal={handleSetLocationPinModal}
        user={user} schoolName={schoolName}
        photos={photo} blob={blob} setPhoto={handleSetPhotos} setBlob={handleSetBlob}
        setShowModal={handleSetShowModal} setGifModal={handleSetGifModal}
        postClassName={postClassName} postClassNumber={postClassNumber} setPostClassName={handleSetPostClassName} setPostClassNumber={handleSetPostClassNumber}
        inputRef={inputRef} setShowProgressBar={setShowProgressBar} setPrevPostUploading={handleSetPreviousPostLoading} />

      <PostModal user={user} profilePhoto={profilePhoto} isOpen={showModal} schoolName={schoolName}
        postClassName={postClassName} setPostClassName={handleSetPostClassName} postClassNumber={postClassNumber} setPostClassNumber={handleSetPostClassNumber}
        photos={photo} setPhotos={handleSetPhotos} setBlob={handleSetBlob} inputRef={inputRef}
        setShowModal={handleSetShowModal} setGifModal={handleSetGifModal} setLocationPinModal={handleSetLocationPinModal} />

      <PollModal prevPostUploading={prevPostUploading} setShowProgressBar={setShowProgressBar}
        isOpen={showPollModal} user={user} schoolName={schoolName} setShowPollModal={handleSetShowPollModal} />

      <GifModal isOpen={showGifModal} schoolName={schoolName} setBlob={handleSetBlob} setPhotos={handleSetPhotos}
        setShowModal={handleSetShowModal} setGifModal={handleSetGifModal} />

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton color={"primary"}>
          <IonIcon icon={add} />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton onClick={() => { handleSetShowPollModal(true) }} color={"light"}>
            <IonIcon icon={statsChartOutline} color="ion-blue" />
          </IonFabButton>
          <IonFabButton onClick={() => { handleSetGifModal(true); }} color={"light"}>
            <GifIcon style={{color : "#00A4C2"}} />
          </IonFabButton>
          <IonFabButton onClick={() => { handleSetShowModal(true); }} color={"light"}>
            <IonIcon icon={chatboxEllipsesOutline} color="ion-blue" />
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </>
  )
}