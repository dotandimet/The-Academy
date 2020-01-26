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

    grades = { 'amber': '#cc9933', 'bronze': '#999933', 'red': 'red', 'black': 'black' };

    const box = (my) => {
        my.grade = (my.grade) ? grades[my.grade] : grades['red'];
        my.division = (my.division) ? my.division : 'Soma';
        my.type = (my.type) ? my.type : 'Freak';
        return `
<div class="box tile is-child">
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img src="${ my.image}" alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        ${ my.name}
              </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small" style="color: ${ my.grade};">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </a>
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas ${ division_icons[my.division]}"></i>
            </span>
          </a>
          <a class="level-item">
            <span class="icon is-small">
              <i class="fas ${ division_icons[my.type]}"></i>
            </span>
          </a>
        </div>
      </nav>
    </div>
  </article>
</div>
`
    };

    fetch('npcs.json').then((res) => res.json())
        .then((npcs) => {
            let div = document.getElementById('npcs');
            for (let npc of npcs) {
                div.innerHTML += box(npc);
            }
        });
