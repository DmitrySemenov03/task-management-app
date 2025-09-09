import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd3nE5AIx_vHl3NcSMD5qSTCyZMlrqdgA",
  authDomain: "task-management-app-65879.firebaseapp.com",
  projectId: "task-management-app-65879",
  storageBucket: "task-management-app-65879.firebasestorage.app",
  messagingSenderId: "689764902992",
  appId: "1:689764902992:web:293dd0570d8685fcdec955",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
