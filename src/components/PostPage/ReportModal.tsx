import { useRef } from "react";
import { IonModal, IonToolbar, IonButtons, IonButton, IonTextarea, IonContent, IonCard, IonNote } from "@ionic/react";
import { useToast } from "@agney/ir-toast";
import { sendReportStatus } from "../../fbConfig";

export const ReportModal = (props: any) => {

  const Toast = useToast();

  const reportMessageRef = useRef<HTMLIonTextareaElement>(null);

  const schoolName = props.schoolName;
  const isOpen = props.isOpen;
  const postKey = props.postKey;
  const handleShowReportModal = props.handleShowReportModal;

  return (
    <IonModal backdropDismiss={false} isOpen={isOpen} mode="md" handle={false} breakpoints={[0, 1]} initialBreakpoint={1}>
      <div slot="fixed" style={{ width: "100%" }}>
        <IonToolbar mode="md">
          <IonButtons slot="start">
            <IonButton
              color={"primary"}
              mode="md"
              onClick={() => {
                handleShowReportModal(false);
              }}
            >
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              color={"primary"}
              mode="md"
              slot="end"
              onClick={() => {
                if (!reportMessageRef || !reportMessageRef.current || !reportMessageRef.current.value || reportMessageRef.current.value === "") {
                  const toast = Toast.create({ message: 'Provide a reason why!', duration: 2000, color: 'toast-error' });
                  toast.present();
                } else {
                  sendReportStatus(reportMessageRef.current.value, schoolName, postKey).then((reportStatus) => {
                    if (reportStatus) {
                      handleShowReportModal(false);
                      const toast = Toast.create({ message: 'Post reported', duration: 2000, color: 'toast-success' });
                      toast.present();
                      toast.dismiss();
                    } else {
                      const toast = Toast.create({ message: 'Something went wrong', duration: 2000, color: 'toast-error' });
                      toast.present();
                    }
                  });
                  reportMessageRef.current.value = "";
                }
              }}
            >
              Report
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </div>

      <IonContent>
        <IonCard mode="md">
          <IonTextarea
            style={{ marginLeft: "2.5%" }}
            rows={4}
            mode="md"
            maxlength={500}
            placeholder="Reason for reporting..."
            id="message"
            required={true}
            ref={reportMessageRef}
          ></IonTextarea>
        </IonCard>
        <IonNote style={{ textAlign: "center", alignItems: "center", alignSelf: "center", display: "flex", fontSize: "1em" }}>
          Post will be manually reviewed and might be deleted if deemed inappropriate
        </IonNote>
      </IonContent>
    </IonModal>
  )
}