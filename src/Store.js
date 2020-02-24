import { createStore } from '/web_modules/unistore/full/preact.es.js';

export let store = createStore( { npcs: [], user: null, names: {'boys': ['Jayden'], 'girls': ['Holly']} } )

export let myActions = {
  // Used for bootstrap, not used since moving to firebase
  loadData(state, src) {
    const url = src ? src : "npcs.json";
    fetch(url)
      .then(res => res.json())
      .then(npcs => store.setState({ npcs }));
  },
  async loadFirestoreData(state, force=false) {
    if (state.npcs.length > 0 && ! force)
      return state;
    let querySnapShot = await firebase.firestore()
      .collection("characters")
      .get({ source: "server" });
    const characters = [];
    querySnapShot.forEach(doc => characters.push(doc.data()));
    // store.setState({ npcs: characters });
    return { npcs: characters };
  },
  async updateFireStore(state) {
    console.log("going to update the npc list to firebase...");
    return await Promise.all(
      state.npcs.map(npc => {
        let doc = this.db.collection("characters").doc(npc.name);
        return doc.set(npc, { merge: true });
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
  }

};

export let editActions = {

  async commitEdit(state, edit) {
    try {
      // console.log(edit);
      let editIndex = state.npcs.findIndex((npc)=>npc.name === edit.name)
      let editing = (editIndex > -1) ? state.npcs[editIndex] : {}
      let edited = { ...editing, ...edit };
      // clean up undefined fields:
      for (let k in edited) {
        if (edited[k] === undefined) {
          edited[k] = "";
        }
      }
      // add info fields:
//      edited["last-edited-by"] = state.user.displayName;
      edited["last-edited-at"] = new Date().toISOString();
      const new_list = state.npcs.map(x => x); //copy the array
      if (editIndex > -1)
        new_list.splice(editIndex, 1, edited);
      else
        new_list.push(edited);
      let doc = firebase.firestore().collection("characters").doc(edited.name);
      await doc.set(edited, { merge: true });
      console.log("updated ", edited.name, " in the cloud");
      store.setState({ npcs: new_list });
    } catch (e) {
      console.log("Errors updating ", edit.name, ": ", e);
    }
  }

};
/*
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

*/



