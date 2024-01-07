import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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

// Site start
const emailBox = document.querySelector(".email-box");
const passwordBox = document.querySelector(".pass-box");
const smallButton = document.querySelector(".small-button");
const errorText = document.querySelector("#error-code");

const logIn = () => {
  let email = emailBox.value;
  let password = passwordBox.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log(user);
      // Redirect user to dashboard
      location.href = "./index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, "::", errorMessage);
      // ..
      if (errorCode == "auth/invalid-credential") {
        errorText.innerText = "Invalid email or password";
      } else if (errorCode == "auth/network-request-failed") {
        errorText.innerText = "Network error. Reload page";
      }

      errorText.classList.toggle("hide", false);
    });
};

smallButton.addEventListener("click", logIn);
emailBox.addEventListener("click", (event) => {
  errorText.classList.toggle("hide", true);
});
passwordBox.addEventListener("click", (event) => {
  errorText.classList.toggle("hide", true);
});
