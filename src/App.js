import {
  Component,
  html
} from "./defs.js";

import { EditForm } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { NPCList } from "./Widgets.js";

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
      }
      catch(error) {
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
      };

    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged((user) => {
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
    if (this.state.filter && this.state.filter.term === term && this.state.filter.value === value) {
      this.setState({filter: false});
    }
    else {
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
    let querySnapShot = await this.db.collection('characters').get({source: 'server'})
    const characters = []
    querySnapShot.forEach((doc) => characters.push(doc.data()))
    this.setState({ npcs: characters })
  }

  editCharacter(name) {
    const editAtIndex = this.state.npcs.findIndex(npc => npc.name === name);
    const editThis = this.state.npcs[editAtIndex];
    this.setState({ editing: editThis, editIndex: editAtIndex });
  }

  commitEdit(e) {
    const edit = { [e.target.name]: e.target.value };
    // console.log(edit);
    let edited = { ...this.state.editing, ...edit };
    const idx = this.state.editIndex;
    const new_list = this.state.npcs.map(x => x); //copy the array
    new_list.splice(idx, 1, edited);
    this.setState({ npcs: new_list, editing: edited });
  }

  async updateFireStore() {
    console.log('going to update the npc list to firebase...');
    return await Promise.all( this.state.npcs.map( (npc) => {
      let doc = this.db.collection('characters').doc(npc.name);
      return doc.set(npc, { merge: true });
    } ) ).then( ()=> console.log('uploaded all NPCs') )
         .catch( (e) => console.log('Errors uploading: ', e) );
  }

  async endEdit(edit) {
    if (!this.state.editing) {
      return true;
    }
    try {
    // console.log(edit);
      let edited = { ...this.state.editing, ...edit };
      const idx = this.state.editIndex;
      const new_list = this.state.npcs.map(x => x); //copy the array
      new_list.splice(idx, 1, edited);
      let doc = this.db.collection('characters').doc(edited.name);
      await doc.set(edited, { merge: true });
      console.log('updated ', edited.name, ' in the cloud');
      this.setState({ npcs: new_list, editing: false });
    }
    catch(e) {
      console.log('Errors updating ', this.state.editing.name, ': ', e);
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
          <a onClick=${() => this.updateFireStore()}>Upload to Cloud</a>
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
          <h2 class="title is-capitalized" style="position: sticky">Cast
          </h2>
            <div class="mypanel">
            <${NPCList}
              npcs=${npcs}
              filterAction=${filterAction}
              editCharacter=${name => {
                this.editCharacter(name);
              }}
            />
           </div>
          ${state.filter &&
            html`
        <div class="column">
              <h2 class="title is-capitalized">
                ${state.filter.term}: ${state.filter.value}
              </h2>
              <div class="mypanel">
                <${NPCList}
                  filterAction=${filterAction}
                  npcs=${npcs.filter(
                    npc =>
                      !state.filter ||
                      npc[state.filter.term] === state.filter.value
                  )}
                />
              </div>
        </div>
            `}
          ${state.editing &&
            html`
        <div class="column">
              <h2 class="title">Editing</h2>
              <div class="mypanel">
                <${EditForm}
                  ...${state.editing}
                  closeAction=${e => this.endEdit(e)}
                />
              </div>
        </div>
            `}
    </div>
  </section>
    `;
  }
}


