// IMPORTANT: replace these with your project's config
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, query, collection, orderBy, onSnapshot };
