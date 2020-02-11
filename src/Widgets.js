import { Component, html, division_icons, grades, grade_colors } from "./defs.js";

export class Mark extends Component {
  render({ icon, color, ...props }) {
    return html`
      <a class="level-item" ...${props}>
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
    // TODO - check if Safari still can't use defaults
    name || (name = "bob");
    grade || (grade = "red");
    division || (division = "Soma");
    type || (type = "Freak");

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
                  color=${grade_colors[grade]}
                  onClick=${() => filterAction("grade", grade)}
                  title=${grade}
                />
                <${Mark}
                  icon=${division_icons[division]}
                  onClick=${() => filterAction("division", division)}
                  title=${division}
                />
                <${Mark}
                  icon=${division_icons[type]}
                  onClick=${() => filterAction("type", type)}
                  title=${type}
                />
                <${Mark}
                  icon="fa-edit"
                  onClick=${() => editCharacter(name)}
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

export class NPCList extends Component {
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
