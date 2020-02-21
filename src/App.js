import { Component, html } from "./defs.js";

import { EditForm } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { CastList, InfoPanel } from "./Widgets.js";

export class TheApp extends Component {
  constructor() {
    super();
    this.state = { npcs: [], filter: false, editing: false, user: null };
    this.db = firebase.firestore();
  }

  componentDidMount() {
    // this.loadData();
    this.setupAuthentication();
    this.loadFirestoreData();
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

  setFilter(term, value) {
    // toggle off filter
    if (
      this.state.filter &&
      this.state.filter.term === term &&
      this.state.filter.value === value
    ) {
      this.setState({ filter: false });
    } else {
      this.setState({ filter: { term, value } });
    }
  }

  // Used for bootstrap, not used since moving to firebase
  loadData() {
    const url = this.props.src ? this.props.src : "npcs.json";
    fetch(url)
      .then(res => res.json())
      .then(npcs => this.setState({ npcs }));
  }

  async loadFirestoreData() {
    let querySnapShot = await this.db
      .collection("characters")
      .get({ source: "server" });
    const characters = [];
    querySnapShot.forEach(doc => characters.push(doc.data()));
    this.setState({ npcs: characters });
  }

  pickName(names = this.state.names) {
    let semi_rand = Date.now();
    let list = semi_rand % 2 == 0 ? "boys" : "girls";
    let index = semi_rand % 5;
    return names[list][index];
  }

  async addCharacter() {
    let { default: get_names } = await import(
      "https://dotandimet.github.io/npc_names/names.js"
    );
    const names = get_names();
    this.setState({ names });
    let name = this.pickName(names);
    let npcs_copy = this.state.npcs.map(x => x);
    npcs_copy.push({ name });
    this.setState({ npcs: npcs_copy }, () => this.editCharacter(name));
  }

  editCharacter(name) {
    const editAtIndex = this.state.npcs.findIndex(npc => npc.name === name);
    const editThis = Object.assign(
      this.state.npcs[editAtIndex],
      // fill in undefined fields in the character data itself:
      {
        bio: name,
        powers: name,
        division: "Soma",
        type: "Freak",
        grade: "Amber"
      }
    );
    this.setState({ editing: editThis, editIndex: editAtIndex });
  }

  async updateFireStore() {
    console.log("going to update the npc list to firebase...");
    return await Promise.all(
      this.state.npcs.map(npc => {
        let doc = this.db.collection("characters").doc(npc.name);
        return doc.set(npc, { merge: true });
      })
    )
      .then(() => console.log("uploaded all NPCs"))
      .catch(e => console.log("Errors uploading: ", e));
  }

  async abortEdit(e) {
    e.preventDefault();
    this.setState({ editing: false, editIndex: -1 });
  }

  async commitEdit(edit) {
    if (!this.state.editing) {
      return true;
    }
    try {
      // console.log(edit);
      let edited = { ...this.state.editing, ...edit };
      // clean up undefined fields:
      for (let k in edited) {
        if (edited[k] === undefined) {
          edited[k] = "";
        }
      }
      // add info fields:
      edited["last-edited-by"] = this.user.displayName;
      edited["last-edited-at"] = new Date().toISOString();
      const idx = this.state.editIndex;
      const new_list = this.state.npcs.map(x => x); //copy the array
      new_list.splice(idx, 1, edited);
      let doc = this.db.collection("characters").doc(edited.name);
      await doc.set(edited, { merge: true });
      console.log("updated ", edited.name, " in the cloud");
      this.setState({ npcs: new_list, editing: false });
    } catch (e) {
      console.log("Errors updating ", this.state.editing.name, ": ", e);
    }
  }

  render(props, { npcs, user, ...state }) {
    const filterAction = (term, value) => this.setFilter(term, value);
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
            <button onclick=${() => this.addCharacter()}>
              Add New Character
            </button>
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
          ${!state.filter &&
            !state.editing &&
            html`
              <${CastList}
                npcs=${npcs}
                filterAction=${filterAction}
                editCharacter=${name => {
                  this.editCharacter(name);
                }}
              />
            `}
          ${state.filter &&
            html`
              <${InfoPanel}
                npcs=${npcs}
                section=${state.filter.term}
                topic=${state.filter.value}
                filterAction=${filterAction}
              />
            `}
          ${state.editing &&
            html`
              <nav class="nav level">
                <a
                  class="level-item level-left"
                  onclick=${e => this.abortEdit(e)}
                  >cancel</a
                >
              </nav>
              <h2 class="title">Editing</h2>
              <${EditForm}
                ...${state.editing}
                closeAction=${e => this.commitEdit(e)}
              />
            `}
        </div>
      </section>
    `;
  }
}
