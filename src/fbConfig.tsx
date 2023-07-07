import "firebase/compat/firestore";
import {
  DocumentData,
  addDoc, collection, deleteDoc,
  doc, getDoc, getDocs, getFirestore, increment, limit, orderBy,
  query, runTransaction, serverTimestamp, setDoc, startAfter,
  updateDoc, where, writeBatch,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword, getAuth, indexedDBLocalPersistence,
  initializeAuth, sendPasswordResetEmail, signInWithEmailAndPassword,
  signOut, updateProfile, deleteUser,
} from "firebase/auth";
import {
  get, getDatabase,
  increment as rtdbIncrement,
  runTransaction as rtdbRunTransaction,
  set, update
} from "firebase/database";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from "firebase/app";
import { ref as rtdbRef } from "firebase/database";

import { Capacitor } from '@capacitor/core';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
const REACT_APP_SPOTIFY_CLIENT_ID = '1df10089b0b3490db93c23353b0cdc35';
const REACT_APP_SPOTIFY_SECRET_ID = '118bf77d75eb4ef98c3dbc1a2443929f';
const firebaseConfig = {
  apiKey: "AIzaSyAHV2ukGyxwx_8wADQSd4QXV1rRiU93L44",
  databaseURL: "https://quantum-61b84-default-rtdb.firebaseio.com",
  authDomain: "quantum-61b84.firebaseapp.com",
  projectId: "quantum-61b84",
  storageBucket: "quantum-61b84.appspot.com",
  messagingSenderId: "461090594003",
  appId: "1:461090594003:web:5cb1cac4a16e9031140826",
  measurementId: "G-JRZ1RJ4P89",
};
const app = initializeApp(firebaseConfig);
const auth = Capacitor.isNativePlatform() ?
  initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  }) :
  getAuth();
export default auth;

export const functions = getFunctions(app);
export const db = getFirestore(app);
export const storage = getStorage();
export const database = getDatabase();

/* cloud functions */
export const deletePoll = httpsCallable(functions, 'deletePoll');
export const deleteImage = httpsCallable(functions, 'deleteImage');
export const deleteLikesDocFromRtdb = httpsCallable(functions, 'deleteLikesDocFromRtdb');
export const deleteCommentsFromDeletedPost = httpsCallable(functions, 'deleteCommentsFromDeletedPost');
export const sendEmailOnReport = httpsCallable(functions, 'sendEmailOnReport');
export const sendCommentsNotification = httpsCallable(functions, 'sendCommentsNotification');
export const sendDmNotification = httpsCallable(functions, 'sendDmNotification');
export const getHumboldtUpdates = httpsCallable(functions, 'getHumboldtUpdates');
export const getUcDavisUpdates = httpsCallable(functions, 'getUcDavisUpdates');
export const getUcBerkeleyUpdates = httpsCallable(functions, 'getUcBerkeleyUpdates');
export const askAI = httpsCallable(functions, 'askAI');

/**
 * Registers user with Firestore auth based on email and password
 * 
 * @param {string} name provided user name 
 * @param {string} email provided user email
 * @param {string} password provided user password
 * @param {string} school school the user is attending
 * 
 * @returns {Promise<any>}
 */
export async function registerWithEmailAndPassword(name: string, email: string, password: string, school: string): Promise<any> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res) {
      const user = res.user;
      await updateProfile(user, {
        displayName: name,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/profilePictures%2F301-3012952_this-free-clipart-png-design-of-blank-avatar.png?alt=media&token=90117292-9497-4b30-980e-2b17986650cd",
      });
      try {
        await setDoc(doc(db, "userData", user.uid.toString()), {
          bio: "",
          snapchat: "",
          instagram: "",
          tiktok: "",
          spotify: "",
          userName: name,
          userEmail: email,
          uid: user.uid,
          school: school,
          notifs: [],
          timestamp: serverTimestamp(),
          notificationsToken: "",
        });
        await setDoc(doc(db, "userPhotoUrls", user.uid.toString()), {
          url: "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/profilePictures%2F301-3012952_this-free-clipart-png-design-of-blank-avatar.png?alt=media&token=90117292-9497-4b30-980e-2b17986650cd"
        });
      } catch (docErr) {
        console.log(docErr);
      }
      return res;
    }
  } catch (err: any) {
    return err.message.toString();
  }
}

/**
 * @description Signs in returning user using Firebase's 'logInWithEmailAndPassword()'
 * 
 * @param {string} email email address for returning user
 * @param {string} password password for returning user
 * 
 * @returns {Promise<{email: string | null; uid: string;} | undefined>} object containing the auth user email and auth user uid or undefined if
 */
export async function logInWithEmailAndPassword(email: string, password: string): Promise<{ email: string | null; uid: string; } | undefined> {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { email: res.user.email, uid: res.user.uid }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Adds user to Firestore database ("/userInfo/{uid}")
 * 
 * @param {string} uid uid of new user
 * @param {string} email email address of new user
 * 
 * @returns {Promise<true | undefined>} whether the user was added successfully
 */
export async function addUserToDb(uid: string, email: string): Promise<true | undefined> {
  try {
    const userDoc = doc(db, "userInfo", uid);
    await setDoc(userDoc, {
      email: email,
      uid: uid,
      createdAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Signs out authenticated user.
 * Auth object is taken as parameter.
 */
export async function logout(): Promise<void> {
  await signOut(auth).catch((err) => { console.log(err) });
}

/**
 * @description Deletes user from Firebase Auth and all data from Firestore (/userInfo/{userUid})
 * TO-DO: Delete all user data from all Firestore paths
 */
export const deleteUserDataAndAccount = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    const batch = writeBatch(db);
    const userDoc = doc(db, "userInfo", user!.uid);
    batch.delete(userDoc);

    await deleteUser(user!).catch((err) => { console.log(err); });
    await batch.commit().catch((err) => { console.log(err); });

  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Acquires download URL from Firebase Cloud Storage with a given path
 * 
 * @param {string} path path of file in firebase storage
 * 
 * @returns {Promise<string | void>} a url usable as src attribute for img or video players or void
 */
export const getStorageUrl = async (path: string): Promise<string | void> => {
  const url = await getDownloadURL(ref(storage, path)).catch((err) => {
    console.log(err);
  });
  return url;
}

/**
 * @description Gets the user's profile information from Firestore
 * under the path /userData/{userUid}
 * 
 * @param {string} uid user uid we want to get the info for
 * 
 * @returns {Promise<DocumentData | undefined>} user profile information or undefined
 */
export const getUserInfo = async (uid: string): Promise<DocumentData | undefined> => {
  try {
    const userRef = doc(db, "userData", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * @description Gets the user's profile photo url from Firestore storage if they have one
 * 
 * @param {string} uid the user's UID which uniquely identifies them
 * 
 * @returns {Promise<string | undefined>} the url of the user's profile picture OR the default profile picture url
 */
export const getProfilePhoto = async (uid: string): Promise<string | undefined> => {
  if (auth) {
    getDownloadURL(ref(storage, "profilePictures/" + uid + "photoURL")).then((url) => {
      return url;
    }).catch((err) => {
      console.error(err);
    });
  } else {
    return "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/profilePictures%2F301-3012952_this-free-clipart-png-design-of-blank-avatar.png?alt=media&token=90117292-9497-4b30-980e-2b17986650cd";
  }
}

/**
 * @description handles poll voting and updates corresponding Firestore document 
 * 
 * @param {string} schoolName 
 * @param {number} index 
 * @param {string} postKey 
 * @param {string} userUid 
 * 
 * @returns {Promise<boolean | undefined>} a boolean confirming the vote was successful
 */
export const pollVote = async (schoolName: string, index: number, postKey: string, userUid: string): Promise<boolean | undefined> => {
  try {
    if (auth && db) {
      let hasVoted = false;
      const pollsDocRef = doc(db, "schoolPosts", schoolName.replace(/\s+/g, ""), "allPosts", postKey);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(pollsDocRef);
        if (snap.exists()) {
          if ("voteMap" in snap.data() && snap.data().voteMap[userUid] === undefined) {
            let tempResults = [...snap.data().results];
            tempResults[index] += 1;
            transaction.update(pollsDocRef, {
              [`voteMap.${userUid}`]: index,
              votes: increment(1),
              results: tempResults,
            });
            hasVoted = true;
          }
        }
      });
      return hasVoted;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description sets a timer for a function to resolve and cancels it if it takes too long
 * 
 * @param {number} ms 
 * @param {Promise<any>} promise 
 * 
 * @returns {Promise<any>}
 */
export const promiseTimeout = function (ms: number, promise: any): Promise<any> {
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      let rejectStr = "Request timed out (" + ms + " ms)";
      reject(rejectStr);
    }, ms);
  });
  return Promise.race([promise, timeout]);
};

/**
 * @description Retrieves data from Firebase RTDB for a specific post
 * 
 * @param {string} key uid of post
 * 
 * @returns {Promise<any>} object containing post data (likes, dislikes, comment amount)
 */
export const getLikes = async (key: string): Promise<any> => {
  try {
    const likesRef = rtdbRef(database, key);
    const snapshot = await get(likesRef);
    return snapshot.val();
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description upvote a post and updates the user's like history in RTDB
 * 
 * @param {string} postKey the Firestore key of the post
 * @param {any} post the post object containing the post's data
 * 
 * @returns either +1 or -1 depending on the user's previous like/dislike value(s)
 */
export const upVote = async (postKey: string, post: any) => {
  try {
    if (db && database && auth && auth.currentUser) {
      let inc = null;
      const userUid = auth.currentUser.uid;
      const userLikesDocRef = doc(
        db,
        "userData",
        userUid,
        "likes",
        postKey
      );
      let deleteLike = false;
      const likesRef = rtdbRef(database, postKey);
      await rtdbRunTransaction(likesRef, (post) => {
        if (post && post.likes && post.dislikes) {
          if (post.likes[userUid]) { // if liked before
            post.likes[userUid] = null;
            deleteLike = true;
            inc = -1;
          } else {
            if (!post.likes) {
              post.likes = {};
            }
            if (post.dislikes[userUid]) { // if disliked before
              post.dislikes[userUid] = null;
            }
            inc = 1;
            post.likes[userUid] = true;
          }
        }
        return post;
      });
      if (deleteLike) {
        await deleteDoc(userLikesDocRef);
      } else { // add to liked posts
        await setDoc(userLikesDocRef, {
          imgSrc: post.imgSrc,
          message: post.message,
          // photoURL: post.photoURL,
          timestamp: post.timestamp,
          likeTimestamp: serverTimestamp(),
          uid: post.uid,
          userName: post.userName,
          postType: post.postType,
        });
      }
      return inc;
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description downvote a post and updates the user's like history in RTDB
 * 
 * @param {string} postKey the Firestore key of the post
 * 
 * @returns either +1 or -1 depending on the user's previous like/dislike value(s)
 */
export const downVote = async (postKey: string) => {
  try {
    if (auth && auth.currentUser) {
      let inc = null;
      const userUid = auth.currentUser.uid;
      const userLikesDocRef = doc(
        db,
        "userData",
        userUid,
        "likes",
        postKey
      );
      let deleteLike = false;
      const likesRef = rtdbRef(database, postKey);
      await rtdbRunTransaction(likesRef, (post) => {
        if (post && post.likes && post.dislikes) {
          if (post.dislikes[userUid]) { // if disliked before
            post.dislikes[userUid] = null;
            inc = -1;
          } else {
            if (!post.dislikes) {
              post.dislikes = {};
            }
            if (post.likes[userUid]) { // if liked before
              post.likes[userUid] = null;
              deleteLike = true;
            }
            inc = 1;
            post.dislikes[userUid] = true;
          }
        }
        return post;
      });
      if (deleteLike) {
        await deleteDoc(userLikesDocRef);
      }
      return inc;
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description pulls the next 10 posts from Firestore
 * 
 * @param {string} schoolName the name of the university the user is attending
 * @param {string} key the key of the post in Firestore to use for the timestamp of the last post in the previous batch
 * 
 * @returns {Promise<{ allPosts: any[]; lastKey: string; } | undefined>} an array containing new posts and a new key for the next batch
 */
export async function getAllPostsNextBatch(schoolName: string, key: string): Promise<{ allPosts: any[]; lastKey: string; } | undefined> {
  try {
    if (auth.currentUser != null && db) {
      const allPostsRef = collection(
        db,
        "schoolPosts",
        schoolName.replace(/\s+/g, ""),
        "allPosts"
      );
      const q = query(allPostsRef, orderBy("timestamp", "desc"), startAfter(key), limit(10));
      const querySnapshot = await getDocs(q);
      const allPosts = [];
      const docs = querySnapshot.docs;
      let lastKey = "";
      for (const doc of docs) {
        allPosts.push({
          ...doc.data(),
          key: doc.id,
        });
        lastKey = doc.data().timestamp;
      }
      return { allPosts, lastKey };
    }
  } catch (err) {
    console.log(err);
    let allPosts: any[] = [];
    let lastKey = "";
    return { allPosts, lastKey };
  }
}

/**
 * Resets the notifications token of a device after logout
 * 
 * @param {string} userUid uid of user logging out
 */
const updateNotificationsTokenAfterLogout = async (userUid: string): Promise<void> => {
  if (!userUid || userUid.length <= 0) { return; }
  const batch = writeBatch(db);
  const userDocRef = doc(db, "userData", userUid);
  batch.update(userDocRef, {
    notificationsToken: ""
  });
  await batch.commit().catch((err) => console.log(err));
}

/**
 * Sets the notificationsToken field in Firestore userData/{uid}
 * Allows for unique push notifications to be sent to the user
 * 
 * @param {string} token notifications token from Google FCM
 */
export const updateNotificationsToken = async (token: string) => {
  try {
    if (!token || token.length <= 0) { return; }
    if (db && auth && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const batch = writeBatch(db);
      const userDocRef = doc(db, "userData", uid);
      batch.update(userDocRef, {
        notificationsToken: token
      });
      await batch.commit().catch((err) => console.log(err));
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description Checks if a user name has been taken by another user
 * 
 * @param {string} userName userName to check
 * 
 * @returns {Promise<boolean>} value whether or not the username is taken
 */
export async function checkUsernameUniqueness(userName: string): Promise<boolean> {
  try {
    if (db) {
      const usersRef = collection(db, "userData");
      const q = query(usersRef, where("userName", "==", userName));
      const snap = await getDocs(q);
      if (snap.empty) {
        return true;
      }
    } else {
      console.log("auth not defined");
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * @description Sends password reset email in case user forgets password
 * 
 * @param {string} email email to send password reset instructions to
 * 
 * @returns {Promise<true | undefined>}
 */
export const sendPasswordReset = async (email: string): Promise<true | undefined> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err) {
    console.error(err);
  }
};

/**
 * @description returns the single post data from Firestore using provided
 * school name and post key
 * 
 * @param {string} postKey the key of the post in Firestore to retreive
 * @param {string} schoolName the school the user is attending
 * 
 * @returns {Promise<DocumentData | undefined>} the post data or undefined
 */
export const getOnePost = async (postKey: string, schoolName: string): Promise<DocumentData | undefined> => {
  try {
    if (db) {
      const postDocRef = doc(
        db,
        "schoolPosts",
        schoolName.replace(/\s+/g, ""),
        "allPosts",
        postKey
      );
      const snap = await getDoc(postDocRef);
      if (snap.exists()) {
        return snap.data();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description uploads a new comment to Firestore
 * 
 * @param {string} postKey 
 * @param {string} schoolName 
 * @param {string} commentString 
 * @param {any}    blob 
 * @param {string} id 
 * @param {string} notificationsToken 
 * @param {string} posterUid 
 * @param {string} commenterNotificationToken 
 * @param {string[]} attedUsersList 
 * 
 * @returns {Promise<any>} newly added comment with corresponding info
 */
export const addCommentNew = async (postKey: string, schoolName: string,
  commentString: string, blob: any, id: string, notificationsToken: string,
  posterUid: string, commenterNotificationToken: string, attedUsersList: string[]) => {
  try {
    if (auth && database && auth.currentUser && db) {
      const uid = auth.currentUser.uid;
      const userName = auth.currentUser.displayName;
      const commentsRef = collection(db, "schoolPosts", schoolName.replace(/\s+/g, ""),
        "allPosts", postKey, "comments");
      let url = "";
      let imgSrc = "";
      if (blob) {
        url = "commentImages/" + auth.currentUser.uid.toString() + id;
        imgSrc = await getDownloadURL(ref(storage, url));
      }
      const addedDoc = await addDoc(commentsRef, {
        comment: commentString,
        userName: userName,
        uid: uid,
        timestamp: serverTimestamp(),
        url: url,
        imgSrc: imgSrc
      });
      await set(rtdbRef(database, addedDoc.id), {
        likes: {
          'null': true
        },
        dislikes: {
          'null': true
        },
      });
      const likesRef = rtdbRef(database, postKey);
      await update(likesRef, {
        commentAmount: rtdbIncrement(1)
      });

      console.log({ postKey });
      console.log({ posterUid });
      console.log({ userName })
      console.log({ notificationsToken });
      console.log({ commentString });
      console.log({ attedUsersList });
      if (attedUsersList && attedUsersList.length > 0) {
        for (let i = 0; i < attedUsersList.length; ++i) {
          console.log(attedUsersList[i]);
        }
      }
      // if (posterUid != uid) {
      sendCommentsNotification({
        isNotSameUser: (posterUid != uid),
        postKey: postKey,
        posterUid: posterUid,
        userName: userName,
        notificationsToken: notificationsToken,
        comment: commentString,
        taggedUsers: attedUsersList,
        data: {
          url: "/post/" + postKey
        },
        icon: "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/FCMImages%2FtellU_hat_logo.png?alt=media&token=827e8b14-3c58-4f48-a852-7a22899416c9"
      });

      return {
        comment: commentString,
        // photoURL: photoURL,
        userName: userName,
        uid: uid,
        likes: {},
        dislikes: {},
        timestamp: serverTimestamp(),
        key: addedDoc.id,
        url: url,
        imgSrc: imgSrc
      };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description downvotes a comment in RTDB
 * 
 * @param {string} commentKey the key of the comment doc in Firestore to upvote
 * @returns either +1 or -1 depending on the user's previous like/dislike value(s)
 */
export const downVoteComment = async (commentKey: string) => {
  try {
    if (auth && auth.currentUser) {
      let inc = null;
      const userUid = auth.currentUser.uid;
      let deleteLike = false;
      const likesRef = rtdbRef(database, commentKey);
      await rtdbRunTransaction(likesRef, (post) => {
        if (post && post.likes && post.dislikes) {
          if (post.dislikes[userUid]) { // if disliked before
            post.dislikes[userUid] = null;
            inc = -1;
          } else {
            if (!post.dislikes) {
              post.dislikes = {};
            }
            if (post.likes[userUid]) { // if liked before
              post.likes[userUid] = null;
              deleteLike = true;
            }
            inc = 1;
            post.dislikes[userUid] = true;
          }
        }
        return post;
      });
      return inc;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description upvotes a comment in RTDB
 * 
 * @param {string} commentKey the key of the comment doc in Firestore to upvote
 * @returns either +1 or -1 depending on the user's previous like/dislike value(s)
 */
export const upVoteComment = async (commentKey: string) => {
  try {
    if (db && database && auth && auth.currentUser) {
      let inc = null;
      const userUid = auth.currentUser.uid;
      const likesRef = rtdbRef(database, commentKey);
      await rtdbRunTransaction(likesRef, (post) => {
        if (post && post.likes && post.dislikes) {
          if (post.likes[userUid]) { // if liked before
            post.likes[userUid] = null;
            inc = -1;
          } else {
            if (!post.likes) {
              post.likes = {};
            }
            if (post.dislikes[userUid]) { // if disliked before
              post.dislikes[userUid] = null;
            }
            inc = 1;
            post.likes[userUid] = true;
          }
        }
        return post;
      });
      return inc;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description loads comments of a specific post from Firestore
 * 
 * @param {string} postKey 
 * @param {string} schoolName 
 * 
 * @returns {Promise<{comments: {key: string;}[]; lastKey: string;} | undefined>} an object with the comments array and a string signifying the last loaded comment or undefined.
 */
export const loadCommentsNew = async (postKey: string, schoolName: string): Promise<{ comments: { key: string; }[]; lastKey: string; } | undefined> => {
  try {
    if (auth && auth.currentUser) {
      const commentsRef = collection(
        db,
        "schoolPosts",
        schoolName.replace(/\s+/g, ""),
        "allPosts",
        postKey,
        "comments"
      );
      const q = query(commentsRef, orderBy("timestamp", "asc"), limit(10));
      const querySnapshot = await getDocs(q);
      let comments = [];
      let lastKey = "";
      const docs = querySnapshot.docs;
      for (const doc of docs) {
        comments.push({
          ...doc.data(),
          key: doc.id,
        });
        lastKey = doc.data().timestamp;
      }
      return { comments, lastKey };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description loads the next batch of comments (10) for a corresponding post.
 * 
 * @param {string} postKey 
 * @param {string} schoolName 
 * @param {any} key
 * 
 * @returns {Promise<{comments: {key: string;}[]; lastKey: string;} | undefined>} an object with the new batch of comments array and a string signifying the last loaded comment or undefined.
 */
export const loadCommentsNewNextBatch = async (postKey: string, schoolName: string, key: any): Promise<{ comments: { key: string; }[]; lastKey: string; } | undefined> => {
  try {
    if (auth && auth.currentUser) {
      const commentsRef = collection(
        db,
        "schoolPosts",
        schoolName.replace(/\s+/g, ""),
        "allPosts",
        postKey,
        "comments"
      );
      const q = query(commentsRef, orderBy("timestamp", "asc"), startAfter(key), limit(10));
      const querySnapshot = await getDocs(q);
      let comments = [];
      let lastKey = "";
      const docs = querySnapshot.docs;
      for (const doc of docs) {
        comments.push({
          ...doc.data(),
          key: doc.id,
        });
        lastKey = doc.data().timestamp;
      }
      return { comments, lastKey };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description deletes a post from Firestore.
 * Also deletes image(s) (if any) and the likes/dislikes doc from RTDB
 * 
 * @param {string} postKey 
 * @param {string} schoolName 
 * @param {any[]} postUrl 
 * 
 * @returns {Promise<boolean | undefined>} whether the post was successfully deleted from Firestore or undefined
 */
export const removePost = async (postKey: string, schoolName: string, postUrl: any[]): Promise<boolean | undefined> => {
  try {
    console.log(postKey);
    console.log(schoolName)
    console.log(postUrl);
    if (postUrl.length > 0) {
      for (let i = 0; i < postUrl.length; ++i) {
        deleteImage({ // cloud function to delete images attached to post
          path: postUrl[i]
        }).catch((err) => {
          console.log(err);
        });
      }
    }
    deleteLikesDocFromRtdb({ // cloud function to delete rtdb document containing likes information
      key: postKey
    });
    deleteCommentsFromDeletedPost({ // cloud function to delete all comments made on post
      key: postKey,
      schoolName: schoolName.replace(/\s+/g, ""),
    });

    const postRef = doc(
      db,
      "schoolPosts",
      schoolName.replace(/\s+/g, ""),
      "allPosts",
      postKey
    );
    await deleteDoc(postRef).catch((err) => { console.log(err); });
    return true;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description reports a post and sends corresponding email to user and admin
 * 
 * @param {string} message 
 * @param {string} schoolName 
 * @param {string} postKey 
 * 
 * @returns {Promise<boolean | undefined>} whether the report was successfully sent or undefined
 */
export const sendReportStatus = async (message: string, schoolName: string, postKey: string): Promise<boolean | undefined> => {
  try {
    if (auth && auth.currentUser) {
      const userUid = auth.currentUser.uid;
      const userEmail = auth.currentUser.email;
      console.log({ message })
      console.log({ schoolName })
      console.log({ postKey })
      let school = schoolName.replace(/\s+/g, "");
      const postDocRef = doc(
        db,
        "schoolPosts",
        school,
        "allPosts",
        postKey
      );
      await updateDoc(postDocRef, {
        reports: increment(1)
      }).catch((err) => {
        console.log(err);
      });

      sendEmailOnReport({ // cloud function to send email to me when someone reports a post
        key: postKey,
        reporterUid: userUid,
        reporterEmail: userEmail,
        schoolName: school,
        message: message
      }).catch((err) => {
        console.log(err);
      });
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * @description Uploads an image to Firestore storage.
 * 
 * @param {string} location path in Firestore storage where the image is being uploaded
 * @param {any} blob bytes of the image
 * @param {string} url basename of location in Firestore storage
 * 
 * @returns {Promise<boolean | undefined>} whether the image was uploaded successfully or undefined
 */
export async function uploadImage(location: string, blob: any, url: string): Promise<boolean | undefined> {
  try {
    const currentUserUid = auth!.currentUser!.uid;
    const storageRef = ref(
      storage,
      location + "/" + currentUserUid.toString() + url
    );

    const res = await uploadBytes(storageRef, blob)
      .then((snapshot) => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * @description calls cloud function to delete a comment from a post.
 * This will remove image(s) (if any) and likes/dislikes doc from RTDB
 * 
 * @param {any} comment 
 * @param {string} schoolName 
 * @param {string} postKey 
 * @param {string} commentUrl 
 * 
 * @returns {Promise<boolean | undefined>} whether the comment was successfully removed from the database or undefined
 */
export const removeCommentNew = async (comment: any, schoolName: string, postKey: string, commentUrl: string): Promise<boolean | undefined> => {
  try {
    if (db) {
      if (commentUrl.length > 0) {
        deleteImage({
          path: commentUrl
        }).catch((err) => {
          console.log(err);
        })
      }
      deleteLikesDocFromRtdb({
        key: comment.key,
      });
      const commentRef = doc(
        db,
        "schoolPosts",
        schoolName.replace(/\s+/g, ""),
        "allPosts",
        postKey,
        "comments",
        comment.key,
      );
      await deleteDoc(commentRef).catch((err) => { console.log(err); });
      const likesRef = rtdbRef(database, postKey);
      update(likesRef, {
        commentAmount: rtdbIncrement(-1)
      });
      return true;
    }
  } catch (err) {
    console.log(err);
  }
}


/**
 * @description submits poll to /schoolPosts/{schoolName}/allPosts
 * 
 * @param {string} pollText 
 * @param {any[]} pollOptions 
 * @param {string} schoolName 
 * @param {string} userName 
 * @param {string} userUid 
 * 
 * @returns {Promise<boolean | undefined>} whether the poll was successfully uploaded or undefined
 */
export const submitPollNew = async (pollText: string, pollOptions: any[], schoolName: string, userName: string, userUid: string): Promise<boolean | undefined> => {
  try {
    if (auth && db) {
      const pollsRef = collection(db, "schoolPosts", schoolName.replace(/\s+/g, ""), "allPosts");
      await addDoc(pollsRef, {
        question: pollText,
        options: pollOptions,
        userName: userName,
        timestamp: serverTimestamp(),
        message: "* UPDATE tellU TO SEE POLL *",
        votes: 0,
        voteMap: {},
        results: [0, 0, 0, 0, 0, 0],
        uid: userUid,
      }).catch((err) => {
        console.log(err);
        return false;
      });
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * @description Adds message to Firestore database in location /schoolPosts/{schoolName}/allPosts/{docId}.
 * Uploads images to Firebase storage if provided.
 * Sets likes document in RTDB to null values.
 * 
 * @param {string} mess 
 * @param {any} blob 
 * @param {string} id 
 * @param {any} pos 
 * @param {string} POI
 * @param {string} school 
 * @param {string} notificationsToken 
 * @param {string} postType 
 * @param {string} postClassName 
 * @param {string} postClassNumber 
 * @param {string} docId 
 * @returns boolean if message was successfully uploaded
 */
export const addMessage = async (mess: string, blob: any, id: string, pos: any, POI: string, school: string,
  notificationsToken: string, postType = "general", postClassName = "", postClassNumber = "", docId: string) => {
  try {
    if (auth.currentUser != null) {
      if (auth.currentUser.uid != null) {
        var name = auth.currentUser.displayName;
        var url = [];
        let lat = 0;
        let long = 0;
        let marker = false;
        let imgSources = [];
        if (blob) {
          for (let i = 0; i < blob.length; ++i) {
            url.push("images/" + auth.currentUser.uid.toString() + id + i.toString());
            imgSources.push(blob[i]);
          }
        }
        if (pos) {
          marker = true;
        }
        await set(rtdbRef(database, docId), {
          likes: {
            'null': true
          },
          dislikes: {
            'null': true
          },
          commentAmount: 0,
        }).catch((err) => {
          console.log(err);
        });

        await setDoc(
          doc(db, "schoolPosts", school.replace(/\s+/g, ""), "allPosts", docId),
          {
            userName: name,
            timestamp: serverTimestamp(),
            message: mess,
            url: url,
            uid: auth.currentUser.uid,
            POI: POI,
            postType: postType,
            imgSrc: imgSources,
            marker: marker,
            notificationsToken: notificationsToken,
            className: postClassName,
            classNumber: postClassNumber,
            reports: 0,
          }
        ).catch((err) => {
          console.log(err);
        });

        return true;
      } else {
        console.log("uid missing");
        return false;
      }
    } else {
      console.log("currentUser missing");
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

/**
 * @description Gets the user's posts from Firestore
 * 
 * @param {string} schoolName the school the user goes to
 * @param {string} uid the user's uid 
 * 
 * @returns {Promise<{userPosts: { key: string;}[];lastKey: string;} | undefined>} an object with an array of the user's posts and the last key used for loading the next batch
 */
export const getUserPosts = async (schoolName: string, uid: string): Promise<{ userPosts: { key: string; }[]; lastKey: string; } | undefined> => {
  try {
    if (db) {
      const userPostsRef = collection(db, "schoolPosts", schoolName.replace(/\s+/g, ""), "allPosts");
      const q = query(userPostsRef, orderBy("timestamp", "desc"), where("uid", "==", uid), limit(5));
      const qSnap = await getDocs(q);
      let userPosts = [];
      let lastKey = "";
      const docs = qSnap.docs;
      for (const doc of docs) {
        userPosts.push({
          ...doc.data(),
          key: doc.id,
        });
        lastKey = doc.data().timestamp;
      }
      return { userPosts, lastKey };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Loads the next 5 user posts from Firestore
 * 
 * @param {string} schoolName 
 * @param {string} uid 
 * @param {string} key 
 * 
 * @returns {Promise<{userPosts: { key: string;}[];lastKey: string;} | undefined>} an object with the new batch array of the user's posts and the last key used for loading the next batch
 */
export const getNextBatchUserPosts = async (schoolName: string, uid: string, key: string): Promise<{ userPosts: { key: string; }[]; lastKey: string; } | undefined> => {
  try {
    if (db) {
      const userPostsRef = collection(db, "schoolPosts", schoolName.replace(/\s+/g, ""), "allPosts");
      const q = query(userPostsRef, orderBy("timestamp", "desc"), where("uid", "==", uid), startAfter(key), limit(5));
      const qSnap = await getDocs(q);
      let userPosts = [];
      let lastKey = "";
      const docs = qSnap.docs;
      for (const doc of docs) {
        userPosts.push({
          ...doc.data(),
          key: doc.id,
        });
        lastKey = doc.data().timestamp;
      }
      return { userPosts, lastKey };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Gets the user's data from Firestore in /userData/{uid}
 * Data includes displayName, email, photoURL, uid, school, and socials
 * 
 * @param {string} uid the user's uid used as the document id in Firestore
 * 
 * @returns {Promise<{ key: any;} | undefined>} the user's data from Firestore
 */
/* export const getUserData = async (uid: string): Promise<{ key: any; } | undefined> => {
  try {
    if (auth && db) {
      const usersRef = doc(db, "userData", uid.toString());
      const res = await getDoc(usersRef);
      if (res.exists()) {
        return { ...res.data(), key: usersRef.id}
      }
    }
  } catch (err) {
    console.log(err);
  }
};
*/

/**
 * Retrieves the last 50 posts that have and a class name of className
 * 
 * @param {string} className 
 * @param {string} schoolName name of school to check for
 * 
 * @returns {Promise<{ key: string;}[] | undefined>} the posts array
 */
export const getClassPostsDb = async (className: string, schoolName: string): Promise<{ key: string; }[] | undefined> => {
  try {
    if (auth && db) {
      console.log(schoolName)
      const allPostsRef = collection(db, "schoolPosts", schoolName.replace(/\s+/g, ""), "allPosts");
      const q = query(allPostsRef, where("className", "==", className), orderBy("timestamp", "desc"), limit(50));
      const qSnapshot = await getDocs(q);
      let classPosts = [];
      const docs = qSnapshot.docs;
      for (const doc of docs) {
        classPosts.push({
          ...doc.data(),
          key: doc.id
        });
      }
      return classPosts;
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description loads the next 10 liked posts of a specific user from Firestore
 * 
 * @param {string} uid 
 * @returns an object with an array of the user's liked posts and the last key used for loading the next batch
 */
export const getUserLikedPosts = async (uid: string) => {
  try {
    const userLikesRef = collection(db, "userData", uid, "likes");
    const q = query(userLikesRef, orderBy("likeTimestamp", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    let userLikes = [];
    let lastKey = "";
    const docs = querySnapshot.docs;
    for (const doc of docs) {
      userLikes.push({
        ...doc.data(),
        key: doc.id,
      });
      lastKey = doc.data().likeTimestamp;
    }
    return { userLikes, lastKey };
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description locates profile photo of user location in Firebase storage.
 * 
 * @param {string} userUid 
 * 
 * @returns {Promise<string>} url of the user's profile picture
 */
export const getUserPhotoUrl = async (userUid: string): Promise<string> => {
  try {
    const url = await getDownloadURL(ref(storage, "profilePictures/" + userUid + "photoURL"));
    return url;
  } catch (err) {
    console.log(err);
    return "";
  }
}

/**
 * Retrieves the last 50 posts that have a flair of postType
 * 
 * @param {string} postType post flairs: GENERAL, ALERT, SIGHTING, DINING, HOUSING, BUY/SELL, EVENT
 * @param {string} schoolName name of school to check for
 * 
 * @returns array of posts
 */
export const getPostTypeDb = async (postType: string, schoolName: string) => {
  try {
    if (auth && db) {
      const allPostsRef = collection(db, "schoolPosts", schoolName.replace(/\s+/g, ""), "allPosts");
      const q = query(allPostsRef, where("postType", "==", postType), orderBy("timestamp", "desc"), limit(50));
      const qSnapshot = await getDocs(q);
      let classPosts = [];
      const docs = qSnapshot.docs;
      for (const doc of docs) {
        classPosts.push({
          ...doc.data(),
          key: doc.id
        });
      }
      return classPosts;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description pulls data from Firestore "/userData/{uid}}"
 * 
 * @returns {Promise<DocumentData | undefined>} the current user's data from Firestore
 */
export const getCurrentUserData = async (): Promise<DocumentData | undefined> => {
  try {
    if (db && auth && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDoc = doc(db, "userData", uid);
      const res = await getDoc(userDoc);
      if (res.exists()) {
        return res.data();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description send DM to user and call notification function in backend
 * 
 * @param {string} chatroomString 
 * @param {string} notificationsToken 
 * @param {string} message 
 * @param {string} contactUid 
 */
export const sendDm = async (chatroomString: string, notificationsToken: string, message: string, contactUid: string) => {
  try {
    if (auth && db) {
      console.log('sending dm to ', notificationsToken);
      console.log(notificationsToken);
      const userName = auth!.currentUser!.displayName;
      const senderUid = auth!.currentUser!.uid;
      if (message.length == 0) {
        message = "[picture]"
      }
      sendDmNotification({
        userName: userName,
        notificationsToken: notificationsToken,
        message: message,
        posterUid: contactUid,
        data: {
          url: "/chatroom/" + chatroomString
        },
        icon: "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/FCMImages%2FtellU_hat_logo.png?alt=media&token=827e8b14-3c58-4f48-a852-7a22899416c9"
      })
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description updates the user's recent messages list in Firestore
 * 
 * @param {string} message 
 * @param {string} contactUid 
 * @param {string} contactUserName 
 */
export const updateDmList = async (message: string, contactUid: string, contactUserName: string) => {
  if (auth && db) {
    const uid = auth!.currentUser!.uid;
    const userName = auth!.currentUser!.displayName;
    const userPhoto = auth!.currentUser!.photoURL;
    const contactMessageCollectionRef = doc(db, "userData", contactUid, "messages", uid)
    const senderMessageCollectionRef = doc(db, "userData", uid, "messages", contactUid);
    let contactPhotoUrl = "";
    getDownloadURL(ref(storage, "profilePictures/" + contactUid + "photoURL")).then(async (url) => {
      contactPhotoUrl = url;
      await getDoc(contactMessageCollectionRef).then(async (res) => {
        if (res.exists()) {
          await updateDoc(contactMessageCollectionRef, {
            recent: message,
            photoURL: userPhoto,
            userName: userName,
            date: serverTimestamp(),
            read: false,
          }).catch((err) => {
            console.log(err);
            console.log("Error when updating contact message collection: ", contactUid);
          });
        } else {
          await setDoc(contactMessageCollectionRef, {
            recent: message,
            photoURL: userPhoto,
            contactUid: uid,
            userName: userName,
            date: serverTimestamp(),
            read: false
          }).catch((err) => {
            console.log(err);
            console.log("error when setting contact message collection: ", contactUid);
          })
        }
      });
      await getDoc(senderMessageCollectionRef).then(async (res) => {
        if (res.exists()) {
          console.log('setting sendermessagecollection')
          await updateDoc(senderMessageCollectionRef, {
            recent: message,
            date: serverTimestamp(),
            userName: contactUserName,
            photoURL: contactPhotoUrl,
            read: true,
          }).catch((err) => {
            console.log(err);
            console.log("error when updating sender message collection: ", uid);
          });
        } else {
          await setDoc(senderMessageCollectionRef, {
            recent: message,
            date: serverTimestamp(),
            contactUid: contactUid,
            userName: contactUserName,
            photoURL: contactPhotoUrl,
            read: true,
          }).catch((err) => {
            console.log(err);
            console.log("error when setting sender message collection: ", uid);
          });
        }
      });
    }).catch(async (err) => {
      console.log(err);
      contactPhotoUrl = "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/profilePictures%2F301-3012952_this-free-clipart-png-design-of-blank-avatar.png?alt=media&token=90117292-9497-4b30-980e-2b17986650cd"
      await getDoc(contactMessageCollectionRef).then(async (res) => {
        if (res.exists()) {
          await updateDoc(contactMessageCollectionRef, {
            recent: message,
            photoURL: userPhoto,
            userName: userName,
            date: serverTimestamp(),
            read: false,
          }).catch((err) => {
            console.log(err);
            console.log("Error when updating contact message collection: ", contactUid);
          });
        } else {
          await setDoc(contactMessageCollectionRef, {
            recent: message,
            photoURL: userPhoto,
            contactUid: uid,
            userName: userName,
            date: serverTimestamp(),
            read: false
          }).catch((err) => {
            console.log(err);
            console.log("error when setting contact message collection: ", contactUid);
          })
        }
      });
      await getDoc(senderMessageCollectionRef).then(async (res) => {
        if (res.exists()) {
          console.log('setting sendermessagecollection')
          await updateDoc(senderMessageCollectionRef, {
            recent: message,
            date: serverTimestamp(),
            userName: contactUserName,
            photoURL: contactPhotoUrl,
            read: true,
          }).catch((err) => {
            console.log(err);
            console.log("error when updating sender message collection: ", uid);
          });
        } else {
          await setDoc(senderMessageCollectionRef, {
            recent: message,
            date: serverTimestamp(),
            contactUid: contactUid,
            userName: contactUserName,
            photoURL: contactPhotoUrl,
            read: true,
          }).catch((err) => {
            console.log(err);
            console.log("error when setting sender message collection: ", uid);
          });
        }
      });
    });
    // if (!contactPhotoUrl || contactPhotoUrl.length == 0) {
    //   contactPhotoUrl = "https://firebasestorage.googleapis.com/v0/b/quantum-61b84.appspot.com/o/profilePictures%2F301-3012952_this-free-clipart-png-design-of-blank-avatar.png?alt=media&token=90117292-9497-4b30-980e-2b17986650cd"
    // }

  }
};

/**
 * @description updates the user's info in the firestore database.
 * 
 * @param {string} bio 
 * @param {string} instagram 
 * @param {string} major 
 * @param {string} snapchat 
 * @param {string} tiktok 
 * @param {string} spotifyUri 
 */
export const updateUserInfo = async (bio: string, instagram: string, major: string, snapchat: string, tiktok: string, spotifyUri: string) => {
  try {
    if (db && auth && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const batch = writeBatch(db);
      const userDocRef = doc(db, "userData", uid);
      if (!bio) { bio = ""; }
      if (!instagram) { instagram = ""; }
      if (!major) { major = ""; }
      if (!snapchat) { snapchat = ""; }
      if (!tiktok) { tiktok = ""; }
      if (!spotifyUri) { spotifyUri = "" }
      batch.update(userDocRef, {
        bio: bio,
        instagram: instagram,
        major: major,
        snapchat: snapchat,
        tiktok: tiktok,
        spotify: spotifyUri,
      });
      await batch.commit().catch((err) => console.log(err));
      return true;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Retrieves Spotify tracks based on a search query
 * Uses Spotify Web API
 * 
 * @param {string} query query to search for
 * @returns Top 25 Spotify tracks that match the query
 */
export const spotifySearch = async (query: string) => {
  try {
    console.log(query);
    const res: any = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials&client_id=' + REACT_APP_SPOTIFY_CLIENT_ID + '&client_secret=' + REACT_APP_SPOTIFY_SECRET_ID,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).catch((err) => {
      console.log(err);
    });
    console.log({ res });
    const data = await res.json().catch((err: any) => { console.log(err); });
    const token = data.access_token;
    spotifyApi.setAccessToken(token);
    console.log(spotifyApi.getAccessToken());
    console.log({ token });
    console.log({ data });
    const searchResults = await spotifyApi.search(query, ["track"], { limit: 20 });
    console.log({ searchResults });
    return searchResults!.tracks!.items;
  } catch (err) {
    console.error("UH OH");
    console.log(err);
  }
};

/**
 * @description Gets the current app version number from Firestore
 * 
 * @returns the version number, or null if not logged in :)
 */
export const getAppVersionNum = async () => {
  if (!db || !auth) {
    return null;
  }
  const versionDoc = await getDoc(doc(db, "appVersion", "versionNum"));
  if ("version" in versionDoc!.data()!) {
    return versionDoc!.data()!.version;
  }
  return '';
};

/**
 * @description Gets an array with the last 15 posts made at that POI.
 * 
 * @param {string} poiName Name of the POI
 * 
 */
export const getPOIPosts = async (poiName: string) => {
  try {
    if (auth && db) {
      const school = "CalPolyHumboldt"
      const q = query(collection(db, "schoolPosts", school, "allPosts"), where("POI", "==", poiName), orderBy("timestamp", "desc"), limit(15));
      const qSnapshot = await getDocs(q);
      let poiPosts = [];
      const docs = qSnapshot.docs;
      for (const doc of docs) {
        poiPosts.push({
          ...doc.data(),
          likes: { 'null': true },
          dislikes: { 'null': true },
          commentAmount: 0,
          key: doc.id
        });
      }
      return poiPosts;
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 * @description Gets the latest updates from the school's events page
 * Translates the .rss language into html.
 * 
 * @param {string} schoolName The name of the school to pull the events from.
 * 
 * @returns a string of html that contains the latest updates from the school's events page.
 */
export const getEvents = async (schoolName: string) => {
  let updates: any;

  if (schoolName === 'Cal Poly Humboldt') {
    updates = await getHumboldtUpdates().catch((err) => { console.log(err); });
  } else if (schoolName === 'UC Davis') {
    updates = await getUcDavisUpdates().catch((err) => { console.log(err); });
  } else if (schoolName === "UC Berkeley") {
    updates = await getUcBerkeleyUpdates().catch((err) => { console.log(err); });
  } else {
    console.log('Invalid school name');
  }
  let line = "", htmlString = "";
  let inLineTag = false;
  console.log(updates);
  let lines = updates.data.split('\n');
  for (let i = 0; i < lines.length; i++) {
    line = lines[i];
    if (inLineTag) {
      let title = line.indexOf("<title>");
      if (title !== -1) {
        let endTitle = line.indexOf("</title>");
        let titleStr = line.slice(title + 7, endTitle);
        htmlString += "<h1 class=\"events-h1\">" + titleStr + "</h1>";
        htmlString += '\n';
      }
      let desc = line.indexOf("<description>");
      if (desc !== -1) {
        let endDesc = line.indexOf("</description>");
        let descStr = line.slice(desc + 13, endDesc);
        let subString = "&lt;b&gt;Event Title";
        let index = descStr.indexOf(subString);
        if (index !== -1) {
          descStr = descStr.substring(0, index);
        }
        let subString2 = "&lt;b&gt;Organization"
        let index2 = descStr.indexOf(subString2);
        if (index2 !== -1) {
          descStr = descStr.substring(0, index2);
        }
        htmlString += "<div>" + descStr + "</div>";
        htmlString += '\n';
      }
      let link = line.indexOf("<link>");
      if (link !== -1) {
        let endLink = line.indexOf("</link>");
        let linkStr = line.slice(link + 6, endLink);
        htmlString += "<a class=\"event-a\" href='" + linkStr + "'>Read More</a>";
        htmlString += '\n';
      }
      let endItem = line.indexOf("</item>");
      if (endItem !== -1) {
        inLineTag = false;
      }
    }
    let n = line.indexOf("<item>");
    if (n !== -1) {
      inLineTag = true;
    }
  }
  // console.log(htmlString);

  return htmlString;
};


/**
 * @description Runs the backend AI code from openAI 
 * to generate a response.
 * 
 * @param {string} schoolName the name of the school 
 * @param {string} msg the question to ask the AI
 * @returns {string} the response from the AI
 */
export const testOpenAi = async (schoolName: string, msg: string) => {
  const answer: any = await askAI({
    message: msg
  }).catch((err) => {
    console.error(err);
    return '';
  });

  return answer.data.content.toString();
}

/**
 * @description Gets the user's data from Firestore in /userData/{uid}
 * Data includes displayName, email, photoURL, uid, school, and socials
 * 
 * @param {string} uid the user's uid used as the document id in Firestore
 * @returns the user's data from Firestore
 */
export const getUserData = async (uid: string) => {
  try {
    if (auth && db) {
      const usersRef = doc(db, "userData", uid.toString());
      const res = await getDoc(usersRef);
      if (res.exists()) {
        return { ...res.data(), key: doc.name }
      }
    }
  } catch (err) {
    console.log(err);
  }
};