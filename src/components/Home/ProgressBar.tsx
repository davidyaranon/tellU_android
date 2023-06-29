import { IonFooter, IonProgressBar } from "@ionic/react"
import { useAppContext } from "../../my-context";

export const ProgressBar = (props: any) => {
  const schoolName = props.schoolName;
  const context = useAppContext();
  return (
    <IonFooter mode="md" slot="bottom">
      <IonProgressBar type="indeterminate" color={schoolName === "Cal Poly Humboldt" && context.schoolColorToggled ? "tertiary" : "primary"} style={{ height: "0.5vh" }}></IonProgressBar>
    </IonFooter>
  )
}