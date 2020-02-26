import { Component, html } from "./defs.js";

import { EditForm, NamePicker } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { CastList, InfoPanel, NavBar } from "./Widgets.js";
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
      <${NavBar}>
          <div class="navbar-item">
          <${SignOnWidget} user=${user} />
          </div>
            <a onClick=${() => this.updateFireStore()} class="navbar-item">
              Upload to Cloud
            </a>
            <${Link} href="/edit">
            <a class="navbar-item">
              Add New Character
            </a>
            <//>
          <a class="navbar-item">
            ${npcs.filter(x => x.selected).length} Selected
          </a>
      <//>
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
