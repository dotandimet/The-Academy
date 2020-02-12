import { Component, html } from "./defs.js";

export class SignOnWidget extends Component {

  toggleSignIn() {
    if (!firebase.auth().currentUser) {
      // [START createprovider]
      var provider = new firebase.auth.GoogleAuthProvider();
      // provider.addScope('https://www.googleapis.com/auth/plus.login');
      firebase.auth().signInWithRedirect(provider);
    } else {
      firebase.auth().signOut();
    }
  }

  render({ user }, state, context) {
    if (user === null) {
      return html`
        <button class="button"
         onclick=${this.toggleSignIn}>
         Sign in with Google ID</button>`
    }
    else {
    return html`
      <button class="button"
      onclick=${this.toggleSignIn}>
      <img class="image is-48x48" src=${user.photoURL} />
      Sign out ${user.displayName}
      </button>
    `;
    }
  }
}
