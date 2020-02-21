import { Component, html, toChildArray } from "./defs.js";

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
    image,
    filterAction,
    editCharacter
  }) {
    return html`
      <div class="tile is-parent is-4">
        <div class="tile is-child box animated fadeInDown" key=${name}>
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
              <nav class="is-mobile">
                <div class="buttons has-addons">
                  <${Mark}
                    icon=${grade}
                    onClick=${() => filterAction("grade", grade)}
                    title=${"Grade: " + grade}
                  />
                  <${Mark}
                    icon=${division}
                    onClick=${() => filterAction("division", division)}
                    title=${"Division: " + division}
                  />
                  <${Mark}
                    icon=${type}
                    onClick=${() => filterAction("type", type)}
                    title=${"Type: " + type}
                  />
                  ${editCharacter &&
                    html`
                      <${Mark}
                        icon="Edit"
                        onClick=${() => editCharacter(name)}
                        title="Edit Me"
                      />
                    `}
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
  render({ npcs, filterAction, ...props }, state) {
    return html`
      <div class="tile is-ancestor" style="flex-wrap: wrap">
        ${npcs.map(
          npc =>
            html`
              <${Box} ...${npc}, filterAction=${filterAction} ...${props} />
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
      <${NPCList}
        npcs=${props.npcs}
        filterAction=${props.filterAction}
        editCharacter=${props.editCharacter}
      />
    `;
  }
}
