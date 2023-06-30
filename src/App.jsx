import "./App.css";
import { useEffect, useRef, useState } from "react";

//firebase imports
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

////////////////////////////////////////////////////////////////////////////////

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh14I6UAVGDYC10lMl4d2MqiSM34he1i4",
  authDomain: "fir-9-5cbcc.firebaseapp.com",
  projectId: "fir-9-5cbcc",
  storageBucket: "fir-9-5cbcc.appspot.com",
  messagingSenderId: "364261457395",
  appId: "1:364261457395:web:67431caa838b001e98e686",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection Ref
const colRef = collection(db, "books");

// query
const q = query(colRef, orderBy("createdAt")); // query (colRef , filtering , orderBy())

// realtime collection
let books = [];
onSnapshot(q, (snapShot) => {
  console.log(snapShot.docs);
  snapShot.docs.map((doc) => books.push({ ...doc.data(), id: doc.id })); // {added id by spreading data}
  console.log(books);
});

// Get a single document

// const getSingleDocument = async () => {
//   const docRef = doc(db, "books", "f5RBM66IklRE4vv8ZueW");
//   const snapShot = await getDoc(docRef);
//   console.log(snapShot.data(), snapShot.id);
// };
// getSingleDocument();

// Get a single document with Real-time
const docRef = doc(db, "books", "f5RBM66IklRE4vv8ZueW");
onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

////////////////////////////////////////////////////////////////////////////////

const App = () => {
  const addForm = useRef();
  const deleteForm = useRef();
  const updateForm = useRef();
  const signUpForm = useRef();
  const logInForm = useRef();

  const [isLogIn, setIsLogIn] = useState(Boolean);

  // adding document
  const addFormHandler = (e) => {
    e.preventDefault();
    addDoc(colRef, {
      title: addForm.current.title.value,
      author: addForm.current.author.value,
      createdAt: serverTimestamp(),
    });
    addForm.current.reset();
    // console.log(addForm.current.author.value);
    // console.log(addForm.current.title.value);
  };

  // deleting document
  const deleteFormHandler = (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", deleteForm.current.idRef.value);
    deleteDoc(docRef);
    deleteForm.current.reset();
  };

  // updating document
  const updateFormHandler = (e) => {
    e.preventDefault();
    const docRef = doc(db, "books", updateForm.current.idRef.value);
    updateDoc(docRef, {
      title: updateForm.current.title.value,
      author: updateForm.current.author.value,
    });
  };

  // SignUpHandler
  const signUpHandler = async (e) => {
    e.preventDefault();
    const email = signUpForm.current.email.value;
    const password = signUpForm.current.password.value;

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("user singed up", user);
    signUpForm.current.reset();
  };

  //Log in handler
  const logInHandler = async (e) => {
    e.preventDefault();
    const email = logInForm.current.email.value;
    const password = logInForm.current.password.value;

    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log("user logged in", user);
  };

  //sign out handler
  const signOutHandler = () => {
    signOut(auth);
    console.log("user signed out");
  };

  //subscribing to auth changes
  onAuthStateChanged(auth, (user) => setIsLogIn(user));

  /////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div>
        <form ref={addForm} onSubmit={addFormHandler}>
          <label style={{ marginRight: "10px" }} htmlFor="cauthor">
            Author :
          </label>
          <input id="cauthor" type="text" name="author" />
          <label
            style={{ marginLeft: "10px", marginRight: "10px" }}
            htmlFor="ctitle"
          >
            Title :
          </label>
          <input type="text" id="ctitle" name="title" />
          <button style={{ marginLeft: "10px" }}>create a document</button>
        </form>
      </div>
      <div style={{ marginTop: "10px" }}>
        <form ref={updateForm} onSubmit={updateFormHandler}>
          <label style={{ marginRight: "10px" }} htmlFor="author">
            Author :
          </label>
          <input id="author" type="text" name="author" />
          <label
            style={{ marginLeft: "10px", marginRight: "10px" }}
            htmlFor="title"
          >
            Title :
          </label>
          <input type="text" id="title" name="title" />
          <label
            style={{ marginRight: "10px", marginLeft: "10px" }}
            htmlFor="id"
          >
            Document ID :
          </label>
          <input type="text" id="id" name="idRef" />
          <button style={{ marginLeft: "10px" }}>update a document</button>
        </form>
      </div>
      <div>
        <form
          style={{ marginTop: "10px" }}
          ref={deleteForm}
          onSubmit={deleteFormHandler}
        >
          <label style={{ marginRight: "10px" }} htmlFor="id">
            Document ID :
          </label>
          <input type="text" id="id" name="idRef" />
          <button style={{ marginLeft: "10px" }}>delete a book</button>
        </form>
      </div>
      <br />
      <hr />
      <br />
      <div style={{ marginTop: "10px" }}>
        <form ref={signUpForm} onSubmit={signUpHandler}>
          <div>
            <input name="email" type="email" placeholder="email" />
          </div>
          <div style={{ marginTop: "10px" }}>
            <input
              name="password"
              type="password"
              placeholder="enter your password"
            />
          </div>
          <button style={{ marginTop: "10px" }}>Sign up</button>
        </form>
      </div>
      <div style={{ marginTop: "10px" }}>
        <form ref={logInForm} onSubmit={logInHandler}>
          <div>
            <input name="email" type="email" placeholder="email" />
          </div>
          <div style={{ marginTop: "10px" }}>
            <input
              name="password"
              type="password"
              placeholder="enter your password"
            />
          </div>
          <button style={{ marginTop: "10px" }}>Log in</button>
        </form>
      </div>
      <button style={{ marginTop: "10px" }} onClick={signOutHandler}>
        Sign out
      </button>
      <div>{isLogIn ? "true" : "false"}</div>
    </>
  );
};

export default App;
