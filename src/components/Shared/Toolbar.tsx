/**
 * Returns navigation toolbar to use for going back when entering a new page
 */

import { useToast } from "@agney/ir-toast";
import { Dialog } from "@capacitor/dialog";
import { IonBackButton, IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { alertCircleOutline, chatbubbleOutline, chevronBackOutline, shareSocialOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import '../../App.css';
import { useAppContext } from "../../my-context";

export const Toolbar = (props: any) => {
  const title = props.title;
  const schoolName = props.schoolName;
  const text = props.text;
  const color = props.color;
  const setShowReportModal = props.setShowReportModal;
  const deleteButton = props.deleteButton;
  const deleteAccount = props.deleteAccount;
  const dm = props.dm;
  const user = props.user;
  const uid = props.uid;
  const share = props.share;
  const handleShare = props.handleShare;

  const Toast = useToast();
  const history = useHistory();
  const context = useAppContext();

  /**
   * @description Shows dialog confirming if user wants to report the post
   * and if so, opens the report modal
   */
  const reportPost = async () => {
    const { value } = await Dialog.confirm({
      title: 'Report Post',
      message: `Are you sure you want to report this post?`,
      okButtonTitle: 'Report'
    });
    if (value) {
      setShowReportModal(true);
    }
  }

  return (
    <>
      <IonHeader className='ion-no-border' mode='ios'>
        <IonToolbar mode='ios'>
          {title && title.length > 0 && <IonTitle>{title}</IonTitle>}
          <IonButtons style={{ marginLeft: "-2.5%" }}>
            <IonBackButton
              defaultHref="/home"
              className="back-button"
              icon={chevronBackOutline}
              text={text || "Back"}
              color={color ? color : "primary"}
              style={{ fontSize: '.75em', marginLeft: '5px' }}
            >
            </IonBackButton>
          </IonButtons>
          {share &&
            <IonButtons slot='end'>
              <IonButton color={"primary"} slot="end" onClick={() => { handleShare() }}>
                <IonIcon icon={shareSocialOutline} />
              </IonButton>
            </IonButtons>
          }
          {schoolName && setShowReportModal &&
            <IonButtons slot='end'>
              <IonButton color={"primary"} slot="end" onClick={() => { reportPost(); }}>
                <IonIcon icon={alertCircleOutline} size={'small'} />
              </IonButton>
            </IonButtons>
          }
          {dm && user && user.uid !== uid &&
            <IonButtons slot='end'>
              <IonButton
                color={"primary"}
                slot="end"
                mode="md"
                onClick={() => {
                  let elements: any[] = [];
                  if (user && user.uid && uid) {
                    if (user.uid < uid) {
                      elements.push(uid);
                      elements.push(user.uid);
                    } else {
                      elements.push(user.uid);
                      elements.push(uid);
                    }
                    history.push("/chatroom/" + schoolName + "/" + elements[0] + '_' + elements[1], 'forward');
                  } else {
                    console.log(user.uid)
                    console.log(user);
                    console.log(uid);
                    const toast = Toast.create({ message: 'Unable to open DMs', duration: 2000, color: 'toast-error' });
                    toast.present();
                  }
                }}
              >
                <IonIcon icon={chatbubbleOutline} />
              </IonButton>
            </IonButtons>
          }
          {deleteButton &&
            <IonButtons slot="end">
              <IonButton
                onClick={() => deleteAccount()}
                color="toast-error"
                mode="md"
                fill="clear"
                id="deleteAccount"
              >
                Delete Account
              </IonButton>
            </IonButtons>
          }
        </IonToolbar>
      </IonHeader>
    </>
  )
}