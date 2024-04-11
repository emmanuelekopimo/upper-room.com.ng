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

const createPrayers = async () => {
  const christianPrayers = [
    "Lord, guide us with your light and strengthen us with your grace.",
    "Heavenly Father, grant us peace in turmoil and hope in despair.",
    "Jesus, lead us in love, forgive our failings, and bless our endeavors.",
    "Holy Spirit, fill us with joy, inspire us with wisdom, and empower us.",
    "Lord, in your mercy, hear our prayers, guide our steps, and protect us.",
    "Heavenly Father, may your will be done in our lives, and your love be our guide.",
    "Jesus, grant us faith to overcome doubts, and courage to face challenges.",
    "Holy Spirit, dwell in us, comfort us in sorrow, and strengthen us in weakness.",
    "Lord, bless us with gratitude, kindness, and compassion for one another.",
    "Heavenly Father, may your presence be our peace, and your word our strength.",
    "Jesus, may your love be the light that guides us through darkness.",
    "Holy Spirit, empower us to be bearers of your truth, grace, and love.",
    "Lord, give us wisdom to discern your will and courage to follow it.",
    "Heavenly Father, may we find rest in your presence and peace in your promises.",
    "Jesus, may we reflect your love and mercy in all that we do.",
    "Holy Spirit, inspire us to live lives that honor and glorify you.",
    "Lord, grant us grace to forgive as you have forgiven us.",
    "Heavenly Father, help us to be instruments of your peace and agents of your healing.",
    "Jesus, strengthen our faith, deepen our love, and increase our hope.",
    "Holy Spirit, renew our minds, refresh our spirits, and revive our hearts.",
    "Lord, may your grace abound in us, your love surround us, and your peace fill us.",
    "Heavenly Father, guide us in paths of righteousness for your name's sake.",
    "Jesus, may we find refuge in your arms, and solace in your presence.",
    "Holy Spirit, empower us to be witnesses of your love and bearers of your truth.",
    "Lord, help us to see others with your eyes, and love them with your heart.",
    "Heavenly Father, grant us courage to stand firm in our faith, and compassion for all.",
  ];
  let countingDate = new Date();
  for (let i = 0; i < christianPrayers.length; i++) {
    let year = countingDate.getFullYear();
    let month = countingDate.getMonth() + 1;
    let day = countingDate.getDate();
    let docName = `${year}-${month}-${day}`;
    let text = christianPrayers[i];
    await setDoc(doc(db, "prayers", docName), {
      text: text,
      date: docName,
    });
    countingDate.setDate(countingDate.getDate() + 1);
  }
};

const motivationButton = document.querySelector("#motivation");
const prayerButton = document.querySelector("#prayers");

motivationButton.addEventListener("click", createTexts);
prayerButton.addEventListener("click", createPrayers);
