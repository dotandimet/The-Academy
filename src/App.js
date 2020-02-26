import { Component, html } from "./defs.js";

import { EditForm, NamePicker } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { CastList, InfoPanel } from "./Widgets.js";
import { Link, Switch, Route } from "/web_modules/wouter-preact.js";
import { store, myActions } from "./Store.js";
import { Provider, connect } from "/web_modules/unistore/full/preact.es.js";

class App extends Component {
  componentDidMount() {
    // this.loadData();
    this.props.setupAuthentication();
    this.props.loadFirestoreData();
  }

  render({ user, npcs, ...props }) {
    return html`
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <${SignOnWidget} user=${user} />
          </div>
          <div class="level-item">
            <button onClick=${() => this.updateFireStore()} class="button">
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
          <div class="level-item">
            ${npcs.filter(x => x.selected).length} Selected
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
                ...${props}
              />
          <//>
          <${Route} path="/about/:section/:topic">
            ${params => {
              return html`
                <${InfoPanel}
                  npcs=${npcs}
                  section=${params.section}
                  topic=${params.topic}
                  ...${props}
                />
              `;
            }}
          <//>
          <${Route} path="/edit">
          <${NamePicker} />
          <//>
          <${Route} path="/edit/:name">
            ${params => {
              const name = decodeURIComponent(params.name);
              return html`
                <h2 class="title">Editing ${name}</h2>
                <${EditForm}
                  ...${npcs.find(npc => npc.name === name) || { name }}
                />
              `;
            }}
          <//>
        </Switch>
        </div>
      </section>
    `;
  }
}

const MyApp = connect(["npcs", "user"], myActions)(App);

export const TheApp = () =>
  html`
    <${Provider} store=${store}><${MyApp} /><//>
  `;
