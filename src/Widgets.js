import { Component, html, toChildArray } from "./defs.js";
import { Link, useLocation } from "/web_modules/wouter-preact.js";
import { svg_icons } from "./icons.js";

const icons = svg_icons("0.75rem", "#363636");

export class Mark extends Component {
  render({ icon, color, ...props }) {
    return html`
      <button
        class="button is-small level-item"
        style="${color ? "color:" + color + ";" : ""}"
        ...${props}
      >
        <${icons[icon]} />
      </button>
    `;
  }
}

class Box extends Component {
  render({
    name = "Todd",
    grade = "red",
    division = "Soma",
    type = "Freak",
    bio,
    powers,
    image
  }) {
    return html`
      <div class="tile is-parent is-4">
        <div class="tile is-child box animated fadeInDown" key=${name}>
          <article class="media">
            <div class="media-left">
              <figure class="image is-128x128" style="overflow: hidden">
                <img src="/${image}" alt="Image" class="is-rounded" />
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
                </div>
              </nav>
            </div>
          </article>
        </div>
      </div>
    `;
  }
}

export class NPCList extends Component {
  render({ npcs, ...props }, state) {
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
  render({ section, topic, npcs, ...props }, state) {
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
  render(props, state) {
    return html`
      <h2 class="title is-capitalized" style="position: sticky">Cast</h2>
      <${NPCList} npcs=${props.npcs} />
    `;
  }
}
