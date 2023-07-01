import { IonFooter, IonProgressBar } from "@ionic/react"
import { useAppContext } from "../../my-context";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';

export const ProgressBar = (props: any) => {
  const schoolName = props.schoolName;
  const context = useAppContext();
  return (
    <FadeIn>
      <IonFooter mode="md" slot="bottom">
        <IonProgressBar type="indeterminate" color={"primary"} style={{ height: "0.5vh" }}></IonProgressBar>
      </IonFooter>
    </FadeIn>
  )
}