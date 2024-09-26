import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNGuEEL2T87gD_YTM7l5hPSnMF8LOlsm0",
  authDomain: "daniweb-crm.firebaseapp.com",
  projectId: "daniweb-crm",
  storageBucket: "daniweb-crm.appspot.com",
  messagingSenderId: "919169768103",
  appId: "1:919169768103:web:77d2bfa7e81fbc304d9982"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);