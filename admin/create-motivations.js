// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  endAt,
  getDocs,
  limit,
  where,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const createTexts = async () => {
  let nowDate = new Date();
  let countingDate = new Date();
  for (let i = 0; i < 90; i++) {
    countingDate.setDate(countingDate.getDate() + 1);
    let year = countingDate.getFullYear();
    let month = countingDate.getMonth() + 1;
    let day = countingDate.getDate();
    let docName = `${year}-${month}-${day}`;
    let seed = Math.trunc(Math.random() * 7268);
    fetch(`https://quote-garden.onrender.com/api/v3/quotes?page=${seed}`)
      .then((response) => response.json())
      .then(async (response) => {
        let text = response.data[0].quoteText;
        let author = response.data[0].quoteAuthor;
        await setDoc(doc(db, "motivations", docName), {
          author: author,
          text: text,
          date: docName,
        });
      });
  }
  console.log(countingDate);
};
