import {
  h,
  Component,
  render
} from "https://unpkg.com/preact@10.2.1/dist/preact.module.js"; // 'https://unpkg.com/preact?module';
import htm from "https://unpkg.com/htm?module";

// Initialize htm with Preact
const html = htm.bind(h);

const division_icons = {
  Soma: "fa-child",
  Quick: "fa-running",
  Freak: "fa-biohazard",
  Mekhane: "fa-cog",
  Gremlin: "fa-wrench",
  Ghost: "fa-ghost",
  Psyche: "fa-brain",
  ESPer: "fa-heart-broken",
  Dominator: "fa-hand-holding-heart",
  Energia: "fa-sun",
  Torch: "fa-fire",
  Bolt: "fa-bolt",
  Mover: "fa-meteor",
  Daimon: "fa-hat-wizard",
  Oracle: "fa-crow",
  Channeler: "fa-cat"
};

const grades = {
  amber: "#cc9933",
  bronze: "#999933",
  red: "red",
  black: "black"
};

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
    image,
    filterAction
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
              ${name}
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
  render({ npcs, filterAction }, state) {
    return npcs.map(
      npc =>
        html`
          <${Box} ...${npc}, filterAction=${filterAction} />
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
  state = { npcs: [], filter: false };

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
  render(props, { npcs, ...state }) {
    console.log("In App - npcs=" + npcs);
    const filterAction = (term, value) => this.setFilter(term, value);
    return html`
      <div class="columns">
        <div class="column">
          <${NPCList} npcs=${npcs} filterAction=${filterAction} />
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
      </div>
    `;
  }
}
render(h(App), document.getElementById("app"));
