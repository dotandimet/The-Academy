import {
  Component,
  render,
  html,
  h
} from "./defs.js";

import { EditForm } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { NPCList } from "./Widgets.js";

class App extends Component {
  constructor() {
    super();
    this.state = { npcs: [], filter: false, editing: false, user: null };
    this.db = firebase.firestore();
  }

  componentDidMount() {
    this.loadData();
  }

  setFilter(term, value) {
    this.setState({ filter: { term, value } });
  }

  clearFilter(term) {
    this.setState({ filter: false });
  }

  loadData() {
    const url = this.props.src ? this.props.src : "npcs.json";
    fetch(url)
      .then(res => res.json())
      .then(npcs => this.setState({ npcs }));
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

  updateFireStore() {
		alert('we love you', this.db);
		return Promise.all( this.npcs.map( (npc) => {
			let doc = this.db.collection('characters').doc(npc.name);
			return doc.set(npc, { merge: true });
		} ) ).then( ()=> console.log('uploaded all NPCs') )
				 .catch( (e) => console.log('Errors uploading: ', e) );
		console.log('going to update the npc list to firebase...');
	}
		
  render(props, { npcs, user, ...state }) {
    const filterAction = (term, value) => this.setFilter(term, value);
    return html`
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <${SignOnWidget} user=${user} />
          </div>
          <div class="level-item">
          <a onClick=${() => this.updateFireStore}>Upload to Cloud</a>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <h2 class="title is-capitalized">Cast</h2>
          <div class="mypanel">
            <${NPCList}
              npcs=${npcs}
              filterAction=${filterAction}
              editCharacter=${name => {
                this.editCharacter(name);
              }}
            />
          </div>
        </div>
        <div class="column">
          ${state.filter &&
            html`
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
            `}
        </div>
        <div class="column">
          ${state.editing &&
            html`
              <h2>Editing</h2>
              <div class="mypanel">
                <${EditForm}
                  ...${state.editing}
                  updateAction=${e => this.commitEdit(e)}
                />
              </div>
            `}
        </div>
      </div>
    `;
  }
}
render(h(App), document.getElementById("app"));

function initApp() {}

initApp();
