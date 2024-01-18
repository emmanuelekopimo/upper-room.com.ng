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
const postArea = document.querySelector("#post-content");
const postTitle = document.querySelector("#post-title");
const authorName = document.querySelector("#author-name");
const authorName2 = document.querySelector("#author-name-2");
const postCover = document.querySelector("#post-cover");
const profileImage = document.querySelector("#profile-image");
const dateBox = document.querySelector("#post-date");

// Markdown converter
var converter = new showdown.Converter();

//Base64
var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = ((n & 3) << 4) | (r >> 4);
      u = ((r & 15) << 2) | (i >> 6);
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64;
      } else if (isNaN(i)) {
        a = 64;
      }
      t =
        t +
        this._keyStr.charAt(s) +
        this._keyStr.charAt(o) +
        this._keyStr.charAt(u) +
        this._keyStr.charAt(a);
    }
    return t;
  },
  decode: function (e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = (s << 2) | (o >> 4);
      r = ((o & 15) << 4) | (u >> 2);
      i = ((u & 3) << 6) | a;
      t = t + String.fromCharCode(n);
      if (u != 64) {
        t = t + String.fromCharCode(r);
      }
      if (a != 64) {
        t = t + String.fromCharCode(i);
      }
    }
    t = Base64._utf8_decode(t);
    return t;
  },
  _utf8_encode: function (e) {
    e = e.replace(/\r\n/g, "\n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  },
  _utf8_decode: function (e) {
    var t = "";
    var n = 0;
    var c2 = 0;
    var c1 = 0;
    var c3 = 0;
    var r = 0;
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++;
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
        n += 2;
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode(
          ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        n += 3;
      }
    }
    return t;
  },
};

//Params
var urlParams = new URLSearchParams(window.location.search);
var postId = urlParams.get("p"); // Table ID
console.log(postId);

const loadPosts = async () => {
  if (postId) {
    let postRef = doc(db, "posts", postId);
    let postObject = await getDoc(postRef);
    let postData = postObject.data();
    let name = postData.topic;

    // Set post topic in place
    document.title = name + " - Upper Room Gathering";
    postTitle.innerText = name;

    // Set author name
    let authorId = postData.authorId;
    let authorRef = doc(db, "admins", authorId);
    let authorObject = await getDoc(authorRef);
    let authorData = authorObject.data();
    authorName.innerText = authorData.name;
    authorName2.innerText = authorData.name;

    // Set profile image
    profileImage.src = authorData.image;

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
    let postDateStr = `${weekday[postDate.getDay()]}, ${postDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    )} ${postDate.getDate()}, ${postDate.getFullYear()} `;
    dateBox.innerText = postDateStr;

    //Set post cover
    postCover.src = postData.cover;
    let decodedPost = Base64.decode(postData.content);
    var html = converter.makeHtml(decodedPost);
    postArea.innerHTML = html;
  } else {
    location.href = "./404.html";
  }
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
