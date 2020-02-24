import { Component, html } from "./defs.js";

import { EditForm, NamePicker } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { CastList, InfoPanel } from "./Widgets.js";
import { Link, Switch, Route, useLocation } from "/web_modules/wouter-preact.js";
import { store, myActions } from './Store.js';
import { Provider, connect } from '/web_modules/unistore/full/preact.es.js';

class App extends Component {
  constructor() {
    super();
    this.state = { npcs: [], editing: false, user: null };
    this.db = firebase.firestore();
    const [location, setLocation] = useLocation();
    this.location = location;
    this.setLocation = setLocation;
  }

  componentDidMount() {
    // this.loadData();
    this.setupAuthentication();
    this.props.loadFirestoreData();
  }

  async setupAuthentication() {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          this.setState({ token: token });
        }
        // The signed-in user info.
        let user = result.user;
        if (user != null) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          this.setState({ user: { displayName, email, photoURL, uid } });
          console.log("Got user ", user.displayName);
          console.log("token: " + token);
        }
      }
    } catch (error) {
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
    }

    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        this.setState({ user: { displayName, email, photoURL, uid } });
      } else {
        // User is signed out.
        this.setState({ user: null });
      }
    });
  }

  render({ npcs }, { user, ...state }) {
    return html`
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <${SignOnWidget} user=${user} />
          </div>
          <div class="level-item">
            <button onClick=${() => this.updateFireStore()}>
              Upload to Cloud
            </button>
          </div>
          <div class="level-item">
            <${Link} href="/edit">
            <a class="button">
              Add New Character
            </a>
            <//>
          </div>
        </div>
      </nav>
      <section class="section">
        <div class="container">
          <h1 class="title">
            The Academy
          </h1>
          <p class="subtitle">
            Welcome to the premiere educational faucility for the Gifted
          </p>
        </div>
      </section>
      <section class="section">
        <div class="container">
        <${Switch}>
        <${Route} path="/">
              <${CastList}
                npcs=${npcs}
              />
          <//>
          <${Route} path="/about/:section/:topic">
            ${(params) => { return html`
              <${InfoPanel}
                npcs=${npcs}
                section=${params.section}
                topic=${params.topic}
              />
                `; }}
          <//>
          <${Route} path="/edit">
          <${NamePicker} />
          <//>
          <${Route} path="/edit/:name">
            ${(params) => {
              const name = decodeURIComponent(params.name)
              return html`
              <h2 class="title">Editing ${name}</h2>
              <${EditForm} ...${npcs.find(npc => npc.name === name) || { name }}
              />` }}
          <//>
        </Switch>
        </div>
      </section>
    `;
  }
}

const MyApp = connect(['npcs'], myActions)(App);

export const TheApp = (props) => html`<${Provider} store=${store}><${MyApp} /><//>`;
