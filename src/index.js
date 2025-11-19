import { render, h } from "./defs.js";

import { TheApp } from "./App.js";

function initApp() {
  render(h(TheApp), document.getElementById("app"));
}

initApp();
