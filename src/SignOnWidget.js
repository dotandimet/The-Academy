import { Component, html } from "./defs.js";

export class SignOnWidget extends Component {
  constructor() {
    super();
    this.state = { user_name: "", user: null, token: null };
  }

  componentDidMount() {
    // Listening for auth state changes.
    const setState = args => this.setState(args);
    firebase
      .auth()
      .getRedirectResult()
      .then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          setState({ token: token });
        }
        // The signed-in user info.
        var user = result.user;
        setState({ user: user });
        console.log("user: ");
        console.dir(user);
        console.log("token: " + token);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(
          "code: " + errorCode + " message:" + errorMessage + " email: " + email
        );
      });
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        setState({ user_name: displayName });
      } else {
        // User is signed out.
        setState({ user_name: "" });
      }
    });
    // [END authstatelistener]
  }

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
    return html`
      <a onclick=${this.toggleSignIn}
        >${state.user_name
          ? "Sign out " + state.user_name
          : "Sign in with Google ID"}</a
      >
    `;
  }
}
