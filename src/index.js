import { h, Component, render } from 'https://unpkg.com/preact@10.2.1/dist/preact.module.js'; // 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

// Initialize htm with Preact
const html = htm.bind(h);

const division_icons = {
        "Soma": "fa-child",
        "Quick": "fa-running",
        "Freak": "fa-biohazard",
        "Mekhane": "fa-cog",
        "Gremlin": "fa-wrench",
        "Ghost": "fa-ghost",
        "Psyche": "fa-brain",
        "ESPer": "fa-heart-broken",
        "Dominator": "fa-hand-holding-heart",
        "Energia": "fa-sun",
        "Torch": "fa-fire",
        "Bolt": "fa-bolt",
        "Mover": "fa-meteor",
        "Daimon": "fa-hat-wizard",
        "Oracle": "fa-crow",
        "Channeler": "fa-cat"
    };

const grades = { 'amber': '#cc9933', 'bronze': '#999933', 'red': 'red', 'black': 'black' };

    class Box extends Component {
      state = { show: true };
      render({ name='Bob', grade='red', division='Soma', type='Freak', image } ) {
        return html`
<div class="box">
  <article class="media">
    <div class="media-left">
      <figure class="image is-128x128" style="overflow: hidden">
        <img src="${ image}" alt="Image" class="is-rounded" />
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        ${ name}
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small" style="color: ${ grades[grade] };">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </a>
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas ${ division_icons[division]}"></i>
            </span>
          </a>
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas ${ division_icons[type]}"></i>
            </span>
          </a>
        </div>
      </nav>
    </div>
  </article>
</div>
` }
    };

  class NPCList extends Component {
    state = { npcs: [] };
    
    componentDidMount() {
      this.loadData()    
    }

    loadData() {
      const url = (this.props.src) ? this.props.src : 'npcs.json';
      fetch(url).then((res) => res.json())
                        .then((npcs) => this.setState({ npcs }))
    }
    render(props, state) {
      return this.state.npcs.map( npc => html`<${Box} ...${npc} />` )
    }
  }
  
  const app = html`<${NPCList} />`
  render(app, document.getElementById('npcs'));
