import {
  Component,
  render,
  html,
  divisions,
  division_types,
  grades
} from "./defs.js";

import { svg_icons } from "./icons.js";

const icons = svg_icons("0.75rem", "#363636");

import { Mark } from "./Widgets.js";

import { connect } from '/web_modules/unistore/full/preact.es.js';

import { myActions } from './Store.js';

import { useLocation } from '/web_modules/wouter-preact.js';

class RadioField extends Component {
  render({ name, value, values, labeler, ...props }) {
    return html`
      <div class="field">
        <div class="control level-left">
          ${values.map(v => {
            return html`
              <label class="radio ${(v === value) ? "has-text-primary": ""} level-item">
                <input
                  type="radio"
                  name="${name}"
                  value=${v}
                  checked="${v === value ? true : false}"
                  ...${props}
                />
                ${labeler(name, v)}</label
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

class EditImage extends Component {
  render({image}) {
    const getFile = (e) => console.log(e.target.files[0].name);
    return html`
  <div class="field">
<div class="file">
  <label class="file-label">
      <figure class="image is-128x128" style="overflow: hidden">
          <img src="/${image}" alt="Image" />
      </figure>
    <input class="file-input" type="file" name="resume" onChange="${getFile}" />
    <span class="file-cta">
<span class="file-label">
        Choose a file…
      </span>
    </span>
  </label>
</div>
</div>
    `;
  }
}

class EditForm1 extends Component {
  constructor(props) {
    super(props);
    const { name, bio, powers, grade, division, type, image } = props;
    this.state = { name, bio, powers, grade, division, type, image };
  }

  componentDidMount(props) {
    this.props.loadFirestoreData().then( () => {
    const character = this.props.npcs.find(npc => npc.name === this.props.name);
    if (character) {
      this.setState({ ...character })
    }
    } );
  }

  render({ commitEdit }, { name, bio, powers, grade, division, type, image }) {
    const updateAction = (e) => this.setState({[e.target.name]: e.target.value });
    const [ loc, setLocation ] = useLocation();
    const commitAction = (e) => { e.preventDefault(); commitEdit(this.state); setLocation('/') };
    const label_func = (name, val) => html`<span
            class="tag"
            title="${name}: ${val}"><${icons[val]} />
            ${val}</span>`;
    return html`
      <form onSubmit=${commitAction}>
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
        <${EditImage} image=${image} />
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
          labeler=${label_func}
          onClick=${updateAction}
        />
        ${division && html`
        <${RadioField}
          name="type"
          values=${division_types[division]}
          value=${type}
          labeler=${label_func}
          onClick=${updateAction}
        />
        `}
        <${RadioField}
          name="grade"
          values=${grades}
          value=${grade}
          labeler=${label_func}
          onClick=${updateAction}
        />
        <button class="button"
        >Done</button>
      </form>
    `;
  }
}
export const EditForm = connect(['npcs'], myActions) ( EditForm1 );

class NamePicker1 extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' }
  }

  componentDidMount() {
    if (Object.keys(this.props.names||{}).length != 2 || ! this.props.names['boys']  || this.props.names['boys'].length != 5)
      this.props.loadNames();
  }

  render({names, loadNames}, { value }) {
    if (Object.keys(names||{}).length != 2 || ! names['boys']  || names['boys'].length != 5)
      return html`<h2>Loading...</h2>`; 
    if (value === '' || (!names.boys.includes(value) && !names.girls.includes(value))) {
      let semi_rand = Date.now();
      let list = semi_rand % 2 == 0 ? "boys" : "girls";
      let index = semi_rand % 5;
      value = names[list][index];
      this.setState({ value }); // persist
    }
    const onChange = (e) => this.setState({value: e.target.value});
    const onSubmit = (e) => {
            e.preventDefault();
            const [ loc, setLocation ] = useLocation();
            console.log("Name was: " + this.state.value);
            setLocation(`/edit/${this.state.value}`);
    }
    const onReset = (e) => {
        this.setState({value: ''})
        e.preventDefault();
        this.props.loadNames();
    }
    return html`<form onSubmit=${onSubmit}>
    <label>Pick a Name
    <select value=${value} onChange=${onChange}>
    ${names.boys.map((name) => html`<option value=${name}>${name}</option>`)}
    ${names.girls.map((name) => html`<option value=${name}>${name}</option>`)}
    </select>
    </label>
    <button type="submit">Create</button>
    <button onclick=${onReset}>Re-Roll</button>
    </form>`
  }
}
export const NamePicker = connect(['names'], myActions )( NamePicker1 );
