// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDphVlbaAALzt-979zEf1EzmmGQOtt09Ig",
  authDomain: "raghu-interior-app.firebaseapp.com",
  projectId: "raghu-interior-app",
  storageBucket: "raghu-interior-app.firebasestorage.app",
  messagingSenderId: "416958144707",
  appId: "1:416958144707:web:efa97428914dee11acc276"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Auth instance
export const auth = getAuth(app);

