import { IonCard, IonRow, IonCol, IonSkeletonText, IonCardContent, IonSpinner } from "@ionic/react";
import { useAppContext } from "../../my-context";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

export const PostLoading = () => {
  return (
    <>
      <FadeIn>
        <IonCard mode="md" style={{ height: "20vh" }}>
          <IonCardContent>
            <IonRow>
              <IonCol size="2">
                <IonSkeletonText style={{ height: "5vh", marginLeft: "-1vw" }} animated></IonSkeletonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonSkeletonText style={{ height: "2vh" }} animated></IonSkeletonText>
              <IonSkeletonText style={{ height: "2vh" }} animated></IonSkeletonText>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </FadeIn>
    </>
  );
}

export const CommentLoading = (props: any) => {
  const schoolName = props.schoolName;
  const context = useAppContext();
  return (
    <FadeIn>
      <div
        style={{
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
        }
        }
      >
        <IonSpinner color={"primary"} />
      </div >
    </FadeIn>
  );
}