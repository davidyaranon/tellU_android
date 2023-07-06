/* React + Ionic + Capacitor */
import { useEffect, useState } from "react";
import {
  IonAvatar, IonBackButton, IonButtons, IonCol, IonContent, IonFab,
  IonHeader, IonItem, IonLabel, IonList,
  IonNote, IonPage, IonRow, IonSelect, IonSelectOption,
  IonSpinner, IonText, IonTitle, IonToolbar,
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { Virtuoso } from "react-virtuoso";
import Linkify from 'linkify-react';
import { PhotoViewer as CapacitorPhotoViewer, Image as CapacitorImage } from '@capacitor-community/photoviewer';
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

/* Firebase */
import auth, { getClassPostsDb, promiseTimeout } from '../fbConfig';

/* Other Imports */
import "../App.css";
import { useToast } from "@agney/ir-toast";
import FadeIn from '@rcnoverwatcher/react-fade-in-react-18/src/FadeIn';
import RoomIcon from '@mui/icons-material/Room';
import ProfilePhoto from "../components/Shared/ProfilePhoto";
import { getColor } from "../helpers/getColor";
import { getDate } from "../helpers/timeago";
import { classSelections } from "../helpers/class-selections-config";

const selectOptions = {
  header: 'Pin Filters',
  subHeader: 'Select which class number to see posts for'
};

interface MatchUserPostParams {
  className: string;
  schoolName: string;
};

const Class = ({ match }: RouteComponentProps<MatchUserPostParams>) => {
  const postClassName = match.params.className;
  const schoolName = match.params.schoolName;
  const history = useHistory();
  const [user] = useAuthState(auth);
  const Toast = useToast();
  const [classPosts, setClassPosts] = useState<any[]>();
  const [classPostsCopy, setClassPostsCopy] = useState<any[]>();
  const [emoji, setEmoji] = useState<any>("");
  const [classNumberFilter, setClassNumberFilter] = useState<string>();

  const getClassPosts = async () => {
    if (postClassName) {
      if (postClassName.includes('CS')) {
        setEmoji('💻');
      } else if (postClassName.includes('FOR')) {
        setEmoji('🌳');
      } else if (postClassName.includes('ANTH')) {
        setEmoji('🦕');
      } else if (postClassName.includes('ART')) {
        setEmoji('🎨');
      } else if (postClassName.includes('BIOL')) {
        setEmoji('🧬');
      } else if (postClassName.includes('BOT')) {
        setEmoji('🌷');
      } else if (postClassName.includes('CHEM')) {
        setEmoji('🧪');
      } else if (postClassName.includes('COMM')) {
        setEmoji('📠');
      } else if (postClassName.includes('CRIM')) {
        setEmoji('🚔');
      } else if (postClassName.includes('CRGS')) {
        setEmoji('🏳️‍🌈');
      } else if (postClassName.includes('DANC')) {
        setEmoji('💃🏻');
      } else if (postClassName.includes('ECON')) {
        setEmoji('🤑');
      } else if (postClassName.includes('EDUC')) {
        setEmoji('📚');
      } else if (postClassName.includes('ENGR')) {
        setEmoji('📐');
      } else if (postClassName.includes('ENGL')) {
        setEmoji('📕');
      } else if (postClassName.includes('FILM')) {
        setEmoji('🎬');
      } else if (postClassName.includes('FISH')) {
        setEmoji('🐠');
      } else if (postClassName.includes('FREN')) {
        setEmoji('🇫🇷');
      } else if (postClassName.includes('GEOG')) {
        setEmoji('🌎');
      } else if (postClassName.includes('GEOL')) {
        setEmoji('🪨');
      } else if (postClassName.includes('JMC')) {
        setEmoji('📰');
      } else if (postClassName.includes('MATH')) {
        setEmoji('➗✖️');
      } else if (postClassName.includes('HIST')) {
        setEmoji('🌏');
      } else if (postClassName.includes('KINS')) {
        setEmoji('💪');
      } else if (postClassName.includes('OCN')) {
        setEmoji('🌊');
      } else if (postClassName.includes('PYSC')) {
        setEmoji('🧠');
      } else if (postClassName.includes('PHIL')) {
        setEmoji('🧐');
      } else if (postClassName.includes('WLDF') || postClassName.includes('ZOOL')) {
        setEmoji('🦁');
      } else {
        setEmoji('📚');
      }
      const classPosts = promiseTimeout(15000, getClassPostsDb(postClassName, schoolName));
      classPosts.then((posts) => {
        console.log(posts);
        if (posts) {
          setClassPosts(posts);
          setClassPostsCopy(posts);
        } else {
          const toast = Toast.create({ message: 'Something went wrong within this class', duration: 2000, color: 'toast-error' });
          toast.present();
        }
      });
      classPosts.catch((err) => {
        const toast = Toast.create({ message: err || "", duration: 2000, color: 'toast-error' });
        toast.present();
      });
    }
  }

  const filterPosts = (e: any) => {
    setClassNumberFilter(e.detail.value);
    if (e.detail.value === 'ALL') {
      setClassPosts(classPostsCopy);
      return;
    }
    if (classPostsCopy) {
      let newPosts: any[] = [];
      for (let i = 0; i < classPostsCopy?.length; ++i) {
        if ("classNumber" in classPostsCopy[i] && classPostsCopy[i].classNumber == e.detail.value) {
          newPosts.push(classPostsCopy[i]);
        }
      }
      console.log(newPosts);
      setClassPosts(newPosts);
    } else {
      const toast = Toast.create({ message: 'Unable to filter', duration: 2000, color: 'toast-error' });
      toast.present();
    }
  }

  useEffect(() => {
    if (user && schoolName) {
      getClassPosts();
    } else {
      if (!user) {
        console.log("user not a thing");
      }
      if (!schoolName) {
        console.log("no school name");
      }
    }
  }, [match.params.className, schoolName, user]);

  const Footer = () => {
    return (
      <>
        <br></br> <br></br>
      </>
    )
  }

  return (
    <IonPage >
      <>
        <IonHeader>
          <IonToolbar mode='ios'>
            {postClassName && <IonTitle>All {postClassName} Posts {emoji}</IonTitle>}
            <IonButtons>
              <IonBackButton style={{ fontSize: '.75em', marginLeft: '5px' }} defaultHref="/home" className="back-button" icon={chevronBackOutline} text={"\n"} color={"primary"} >
              </IonBackButton>
            </IonButtons>
            <IonButtons slot='end'>
              <IonSelect
                interface="action-sheet"
                interfaceOptions={selectOptions}
                okText="Filter"
                cancelText="Cancel"
                mode="md"
                value={classNumberFilter}
                placeholder="Filter: ALL"
                onIonChange={(e: any) => {
                  filterPosts(e);
                }}
              >
                {classSelections[schoolName][postClassName].map((classNumber: string, index: number) => {
                  return (
                    <IonSelectOption key={index} value={classNumber}>{classNumber}</IonSelectOption>
                  );
                })}
              </IonSelect>
            </IonButtons>

          </IonToolbar>
        </IonHeader>
      </>

      <IonContent fullscreen scrollY={false}>

        {classPosts && classPosts.length == 0 &&
          <div className="ion-spinner">
            <p style={{ textAlign: "center", width: "75vw", fontSize: "0.85em" }}>No posts matching section number</p>
            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "0.9em", color: "var(--ion-color-primary)" }}> Be the first to post about this class!</p>
          </div>
        }

        <Virtuoso
          className="ion-content-scroll-host"
          data={classPosts}
          style={{ height: "100%" }}
          itemContent={(item: number) => {
            if (classPosts && classPosts.length > 0) {
              let post = classPosts[item];
              return (
                <FadeIn key={post.key}>
                  <IonList inset={true} mode="md">
                    <IonItem lines="none" mode="md" onClick={() => { history.push("/post/" + schoolName + "/" + post.userName + "/" + post.key); }}>
                      <IonLabel class="ion-text-wrap">
                        <IonRow>
                          <FadeIn>
                            <IonAvatar class="posts-avatar" onClick={(e) => { e.stopPropagation(); history.push("/about/" + schoolName + "/" + post.uid); }} >
                              <ProfilePhoto uid={post.uid} />
                            </IonAvatar>
                          </FadeIn>
                          <p style={{ color: "var(--ion-color-light)", padding: "10px", fontWeight: 'bold' }}> {post.userName} </p>
                        </IonRow>
                        {post.postType ? (
                          <IonFab vertical="top" horizontal="end">
                            {post.postType !== "general" ?
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: getColor(post.postType),
                                }}
                              >
                                {post.postType.toUpperCase()}
                                &nbsp;
                                {post.marker && "POI" in post && post.POI.length > 0 ? (
                                  <RoomIcon
                                    style={{ fontSize: "1em" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      history.push("/markerInfo/" + schoolName + "/" + post.POI);
                                    }}
                                  />
                                ) : null}
                              </p>
                              :
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: getColor(post.postType),
                                  marginLeft: "75%"
                                }}
                              >
                                {post.marker && "POI" in post && post.POI.length > 0 ? (
                                  <RoomIcon onClick={(e) => {
                                    e.stopPropagation();
                                    history.push("/markerInfo/" + schoolName + "/" + post.POI);
                                  }}
                                    style={{ fontSize: "1em" }} />) : null}
                              </p>
                            }
                            <IonNote style={{ fontSize: "0.65em" }}>
                              {getDate(post.timestamp)}
                            </IonNote>
                          </IonFab>
                        ) :
                          (
                            <IonFab vertical="top" horizontal="end">
                              <IonNote style={{ fontSize: "0.65em" }}>
                                {getDate(post.timestamp)}
                              </IonNote>
                            </IonFab>
                          )}
                        <div style={{ height: "0.75vh" }}>{" "}</div>
                        {"className" in post && "classNumber" in post ?
                          <Linkify tagName="h3" className="h2-message">
                            {post.message}
                            <IonNote
                              color="medium"
                              style={{ fontWeight: "400" }}
                            >
                              &nbsp; — {post.className} {post.classNumber}
                            </IonNote>
                          </Linkify>
                          :
                          <Linkify tagName="h3" className="h2-message">
                            {post.message}
                          </Linkify>
                        }

                        {"imgSrc" in post && post.imgSrc &&
                          post.imgSrc.length == 1 &&
                          <>
                            <div style={{ height: "0.75vh" }}>{" "}</div>
                            <div
                              className="ion-img-container"
                              style={{ backgroundImage: `url(${post.imgSrc[0]})`, borderRadius: '10px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const img: CapacitorImage = {
                                  url: post.imgSrc[0],
                                  title: `${post.userName}'s post`
                                };
                                CapacitorPhotoViewer.show({
                                  images: [img],
                                  mode: 'one',
                                  options: {
                                    title: true
                                  }
                                }).catch((err) => {
                                  const toast = Toast.create({ message: 'Unable to open image', duration: 2000, color: 'toast-error' });
                                  toast.present();
                                });
                              }}
                            >
                            </div>
                          </>
                        }
                        {"imgSrc" in post && post.imgSrc &&
                          post.imgSrc.length == 2 ? (
                          <>
                            <div style={{ height: "0.75vh" }}>{" "}</div>
                            <IonRow>
                              <IonCol>
                                <div
                                  className="ion-img-container"
                                  style={{ backgroundImage: `url(${post.imgSrc[0]})`, borderRadius: '10px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const img: CapacitorImage[] = [
                                      {
                                        url: post.imgSrc[0],
                                        title: `${post.userName}'s post`
                                      },
                                      {
                                        url: post.imgSrc[1],
                                        title: `${post.userName}'s post`
                                      },
                                    ]
                                    CapacitorPhotoViewer.show({
                                      images: img,
                                      mode: 'slider',
                                      options: {
                                        title: true,
                                      },
                                      startFrom: 0,
                                    }).catch((err) => {
                                      const toast = Toast.create({ message: 'Unable to open image on wen version', duration: 2000, color: 'toast-error' });
                                      toast.present();
                                    });
                                  }}
                                >
                                </div>
                              </IonCol>
                              <IonCol>
                                <div
                                  className="ion-img-container"
                                  style={{ backgroundImage: `url(${post.imgSrc[1]})`, borderRadius: '10px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const img: CapacitorImage[] = [
                                      {
                                        url: post.imgSrc[0],
                                        title: `${post.userName}'s post`
                                      },
                                      {
                                        url: post.imgSrc[1],
                                        title: `${post.userName}'s post`
                                      },
                                    ]
                                    CapacitorPhotoViewer.show({
                                      images: img,
                                      mode: 'slider',
                                      options: {
                                        title: true
                                      },
                                      startFrom: 1,
                                    }).catch((err) => {
                                      const toast = Toast.create({ message: 'Unable to open image on web version', duration: 2000, color: 'toast-error' });
                                      toast.present();
                                    });
                                  }}
                                >
                                </div>
                              </IonCol>
                            </IonRow>
                          </>
                        ) : null}
                        {"imgSrc" in post && post.imgSrc &&
                          post.imgSrc.length >= 3 ? (
                          <>
                            <div style={{ height: "0.75vh" }}>{" "}</div>
                            <IonRow>
                              <IonCol>
                                <div
                                  className="ion-img-container"
                                  style={{ backgroundImage: `url(${post.imgSrc[0]})`, borderRadius: '10px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const img: CapacitorImage[] = [
                                      {
                                        url: post.imgSrc[0],
                                        title: `${post.userName}'s post`
                                      },
                                      {
                                        url: post.imgSrc[1],
                                        title: `${post.userName}'s post`
                                      },
                                      {
                                        url: post.imgSrc[2],
                                        title: `${post.userName}'s post`
                                      },
                                    ]
                                    CapacitorPhotoViewer.show({
                                      images: img,
                                      mode: 'slider',
                                      options: {
                                        title: true
                                      },
                                      startFrom: 0,
                                    }).catch((err) => {
                                      const toast = Toast.create({ message: 'Unable to open image', duration: 2000, color: 'toast-error' });
                                      toast.present();
                                    });
                                  }}
                                >
                                </div>
                              </IonCol>
                              <IonCol>
                                <div
                                  className="ion-img-container"
                                  style={{ backgroundImage: `url(${post.imgSrc[1]})`, borderRadius: '10px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const img: CapacitorImage[] = [
                                      {
                                        url: post.imgSrc[0],
                                        title: `${post.userName}'s post`
                                      },
                                      {
                                        url: post.imgSrc[1],
                                        title: `${post.userName}'s post`
                                      },
                                      {
                                        url: post.imgSrc[2],
                                        title: `${post.userName}'s post`
                                      },
                                    ]
                                    CapacitorPhotoViewer.show({
                                      images: img,
                                      mode: 'slider',
                                      options: {
                                        title: true
                                      },
                                      startFrom: 1,
                                    }).catch((err) => {
                                      const toast = Toast.create({ message: 'Unable to open image', duration: 2000, color: 'toast-error' });
                                      toast.present();
                                    });
                                  }}
                                >
                                </div>
                              </IonCol>
                            </IonRow>
                            <>
                              <div style={{ height: "0.75vh" }}>{" "}</div>
                              <div
                                className="ion-img-container"
                                style={{ backgroundImage: `url(${post.imgSrc[2]})`, borderRadius: '20px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const img: CapacitorImage[] = [
                                    {
                                      url: post.imgSrc[0],
                                      title: `${post.userName}'s post`
                                    },
                                    {
                                      url: post.imgSrc[1],
                                      title: `${post.userName}'s post`
                                    },
                                    {
                                      url: post.imgSrc[2],
                                      title: `${post.userName}'s post`
                                    },
                                  ]
                                  CapacitorPhotoViewer.show({
                                    images: img,
                                    mode: 'slider',
                                    options: {
                                      title: true
                                    },
                                    startFrom: 2,
                                  }).catch((err) => {
                                    const toast = Toast.create({ message: 'Unable to open image', duration: 2000, color: 'toast-error' });
                                    toast.present();
                                  });
                                }}
                              >
                              </div>
                            </>
                          </>
                        ) : null}
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </FadeIn>
              )
            }
            return (
              <div className="ion-spinner">
                <IonSpinner color={"primary"} />
              </div>
            )
          }}
          components={{ Footer }}
        />
      </IonContent>
    </IonPage >
  )

};

export default Class;