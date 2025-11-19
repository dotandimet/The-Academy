import { Component, html, toChildArray } from "./defs.js";
import { Link, useLocation } from "wouter-preact";
import { svg_icons } from "./icons.js";
import { useState } from "preact/hooks";

const icons = svg_icons("1.25rem", "#363636");

class Box extends Component {

  constructor(props) {
    super(props);
    this.state = { zoom: false };
  }

  render({
    name = "Todd",
    grade = "red",
    division = "Soma",
    type = "Freak",
    bio,
    powers,
    image,
    selected = false,
    affiliation,
    role,
    toggleSelect
  }, state ) {
    const path_prefix =
      (image || "").startsWith("/") || (image || "").startsWith("http")
        ? ""
        : "/";
    const zoom = state.zoom;
    const toggleZoom = () => this.setState({ zoom: !this.state.zoom });
    return html`
      <div class="tile is-parent is-4">
        <div class="tile is-child box animated fadeInDown" key=${name}>
          <article class="media">
            <div class="media-left">
              <figure class="image is-128x128" style="overflow: hidden">
                <img
                  src="${path_prefix}${image}"
                  alt="Image"
                  class="is-rounded"
                  onClick=${toggleZoom}
                />
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <h2 class="title is-4">${name}</h2>
                <p class="subtitle is-6 is-capitalized">${powers}</p>
                <p>${bio}</p>
              </div>
              <nav class="is-mobile">
                <div class="buttons has-addons">
                  <${Link} href="/about/affiliation/${affiliation}">
                    <a
                      title=${"Affiliation: " + affiliation}
                      class="button is-small level-item"
                      >${affiliation}
                    </a>
                  <//>
                  <${Link} href="/about/role/${role}">
                    <a
                      title=${"Affiliation: " + role}
                      class="button is-small level-item"
                      >${role}
                    </a>
                  <//>
                  <${Link} href="/about/grade/${grade}">
                    <a
                      title=${"Grade: " + grade}
                      class="button is-small level-item"
                    >
                      <${icons[grade]} />
                    </a>
                  <//>
                  <${Link} href="/about/division/${division}">
                    <a
                      title=${"Division: " + division}
                      class="button is-small level-item"
                    >
                      <${icons[division]} />
                    </a>
                  <//>
                  <${Link} href="/about/type/${type}">
                    <a
                      title=${"Type: " + type}
                      class="button is-small level-item"
                    >
                      <${icons[type]} />
                    </a>
                  <//>
                  <${Link} href="/edit/${name}">
                    <a title="Edit Me" class="button is-small level-item">
                      <${icons["Edit"]} />
                    </a>
                  <//>
                  <a
                    title=${selected ? "Selected" : "Select"}
                    onClick=${e => toggleSelect(name)}
                    class="button is-small level-item"
                  >
                    <${selected ? icons["HotStar"] : icons["Star"]} />
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </div>
      ${zoom ? html`<${Zoom} name=${name} image=${image} toggle=${toggleZoom} />` : '' }
    `;
  }
}

export class Zoom extends Component {
  render({
    name = "Todd",
    image,
    toggle
  }) {
    const path_prefix =
      (image || "").startsWith("/") || (image || "").startsWith("http")
        ? ""
        : "/";
    return html`
      <div onClick=${toggle}
     style="position: fixed; top: 0; left: 0; margin: 0; padding: 0;
            height: 100%; width: 100%; z-index: 10">
      <div style="width: 100%; min-width: 100%; height: auto; min-height: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            background: url(${path_prefix}${image}) no-repeat;
            background-color: #000;
            background-position: 0 0;
            background-size: contain;"
     >
                <h2 style="color: silver; padding: 10px; margin-bottom: 4rem;
                    text-shadow: 1px 0 10px #FC0, 2px 1px 3px #CCC;"
                    class="title is-2">${name}</h2>
            </div>
      </div>
    `;
  }
}


export class NPCList extends Component {
  render({ npcs, ...props }) {
    return html`
      <div class="tile is-ancestor" style="flex-wrap: wrap">
        ${npcs.map(
          npc =>
            html`
              <${Box} ...${npc}, ...${props} />
            `
        )}
      </div>
    `;
  }
}

export class InfoPanel extends Component {
  render({ section, topic, npcs, ...props }) {
    return html`
      <h2 class="title is-capitalized">
        ${section}: ${topic}
      </h2>
      <${NPCList}
        npcs=${npcs.filter(npc => npc[section] === topic)}
        ...${props}
      />
    `;
  }
}

export class CastList extends Component {
  constructor(props) {
    super(props);
    this.state = { search: "" };
  }
  render({ npcs, ...props }, { search }) {
    return html`
      <h2 class="title is-capitalized" style="position: sticky">Cast</h2>
      <div class="level level-left">
        <p class="control level-item has-text-centered">
          <input
            class="input is-primary"
            value=${search}
            onInput=${e => this.setState({ search: e.target.value })}
            type="text"
            placeholder="Search"
          />
        </p>
      </div>
      <${NPCList}
        npcs=${npcs.filter(
          npc =>
            search.length == 0 ||
            Object.values(npc)
              .join(" ")
              .toLowerCase()
              .match(search.toLowerCase())
        )}
        ...${props}
      />
    `;
  }
}

export class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  render(props, { active }) {
    return html`
      <nav
        class="navbar is-fixed-bottom"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            The Academy
          </a>

          <a
            role="button"
            class="navbar-burger burger ${active ? "is-active" : ""}"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick=${e => this.setState({ active: !active })}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicExample"
          class="navbar-menu ${active ? "is-active" : ""}"
        >
          <div class="navbar-start" onClick=${ e => this.setState({ active: !active }) }>
            ${toChildArray(this.props.children).map(
              x => html`
                ${x}
              `
            )}
          </div>
        </div>
      </nav>
    `;
  }
}
