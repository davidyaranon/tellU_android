import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import auth from "./fbConfig";
import { Capacitor } from "@capacitor/core";

const AppUrlListener: React.FC<any> = () => {

  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (!loading) {
      if (Capacitor.getPlatform() === 'web') {
        history.push('https://apps.apple.com/us/app/tellu/id6443764288?ign-itscg=30200&ign-itsct=apps_box_link');
      } else {
        if (user) {
          App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            const domain = 'quantum-61b84.firebaseapp.com'
            const slug = event.url.split(domain);
            const path = slug.pop();
            if (path && (path.includes('post/') || path.includes('about/'))) {
              console.log('setting path to ' + path);
              history.push(path);
            }
          });
        }
      }
    }
  }, [loading, user]);

  return null;
};

export default AppUrlListener;