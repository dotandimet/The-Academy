    const division_icons = {
        "Soma": "fa-child",
        "Soma: Quicks": "fa-running",
        "Soma: Freaks": "fa-biohazard",
        "Mekhane": "fa-cog",
        "Mekhane: Gremlins": "fa-wrench",
        "Mekhane: Ghosts": "fa-ghost",
        "Psyche": "fa-brain",
        "Psyche: ESPers": "fa-heart-broken",
        "Psyche: Dominators": "fa-hand-holding-heart",
        "Energia": "fa-fire",
        "Daimon": "fa-hat-wizard",
        "Daimon: Oracles": "fa-crow",
        "Daimon: Demonologists": "fa-cat"
    };

    grades = ['amber', 'red', 'black'];

    const box = (my) => {
        my.grade = (my.grade) ? my.grade : 'red';
        my.division = (my.division) ? my.division : 'Soma';
        return `
<div class="box">
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