import { firebaseConfig } from "./firebase_config.js";

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

function initServices() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  return { app, auth, db, storage };
}

export const { app, auth, db, storage } = initServices();

