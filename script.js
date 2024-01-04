// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Start site
const blogArea = document.querySelector("#blog-row");

const loadPosts = async () => {
  const postsRef = collection(db, "posts");
  const postQuery = query(postsRef, orderBy("serial", "desc"), limit(3));
  const querySnapshot = await getDocs(postQuery);
  querySnapshot.forEach(async (post) => {
    // doc.data() is never undefined for query doc snapshots
    let postData = post.data();
    let authorId = postData.author_id;
    let authorRef = doc(db, "admins", authorId);
    let authorObject = await getDoc(authorRef);
    let authorData = authorObject.data();
    let authorName = authorData.name;
    let postTemplate = `
                    <!-- Single Blog -->
                    <div class="single-news">
                        <div class="news-head">
                            <img src="${postData.cover}" alt="#">
                        </div>
                        <div class="news-body">
                            <div class="news-content">
                                <div class="date">1st Jan, 2024</div>
                                <h2><a href="#">${postData.topic}</a></h2>
                                <p class="text">${authorName}
                                </p>

                            </div>
                        </div>
                    </div>
                    <!-- End Single Blog -->
                `;
    let postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-md-6 col-12";
    postElement.id = post.id;
    postElement.innerHTML = postTemplate;
    blogArea.append(postElement);
  });
};

loadPosts();
/*
const docRef = doc(db, "posts", "Q31mOlQn7oAE9lZu1Dju");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log(docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}*/
