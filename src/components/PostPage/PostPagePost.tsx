import { IonList, IonLabel, IonText, IonAvatar, IonItem, IonRow } from "@ionic/react";
import { useHistory } from "react-router";
import ProfilePhoto from "../Shared/ProfilePhoto";
import { PostType } from "../Shared/PostType";
import { PostMessage } from "../Home/PostMessage";
import PostImages from "../Shared/PostImages";
import '../../App.css';
import { PostPageLikeDislike } from "./PostPageLikeDislike";
import { useCallback, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import { useToast } from "@agney/ir-toast";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';
import { memo } from "react";

const PostPagePost = (props: any) => {
  const post = props.post;
  const index = props.index;
  const user = props.user;
  let schoolName = props.schoolName;
  const postKey = props.postKey;
  const handleSetDeletingComment = props.handleSetDeletingComment;

  const Toast = useToast();

  /**
   * Loads school from local storage (Preferences API)
   */
  const setSchool = useCallback(async () => {
    const school = await Preferences.get({ key: 'school' });
    if (school && school.value) {
      schoolName = school.value;
    } else {
      const toast = Toast.create({ message: 'Something went wrong when retrieving school', duration: 2000, color: 'toast-error' });
      toast.present();
    }
  }, []);

  useEffect(() => {
    if (!schoolName || typeof schoolName !== 'string' || schoolName.length === 0) {
      setSchool();
    }
  }, [])


  // hooks
  const history = useHistory();

  return (
    <FadeIn key={index}>
      <IonList inset={true} mode="md">
        <IonItem lines="none" mode="md">
          <IonLabel>
            <IonRow>
              <FadeIn>
                <IonAvatar class="posts-avatar" onClick={(e) => { e.stopPropagation(); history.push("/about/" + schoolName + "/" + post.uid); }} >
                  <ProfilePhoto uid={post.uid} />
                </IonAvatar>
              </FadeIn>
              <p style={{ color: "var(--ion-color-light)", padding: "10px", fontWeight: 'bold' }}> {post.userName} </p>
            </IonRow>
            <PostType schoolName={schoolName} type={post.postType} marker={post.marker} POI={post.POI} timestamp={post.timestamp} />
            <PostMessage schoolName={schoolName} message={post.message} classNumber={post.classNumber} className={post.className} reports={post.reports || 0} />
            <PostImages userName={post.userName} imgSrc={post.imgSrc || []} reports={post.reports || 0} />
          </IonLabel>
        </IonItem>
        <PostPageLikeDislike handleSetDeletingComment={handleSetDeletingComment} user={user} schoolName={schoolName} schoolColorToggled={false} post={post} postKey={postKey} likes={post.likes} dislikes={post.dislikes} index={index} />
      </IonList>
    </FadeIn>
  )
};

export default memo(PostPagePost);