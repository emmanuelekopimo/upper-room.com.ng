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

//Start site
const blogArea = document.querySelector("#blog-row");
const dailyVerseContent = document.querySelector("#daily-verse-content");
const dailyVerseRef = document.querySelector("#daily-verse-ref");
const dailyMotivationContent = document.querySelector(
  "#daily-motivation-content"
);
const dailyMotivationAuthor = document.querySelector(
  "#daily-motivation-author"
);

const loadPosts = async () => {
  const postsRef = collection(db, "posts");
  const postQuery = query(
    postsRef,

    orderBy("serial", "desc"),
    limit(3),
    where("visibility", "==", "public")
  );
  const querySnapshot = await getDocs(postQuery);
  querySnapshot.forEach(async (post) => {
    // doc.data() is never undefined for query doc snapshots
    let postData = post.data();
    let authorId = postData.authorId;
    let authorRef = doc(db, "admins", authorId);
    let authorObject = await getDoc(authorRef);
    let authorData = authorObject.data();
    let authorName = authorData.name;
    //Date
    // Set post date
    let postDate = new Date(postData.date.seconds * 1000);
    let weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let postDateStr = `${postDate.toLocaleString("default", {
      month: "short",
    })} ${postDate.getDate()}, ${postDate.getFullYear()} `;
    let postTemplate = `
                    <!-- Single Blog -->
                    <div class="single-news">
                        <div class="news-head">
                            <img src="${postData.cover}" alt="#">
                        </div>
                        <div class="news-body">
                            <div class="news-content">
                                <div class="date"><i class="fa fa-clock-o"></i> ${postDateStr}</div>
                                <h2><a href="./single.html?p=${post.id}">${postData.topic}</a></h2>
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

// Load daily verse content
const options = { method: "GET", headers: { accept: "application/json" } };

fetch("https://beta.ourmanna.com/api/v1/get?format=json&order=daily", options)
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    dailyVerseContent.innerText = response.verse.details.text;
    dailyVerseRef.innerText =
      response.verse.details.reference + " " + response.verse.details.version;
  })
  .catch((err) => console.error(err));

let nowDate = new Date();
let year = nowDate.getFullYear();
let month = nowDate.getMonth() + 1;
let day = nowDate.getDate();
let docName = `${year}-${month}-${day}`;
let motivationRef = doc(db, "motivations", docName);
let motivationObject = await getDoc(motivationRef);
let motivationData = motivationObject.data();
dailyMotivationContent.innerText = motivationData.text;
dailyMotivationAuthor.innerText = motivationData.author;

/*
const docRef = doc(db, "posts", "Q31mOlQn7oAE9lZu1Dju");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log(docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}*/
