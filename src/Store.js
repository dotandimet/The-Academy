import { createStore } from '/web_modules/unistore/full/preact.es.js';

export let store = createStore( { npcs: [], editing: false, user: null } )

export let myActions = {
  // Used for bootstrap, not used since moving to firebase
  loadData(state, src) {
    const url = src ? src : "npcs.json";
    fetch(url)
      .then(res => res.json())
      .then(npcs => store.setState({ npcs }));
  },
  async loadFirestoreData(state) {
    let querySnapShot = await firebase.firestore()
      .collection("characters")
      .get({ source: "server" });
    const characters = [];
    querySnapShot.forEach(doc => characters.push(doc.data()));
    store.setState({ npcs: characters });
  },
  editCharacter(state, name) {
    const editAtIndex = state.npcs.findIndex(npc => npc.name === name);
    const editThis = Object.assign(
      // fill in undefined fields in the character data itself:
      {
        bio: name,
        powers: name,
        division: "Soma",
        type: "Freak",
        grade: "Amber"
      },
      state.npcs[editAtIndex]
    );
    store.setState({ editing: editThis, editIndex: editAtIndex });
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



