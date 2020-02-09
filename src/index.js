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
  state = { show: true };
  render({
    name = "Bob",
    grade = "red",
    division = "Soma",
    type = "Freak",
    bio = "",
    powers = "",
    image,
    filterAction,
    editCharacter
  }) {
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
              <h2 class="title">${name}</h2>
              <p class="subtitle">${powers}</p>
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
  state = { npcs: [], filter: false, editing: false };

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
      <div class="columns">
        <div class="column">
          <${NPCList}
            npcs=${npcs}
            filterAction=${filterAction}
            editCharacter=${name => {
              this.editCharacter(name);
            }}
          />
        </div>
        <div class="column">
          ${state.filter &&
            html`
              <h2 class="title is-capitalized">
                ${state.filter.term}: ${state.filter.value}
              </h2>
              <${NPCList}
                filterAction=${filterAction}
                npcs=${npcs.filter(
                  npc =>
                    !state.filter ||
                    npc[state.filter.term] === state.filter.value
                )}
              />
            `}
        </div>
        <div class="column">
          ${state.editing &&
            html`
              <h2>Editing</h2>
              <${EditForm}
                ...${state.editing}
                updateAction=${e => this.commitEdit(e)}
              />
            `}
        </div>
      </div>
    `;
  }
}
render(h(App), document.getElementById("app"));
