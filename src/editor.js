import {
  Component,
  render,
  html,
  division_icons,
  divisions,
  division_types,
  grades
} from "./defs.js";

import { svg_icons } from './icons.js';

const icons = svg_icons('0.75rem', '#363636');

import { Mark } from "./Widgets.js";

class RadioField extends Component {
  render({ name, value, values, labels, ...props }) {
    return html`
      <div class="field">
        <div class="control">
          ${values.map(v => {
            return html`
              <label class="radio ${v === value && "has-text-primary"}">
                <input
                  type="radio"
                  name="${name}"
                  value=${v}
                  checked="${v === value ? true : false}"
                  ...${props}
                />
                ${labels[v]}</label
              >
            `;
          })}
        </div>
      </div>
    `;
  }
}

class EditField extends Component {
  render({ label, name, value, big, ...props }) {
    return html`
      <div class="field">
        <label class="label">${label}</label>
        <div class="control">
          ${big
            ? html`
                <textarea class="textarea" name=${name} ...${props}>
${value}</textarea
                >
              `
            : html`
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
  constructor(props) {
    super(props);
    const { name, bio, powers, grade, division, type, image } = props;
    this.state = { name, bio, powers, grade, division, type, image };
  }

  onInput(e) {
    const edit = { [e.target.name]: e.target.value };
    this.setState(edit);
  }

  onDone(callback) {
    callback(this.state);
  }

  render({ closeAction }, { name, bio, powers, grade, division, type, image }) {
    const updateAction = this.onInput.bind(this);
    bio = bio ? bio : name;
    powers = powers ? powers : name;
    division = division ? division : "Soma";
    type = type ? type : "Freak";
    grade = grade ? grade : "Amber";
    const division_labels = divisions.reduce((l, d) => {
      l[d] = html`
        <${Mark}
          icon=${d}
          title=${d}
          color=${d === division ? "#999933" : "#3273dc"}
        /><span class="is-size-7">${d}</span>
      `;
      return l;
    }, {});
    const type_labels = division_types[division].reduce((l, d) => {
      l[d] = html`
        <${Mark}
          icon=${d}
          title=${d}
          color=${d === type ? "#999933" : "#3273dc"}
        /><span class="is-size-7">${d}</span>
      `;
      return l;
    }, {});
    const grade_labels = grades.reduce((l, d) => {
      l[d] = html`
        <${Mark}
          icon=${d}
          title=${d}
        /><span class="is-size-7">${d}</span>
      `;
      return l;
    }, {});
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
          value=${bio}
          onInput=${updateAction}
        />
        <${RadioField}
          name="division"
          values=${divisions}
          value=${division}
          labels=${division_labels}
          onClick=${updateAction}
        />
        <${RadioField}
          name="type"
          values=${division_types[division]}
          value=${type}
          labels=${type_labels}
          onClick=${updateAction}
        />
        <${RadioField}
          name="grade"
          values=${grades}
          value=${grade}
          labels=${grade_labels}
          onClick=${updateAction}
        />
        <button
          class="button"
          onClick=${e => {
            e.preventDefault();
            this.onDone(closeAction);
          }}
        >
          Done
        </button>
      </form>
    `;
  }
}
