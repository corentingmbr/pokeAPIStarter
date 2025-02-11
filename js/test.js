document.addEventListener("DOMContentLoaded", () => {
    const generationSelect = document.querySelector("#generation-select");
    const sortSelect = document.querySelector("#sort-select");
    const sortOrderButton = document.querySelector("#sort-order-button");
    const main = document.querySelector("main");
    const filterSection = document.querySelector("#filter");

    let sortOrder = "asc";

    const typeButtonsContainer = document.createElement("div");
    typeButtonsContainer.id = "type-buttons";
    filterSection.insertAdjacentElement('afterend', typeButtonsContainer);

    const couleurs = {
        normal: '#A8A77A',
        feu: '#EE8130',
        eau: '#6390F0',
        électrik: '#F7D02C',
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
        ténèbres: '#705746',
        acier: '#B7B7CE',
        fée: '#D685AD',
    };

    function getColorByType(type) {
        return couleurs[type.toLowerCase()] || 'grey';
    }

    function sortPokemon(pokemonList, criteria, order) {
        return pokemonList.sort((a, b) => {
            let comparison = 0;
            if (criteria === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (criteria === "type") {
                comparison = a.apiTypes[0].name.localeCompare(b.apiTypes[0].name);

            } else if (criteria === "id") {
                comparison = a.pokedexId - b.pokedexId;
            } else {
                comparison = a.stats[criteria] - b.stats[criteria];
            }
            return order === "asc" ? comparison : -comparison;
        });

    }

    async function fetchAndDisplayPokemon(generation, type = null, sortCriteria = "id", sortOrder = "asc") {
        const data = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/generation/${generation}`);
        const json = await data.json();
        console.log(json);

        main.querySelectorAll("article").forEach(article => article.remove());

        const sortedPokemon = sortPokemon(json, sortCriteria, sortOrder);

        sortedPokemon.forEach(pokemon => {
            const primaryType = pokemon.apiTypes[0].name.toLowerCase();
            if (type && !pokemon.apiTypes.some(t => t.name.toLowerCase() === type.toLowerCase())) {
                return;
            }
            let article = document.createElement("article");
            const color = getColorByType(primaryType);

            article.style.backgroundColor = color;
            article.style.border = `10px solid ${color}`;

            article.innerHTML = `
        <figure>
        <picture>
        <img src="${pokemon.image}" alt="Image ${pokemon.name}" />
        </picture>
        <figcaption>
        <span class = "types">${pokemon.apiTypes.map(type => type.name).join(", ")}</span>
        <h2>${pokemon.name}</h2>
        <ol>
        <li>Id: ${pokemon.pokedexId}</li>
        <li>HP: ${pokemon.stats.HP}</li>
        <li>Attaque: ${pokemon.stats.attack}</li>
        <li>Défense: ${pokemon.stats.defense}</li>
        <li>Attaque spéciale: ${pokemon.stats.special_attack}</li>
        <li>Défense spéciale: ${pokemon.stats.special_defense}</li>
        <li>Vitesse: ${pokemon.stats.speed}</li>
        </ol>
        </figcaption>
        </figure>
        `;
            main.appendChild(article);
        });
    }

    async function fetchAndDisplayTypes() {
        const data = await fetch(`https://pokebuildapi.fr/api/v1/types`);
        const types = await data.json();
        console.log(types);

        types.forEach(type => {
            const button = document.createElement("button");
            button.innerHTML = `<img src="${type.image}" alt="${type.name}" />`;
            button.style.backgroundColor = "white";
            button.style.borderRadius = "50%";
            button.style.width = "100px";
            button.style.height = "100px";
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.padding = "5px";
            button.addEventListener("click", () => {
                fetchAndDisplayPokemon(generationSelect.value, type.name, sortSelect.value, sortOrder);
            });
            typeButtonsContainer.appendChild(button);
        });
    }


    generationSelect.addEventListener("change", () => {
        fetchAndDisplayPokemon(generationSelect.value);
    });

    sortSelect.addEventListener("change", () => {
        fetchAndDisplayPokemon(generationSelect.value, null, sortSelect.value, sortOrder);
    });

    sortOrderButton.addEventListener("click", () => {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        sortOrderButton.textContent = sortOrder === "asc" ? "▲" : "▼";
        fetchAndDisplayPokemon(generationSelect.value, null, sortSelect.value, sortOrder);
    });

    fetchAndDisplayTypes();
    fetchAndDisplayPokemon(generationSelect.value);
});