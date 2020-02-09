import {
  Component,
  render,
  html,
  division_icons,
  divisions,
  division_types,
  grades
} from "./defs.js";

class EditField extends Component {
  render({ label, name, value, big, ...props }) {
    return html`
      <div class="field">
        <label class="label">${label}</label>
        <div class="control">
          ${big &&
            html`
              <textarea class="textarea" name=${name} ...${props}>
${value}</textarea
              >
            `}
          ${big ||
            html`
              <input
                class="input"
                type="text"
                placeholder="Text input"
                name=${name}
                value=${value}
                ...${props}
              />
            `}
        </div>
      </div>
    `;
  }
}

export class EditForm extends Component {
  render({ name, bio, powers, grade, division, type, image, updateAction }) {
    bio = bio ? bio : name;
    powers = powers ? powers : name;
    return html`
      <form>
        <${EditField}
          label="Name"
          value=${name}
          name="name"
          onInput=${updateAction}
        />
        <${EditField}
          label="Powers"
          value=${powers}
          name="powers"
          onInput=${updateAction}
        />
        <${EditField}
          big="true"
          label="Bio"
          name="bio"
          value=${name}
          onInput=${updateAction}
        />
      </form>
    `;
  }
}
