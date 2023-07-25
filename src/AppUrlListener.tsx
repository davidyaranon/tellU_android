import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useEffect } from "react";
import { useHistory } from "react-router";

const AppUrlListener: React.FC<any> = () => {
  
  const history = useHistory();

  // useEffect(() => {
  //   App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
  //     const domain = 'quantum-61b84.firebaseapp.com'
  //     const slug = event.url.split(domain);
  //     const path = slug.pop();
  //     if (path) {
  //       history.push(path);
  //     }
  //   });
  // }, []);

  return null;
};

export default AppUrlListener;