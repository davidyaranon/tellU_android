import {IonFab, IonFabButton, IonIcon} from "@ionic/react";
import { refreshCircleOutline } from "ionicons/icons";
import { useAppContext } from "../../my-context";

export const NewPostsButton = (props : any) => {
  const schoolName = props.schoolName;
  const handleNewPostsButtonClicked = props.handleNewPostsButtonClicked;

  const context = useAppContext();

  return (
    <IonFab style={{ top: "5vh" }} horizontal="center" slot="fixed">
      <IonFabButton color={schoolName === "Cal Poly Humboldt" && context.schoolColorToggled ? "tertiary" : "primary"} className="load-new-posts" mode="md"
        onClick={() => { handleNewPostsButtonClicked() }}>
        New Posts
        <IonIcon icon={refreshCircleOutline} />
      </IonFabButton>
    </IonFab>
  )
}