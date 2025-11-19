import { Component, html } from "./defs.js";

import { EditForm, NamePicker, SectionTopic, Topic } from "./editor.js";
import { SignOnWidget } from "./SignOnWidget.js";
import { CastList, InfoPanel, NavBar } from "./Widgets.js";
import { Link, Switch, Route } from "wouter-preact";
import { store, myActions } from "./Store.js";
import { Provider, connect } from "unistore";

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
            <a onClick=${() => props.updateFireStore()} class="navbar-item">
              Upload to Cloud
            </a>
            <${Link} href="/edit">
            <a class="navbar-item">
              Add New Character
            </a>
            <//>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
            ${npcs.filter(x => x.selected).length} Selected
            </a>
           <div class="navbar-dropdown">
            <a class="navbar-item" onClick=${() => props.clear()}>
              Clear Selection
            </a>
            <${Link} href="/selection/edit">
            <a class="navbar-item">
              Tag selected characters
            </a>
            <//>
            </div>
          </div>
      <//>
      <section class="section">
        <div class="container">
        <${Switch}>
        <${Route} path="/">
        <div class="columns">
        <div class="column is-10 is-offset-1">
              <${CastList}
                npcs=${npcs}
                ...${props}
              />
        </div>
        </div>
          <//>
          <${Route} path="/about/:section/:topic">
            ${params => {
              return html`
                <${InfoPanel}
                  npcs=${npcs}
                  section=${decodeURIComponent(params.section)}
                  topic=${decodeURIComponent(params.topic)}
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
         <${Route} path="/selection/edit" component=${SectionTopic} />
         <${Route} path="/about" component=${Topic} />
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
