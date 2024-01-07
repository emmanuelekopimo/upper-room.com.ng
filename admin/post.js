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
  const postsRef = collection(db, "posts");
  const postQuery = query(postsRef, orderBy("serial", "desc"));
  const querySnapshot = await getDocs(postQuery);

  querySnapshot.forEach(async (post) => {
    // doc.data() is never undefined for query doc snapshots
    let postData = post.data();
    let authorId = postData.authorId;
    let authorRef = doc(db, "admins", authorId);
    let authorObject = await getDoc(authorRef);
    let authorData = authorObject.data();
    let authorName = authorData.name;
    let postTemplate = `
                <td>12/20/23</td>
                <td>
                ${postData.topic}
                </td>
                <td>
                ${authorName}
                </td>
                <td>
                ${postData.visibility == "public" ? "Posted" : "Draft"}
                </td>
                <td>
                <button type="button" class="btn btn-success btn-xs">View</button>
                ${
                  postData.authorId == user.uid
                    ? '<button type="button" class="btn btn-success btn-xs">Edit</button>'
                    : ""
                }
                </td>
                <td>
                ${postData.serial}
                </td>
                `;
    let postElement = document.createElement("tr");
    postElement.id = post.id;
    postElement.innerHTML = postTemplate;
    contentArea.append(postElement);
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
