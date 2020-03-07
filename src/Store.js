import { createStore } from "/web_modules/unistore/full/preact.es.js";

export let store = createStore({
  npcs: [],
  user: null,
  names: null,
  img: null
});

export let myActions = {
  // Used for bootstrap, not used since moving to firebase
  loadData(state, src) {
    const url = src ? src : "npcs.json";
    fetch(url)
      .then(res => res.json())
      .then(npcs => store.setState({ npcs }));
  },
  async loadFirestoreData(state, force = false) {
    if (state.npcs.length > 0 && !force) return state;
    let querySnapShot = await firebase
      .firestore()
      .collection("characters")
      .get({ source: "server" });
    const characters = [];
    querySnapShot.forEach(doc => characters.push(doc.data()));
    // store.setState({ npcs: characters });
    characters.sort((a, b) => {
      return (
        new Date(b["last-edited-at"] || 0).getTime() -
          new Date(a["last-edited-at"] || 0).getTime() ||
        (a["affiliation"] || "").localeCompare(b["affiliation"] || "") ||
        (a["role"] || "").localeCompare(b["role"] || "") ||
        (a["name"] || "").localeCompare(b["name"] || "")
      );
    });
    return { npcs: characters };
  },
  async updateFireStore(state) {
    console.log("going to update the npc list to firebase...");
    return await Promise.all(
      state.npcs.map(npc => {
        let doc = firebase
          .firestore()
          .collection("characters")
          .doc(npc.name);
        // exclude some fields (local client state):
        let obj = { ...npc };
        delete obj.selected;
        return doc.set(obj, { merge: true });
      })
    )
      .then(() => console.log("uploaded all NPCs"))
      .catch(e => console.log("Errors uploading: ", e));
  },

  async loadNames(state) {
    let { default: get_names } = await import(
      "https://dotandimet.github.io/npc_names/names.js"
    );
    const names = get_names();
    store.setState({ names });
  },

  async commitEdit(state, edit, old_name) {
    try {
      // console.log(edit);
      let editIndex = state.npcs.findIndex(npc => npc.name === old_name);
      let editing = editIndex > -1 ? state.npcs[editIndex] : {};
      let edited = { ...editing, ...edit };
      // clean up undefined fields:
      for (let k in edited) {
        if (edited[k] === undefined) {
          edited[k] = "";
        }
      }
      // add info fields:
      edited["last-edited-by"] = state.user.displayName;
      edited["last-edited-at"] = new Date().toISOString();
      const new_list = state.npcs.map(x => x); //copy the array
      if (editIndex > -1) new_list.splice(editIndex, 1, edited);
      else new_list.push(edited);
      let doc = firebase
        .firestore()
        .collection("characters")
        .doc(edited.name);
      await doc.set(edited, { merge: true });
      console.log("updated ", edited.name, " in the cloud");
      if (old_name !== edited.name) {
        await firebase
          .firestore()
          .collection("characters")
          .doc(old_name)
          .delete();
        console.log("removed old entry ", old_name);
      }
      store.setState({ npcs: new_list });
    } catch (e) {
      console.log("Errors updating ", edit.name, ": ", e);
    }
  },
  async deleteCharacter(state, old_name) {
    try {
      const new_list = state.npcs
        .filter(npc => npc.name !== old_name)
        .map(x => x);
      await firebase
        .firestore()
        .collection("characters")
        .doc(old_name)
        .delete();
      console.log("removed old entry ", old_name);
      store.setState({ npcs: new_list });
    } catch (e) {
      console.log("Errors removing ", old_name, ": ", e);
    }
  },
  async addFieldToSelected(state, field, value) {
    store.setState({
      npcs: state.npcs.map(x => {
        if (x.selected) {
          x[field] = value;
        }
        return x;
      })
    });
  },
  toggleSelect(state, name) {
    return {
      npcs: state.npcs.map(x => {
        if (x.name === name) x.selected = !(x.selected || false);
        return x;
      })
    };
  },

  clear(state) {
    return {
      npcs: state.npcs.map(x => {
        x.selected = false;
        return x;
      })
    };
  },

  async setupAuthentication(state) {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          store.setState({ token: token });
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
          store.setState({ user: { displayName, email, photoURL, uid } });
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
        store.setState({ user: { displayName, email, photoURL, uid } });
      } else {
        // User is signed out.
        store.setState({ user: null });
      }
    });
  },

  async uploadImage(state, file) {
    try {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const imgRef = storageRef.child(`images/${file.name}`);
      await imgRef.put(file);
      const url = await imgRef.getDownloadURL();
      store.setState({ img: url });
    } catch (e) {
      console.log("Error in upload: ", e);
    }
  },
  resetImage(state) {
    return { img: null };
  }
};

store.subscribe(e => console.log(e));
