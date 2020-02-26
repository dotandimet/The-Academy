import { render, h } from "./defs.js";

import { firebaseConfig } from "./firebase_config.js";

import { TheApp } from "./App.js";

function initApp() {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  render(h(TheApp), document.getElementById("app"));
}

initApp();
