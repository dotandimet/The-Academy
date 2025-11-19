import { Component, html } from "./defs.js";
import { auth } from "./firebase.js";
import { signOut, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

export class SignOnWidget extends Component {
  async toggleSignIn() {
    if (!auth.currentUser) {
      // [START createprovider]
      const provider = new GoogleAuthProvider();
      // provider.addScope('https://www.googleapis.com/auth/plus.login');
        await signInWithRedirect(auth, provider);
    } else {
        await signOut(auth);
    }
  }

  render({ user }, state, context) {
    if (user === null) {
      return html`
        <button class="button" onclick=${this.toggleSignIn}>
          Sign in with Google ID
        </button>
      `;
    } else {
      return html`
        <button class="button" onclick=${this.toggleSignIn}>
          <img class="image is-48x48" src=${user.photoURL} />
          Sign out ${user.displayName}
        </button>
      `;
    }
  }
}
