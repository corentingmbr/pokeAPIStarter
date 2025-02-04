document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector("select");
    const main = document.querySelector("main");
    const filterSection = document.querySelector("#filter");

    const couleurs = {
        normal: '#A8A77A',
        feu: '#EE8130',
        eau: '#6390F0',
        electrique: '#F7D02C',
        plante: '#7AC74C',
        glace: '#96D9D6',
        combat: '#C22E28',
        poison: '#A33EA1',
        sol: '#E2BF65',
        vol: '#A98FF3',
        psy: '#F95587',
        insecte: '#A6B91A',
        roche: '#B6A136',
        spectre: '#735797',
        dragon: '#6F35FC',
        tenebres: '#705746',
        acier: '#B7B7CE',
        fee: '#D685AD',
    };

    function getColorByType(type) {
        return couleurs[type.toLowerCase()] || 'grey';
    }

    async function fetchAndDisplayPokemon(generation) {
        const data = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/generation/${generation}`);
        const json = await data.json();
        console.log(json);

        // Clear previous Pokémon cards
        main.querySelectorAll("article").forEach(article => article.remove());

        json.forEach(pokemon => {
            let article = document.createElement("article");
            const primaryType = pokemon.apiTypes[0].name.toLowerCase();
            const color = getColorByType(primaryType);

            article.style.backgroundColor = color;
            article.style.border = `10px solid ${color}`;

            article.innerHTML = `
                <figure>
                    <picture>
                        <img src="${pokemon.image}" alt="Image ${pokemon.name}" />
                    </picture>
                    <figcaption>
                        <span class="types">${pokemon.apiTypes.map(type => type.name).join(", ")}</span>
                        <h2>${pokemon.name}</h2>
                        <ol>
                            <li>Points de vie : ${pokemon.stats.HP}</li>
                            <li>Attaque : ${pokemon.stats.attack}</li>
                            <li>Défense : ${pokemon.stats.defense}</li>
                            <li>Attaque spéciale : ${pokemon.stats.special_attack}</li>
                            <li>Défense spéciale : ${pokemon.stats.special_defense}</li>
                            <li>Vitesse : ${pokemon.stats.speed}</li>
                        </ol>
                    </figcaption>
                </figure>
            `;
            main.appendChild(article);
        });
    }

    selectElement.addEventListener("change", (event) => {
        const generation = event.target.value;
        fetchAndDisplayPokemon(generation);
    });

    // Fetch and display Pokémon for the initial generation
    fetchAndDisplayPokemon(selectElement.value);
});