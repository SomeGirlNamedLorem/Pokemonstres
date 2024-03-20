// Déclaration des variables globales
const ITEMS_PER_PAGE = 25;
let currentPage = 1;
let totalPage;
let selectedPokemonId = null;


function import_pokemon() {
    let poki={}

    pokemons.forEach((data) => {
        const pokemon = new Pokemon(data);
        poki[pokemon.pokemonId] = pokemon;

        const pokemonTypeData = pokemon_types.find((type) => type.pokemon_id === data.pokemon_id);
        pokemonTypeData.type.forEach((tipe) => {
            if (Object.entries(Type.all_types).find(entry => entry[0] === tipe)){
                typ=Object.entries(Type.all_types).find(entry => entry[0] === tipe)[1];
            }
            else{
                typ=new Type(tipe,Object.entries(type_effectiveness).find(entry => entry[0] === tipe));
            }
            pokemon.types.push(typ);
        });

        // Chercher les attaques correspondant à ce Pokémon
        const pokemonMovesData = pokemon_moves.find((moves) => moves.pokemon_id === data.pokemon_id);
        if (pokemonMovesData) {
            // Liens avec les attaques rapides
            pokemonMovesData.fast_moves.forEach((attackName) => {
                const attackData = fast_moves.find((move) => move.name === attackName);
                if (attackData) {
                    const attack = new Attack(attackData);
                    pokemon.attacks.push(attack);
                } else {
                    console.log("Aucune donnée d'attaque trouvée pour:", attackName);
                }
            });

            // Liens avec les attaques chargées
            pokemonMovesData.charged_moves.forEach((attackName) => {
                const attackData = charged_moves.find((move) => move.name === attackName);
                if (attackData) {
                    const attack = new Attack(attackData);
                    pokemon.attacks.push(attack);
                } else {
                    console.log("Aucune donnée d'attaque trouvée pour:", attackName);
                }
            });
        } else {
            console.log("Aucune donnée d'attaque trouvée pour ce Pokémon:", data);
        }
    });

    return poki;
}


// Fonction pour créer les éléments HTML pour un Pokémon dans un tableau
function createPokemonRow(pokemon) {
    const tr = document.createElement('tr');

    // Créer et ajouter les cellules pour chaque attribut du Pokémon
    const tdId = document.createElement('td');
    tdId.textContent = pokemon.pokemonId;
    tr.appendChild(tdId);

    const tdName = document.createElement('td');
    tdName.textContent = pokemon.pokemonName;
    tr.appendChild(tdName);

    const tdGeneration = document.createElement('td');
    tdGeneration.textContent = pokemon.generation;
    tr.appendChild(tdGeneration);

    const tdTypes = document.createElement('td');
    tdTypes.textContent = pokemon.types.map(type => type.name).join(', ');
    tr.appendChild(tdTypes);

    const tdStamina = document.createElement('td');
    tdStamina.textContent = pokemon.baseStamina;
    tr.appendChild(tdStamina);

    const tdBaseAttack = document.createElement('td');
    tdBaseAttack.textContent = pokemon.baseAttack;
    tr.appendChild(tdBaseAttack);

    const tdBaseDefense = document.createElement('td');
    tdBaseDefense.textContent = pokemon.baseDefense;
    tr.appendChild(tdBaseDefense);

    const tdImage = document.createElement('td');
    const img = document.createElement('img');
    if (pokemon.pokemonId < 10) {
        img.src = '../webp/images/00' + pokemon.pokemonId + '.webp';
    } else if (pokemon.pokemonId < 100) {
        img.src = '../webp/images/0' + pokemon.pokemonId + '.webp';
    } else {
        img.src = '../webp/images/' + pokemon.pokemonId + '.webp';
    }
    img.alt = pokemon.pokemonName;
    img.height = 100; // Ajustez la hauteur de l'image si nécessaire

    // Gestion de l'erreur de chargement de l'image
    img.onerror = function() {
        img.style.display = 'none'; // Masquer l'image
        tdImage.textContent = 'Image non disponible'; // Afficher un texte à la place de l'image
    };
    
    tdImage.appendChild(img);
    tr.appendChild(tdImage);

    return tr;
}

// Fonction pour afficher les Pokémons de la page spécifiée
function displayPokemonTable(page) {
    const tbody = document.querySelector('#pokemon-table tbody');
    tbody.innerHTML = ''; // Efface le contenu précédent

    // Calcul des indices de début et de fin pour la page spécifiée
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, Object.keys(all_pokemons).length);

    // Parcourir la liste des Pokémons pour cette page et créer une ligne de tableau pour chaque Pokémon
    for (let i = startIndex; i < endIndex; i++) {
        const pokemonId = Object.keys(all_pokemons)[i];
        const pokemon = all_pokemons[pokemonId];
        const pokemonRow = createPokemonRow(pokemon);
        tbody.appendChild(pokemonRow);
    }

    // Met à jour les informations sur la pagination
    const pageInfo = document.getElementById('page-info');
    pageInfo.textContent = `Page ${page} / ${totalPage}`;

    // Met à jour l'état des boutons précédent et suivant
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPage;
}

// Gestionnaire d'événement pour le bouton "PRÉC"
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPokemonTable(currentPage);
    }
});

// Gestionnaire d'événement pour le bouton "SUIV"
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPage) {
        currentPage++;
        displayPokemonTable(currentPage);
    }
});

Attack.all_attacks = {};
all_pokemons=import_pokemon()

// Calcul du nombre total de pages
totalPage = Math.ceil(Object.keys(all_pokemons).length / ITEMS_PER_PAGE);

// Variable globale pour stocker le Pokémon sélectionné
let selectedPokemon = null;

// Fonction pour afficher les détails du Pokémon sélectionné
function showPokemonDetails(pokemon) {
    const detailsPopup = document.getElementById('pokemon-details');
    const attacksInfo = document.getElementById('pokemon-attacks');
    console.log(pokemon);
    // Efface le contenu précédent
    attacksInfo.innerHTML = '';

    // Ajoute les noms des attaques classées par type
    pokemon.attacks.forEach((attack) => {
        const attackType = attack.type === 'fast' ? 'Attaque rapide' : 'Attaque chargée';
        attacksInfo.innerHTML += `<strong>${attackType}:</strong> ${attack.name}<br>`;
    });

    // Affiche la zone de détails
    detailsPopup.classList.remove('hidden');
}

// Fonction pour fermer la zone de détails du Pokémon
function closePokemonDetails() {
    const detailsPopup = document.getElementById('pokemon-details');
    detailsPopup.classList.add('hidden');
}

// Gestionnaire d'événement pour le clic sur une ligne de Pokémon
document.getElementById('pokemon-table').addEventListener('click', (event) => {
    const clickedRow = event.target.closest('tr');
    if (clickedRow) {
        const pokemonIdCell = clickedRow.querySelector('td:first-child');
        if (pokemonIdCell) {
            selectedPokemonId = parseInt(pokemonIdCell.textContent);
            showPokemonDetails(all_pokemons[selectedPokemonId]); // Affiche les détails du Pokémon
        }
    }
});


// Gestionnaire d'événement pour le clic sur le bouton de fermeture des détails
document.getElementById('close-details-btn').addEventListener('click', closePokemonDetails);

// Gestionnaire d'événement pour le survol des images de Pokémon
document.getElementById('pokemon-table').addEventListener('mouseover', (event) => {
    const hoveredRow = event.target.closest('tr');

    if (hoveredRow && hoveredRow.dataset.pokemonId) {
        const pokemonId = hoveredRow.dataset.pokemonId;
        const pokemon = all_pokemons[pokemonId];
        const largeImagePopup = document.getElementById('pokemon-image-popup');
        const largePokemonImage = document.getElementById('large-pokemon-image');

        // Afficher l'image en grande taille
        largePokemonImage.src = `../webp/images/${pokemon.pokemonId}.webp`;
        largeImagePopup.classList.remove('hidden');
    }
});

// Gestionnaire d'événement pour quitter le survol des images de Pokémon
document.getElementById('pokemon-table').addEventListener('mouseout', () => {
    const largeImagePopup = document.getElementById('pokemon-image-popup');
    largeImagePopup.classList.add('hidden');
});


// Appel initial pour afficher les Pokémons de la première page
displayPokemonTable(currentPage);

