import {
  Component,
  render,
  html,
  h,
  division_icons,
  divisions,
  division_types,
  grades
} from "./defs.js";

import { EditForm } from "./editor.js";

class Mark extends Component {
  render({ icon, color, action, title }) {
    return html`
      <a class="level-item" onclick=${action} title=${title}>
        <span
          class="icon is-small"
          style="${color ? "color:" + color + ";" : ""}"
        >
          <i class="fas ${icon}"></i>
        </span>
      </a>
    `;
  }
}

class Box extends Component {
  render({
    name,
    grade,
    division,
    type,
    bio,
    powers,
    image,
    filterAction,
    editCharacter
  }) {
    (name) || (name = 'bob');
    (grade) || (grade = 'red');
    (division) || (division = 'Soma');
    (type) || (type = 'Freak');
    
    return html`
      <div class="box animated fadeInDown" key=${name}>
        <article class="media">
          <div class="media-left">
            <figure class="image is-128x128" style="overflow: hidden">
              <img src="${image}" alt="Image" class="is-rounded" />
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <h2 class="title is-4">${name}</h2>
              <p class="subtitle is-6 is-capitalized">${powers}</p>
              <p>${bio}</p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <${Mark}
                  icon="fa-exclamation-triangle"
                  color=${grades[grade]}
                  action=${() => filterAction("grade", grade)}
                  title=${grade}
                />
                <${Mark}
                  icon=${division_icons[division]}
                  action=${() => filterAction("division", division)}
                  title=${division}
                />
                <${Mark}
                  icon=${division_icons[type]}
                  action=${() => filterAction("type", type)}
                  title=${type}
                />
                <${Mark}
                  icon="fa-edit"
                  action=${() => editCharacter(name)}
                  title=${type}
                />
              </div>
            </nav>
          </div>
        </article>
      </div>
    `;
  }
}

class NPCList extends Component {
  render({ npcs, filterAction, ...props }, state) {
    return npcs.map(
      npc =>
        html`
          <${Box} ...${npc}, filterAction=${filterAction} ...${props} />
        `
    );
  }
}

class InfoPanel extends Component {
  render(props, state) {
    return html`
      <h2>Info Here</h2>
    `;
  }
}

class App extends Component {
  constructor() {
  super();
  this.state = { npcs: [], filter: false, editing: false };
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
    console.log(edit);
    let edited = { ...this.state.editing, ...edit };
    const idx = this.state.editIndex;
    const new_list = this.state.npcs.map(x => x); //copy the array
    new_list.splice(idx, 1, edited);
    this.setState({ npcs: new_list, editing: edited });
  }

  render(props, { npcs, ...state }) {
    const filterAction = (term, value) => this.setFilter(term, value);
    return html`
      <div class="level">
      <div class="level-left">
      <div class="level-item">
      <a onclick=${signOn}>sign on</a>
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

function signOn() {
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithRedirect(provider);
};

function initApp() {
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  }
  // The signed-in user info.
  var user = result.user;
  console.log('user: ');
  console.dir(user);
  console.log('token: ' + token);
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  console.log('code: ' + errorCode + ' message:' + errorMessage);
});
};

initApp();
