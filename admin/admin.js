// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  endAt,
  getDocs,
  limit,
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Start site
const contentArea = document.querySelector("#content-area");

const loadPosts = async (user) => {
  const adminsRef = collection(db, "admins");
  const adminsQuery = query(adminsRef, orderBy("serial"));
  const querySnapshot = await getDocs(adminsQuery);

  querySnapshot.forEach(async (admin) => {
    // doc.data() is never undefined for query doc snapshots
    let adminData = admin.data();
    let adminTemplate = `
                    <td>${adminData.name}</td>
                    <td>
                    ${adminData.email}
                    </td>
                    <td>
                    ${adminData.type == "super" ? "Super Admin" : "Admin"}
                    </td>
                    <td>
                    ${adminData.id}
                    </td>
                `;
    let adminElement = document.createElement("tr");
    adminElement.id = admin.id;
    adminElement.innerHTML = adminTemplate;
    contentArea.append(adminElement);
  });
};
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    loadPosts(user);
  } else {
    // User is signed out
    location.href = "./login.html";
  }
});

/*
const docRef = doc(db, "posts", "Q31mOlQn7oAE9lZu1Dju");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log(docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}*/
