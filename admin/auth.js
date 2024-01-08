import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDo4TbGHKeaCvt4smFCr3JDLc6Fe9xzNI",
  authDomain: "upr-rm.firebaseapp.com",
  projectId: "upr-rm",
  storageBucket: "upr-rm.appspot.com",
  messagingSenderId: "160515986549",
  appId: "1:160515986549:web:bd235ecd3651ddaafc543c",
  measurementId: "G-56M9MCVEVJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Site start
const usernameText = document.querySelector(".user-name-text");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    let userRef = doc(db, "admins", user.uid);
    let userObject = await getDoc(userRef);
    let userData = userObject.data();
    let userName = userData.name;
    try {
      usernameText.innerText = userName;
    } catch {
      console.log("::Username field does not exist on this page");
    }
  } else {
    // User is signed out
    location.href = "./login.html";
  }
});
