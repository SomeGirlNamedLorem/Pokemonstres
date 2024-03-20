class Pokemon {
    static all_pokemons = {};
    constructor(pokemonData) {
        this.pokemonId = pokemonData.pokemon_id;
        this.pokemonName = pokemonData.pokemon_name;
        this.baseAttack = pokemonData.base_attack;
        this.baseDefense = pokemonData.base_defense;
        this.baseStamina = pokemonData.base_stamina;
        this.form = pokemonData.form;
        this.types = [];
        this.attacks = [];
        Pokemon.all_pokemons[this.pokemonId]=this;
    }

    toString() {
        return `${this.pokemonName} (ID: ${this.pokemonId})`;
    }

    getTypes() {
        return this.types;
    }

    getAttacks() {
        return this.attacks;
    }
}

class Type {
    static all_types={};
    constructor(type,eff) {
        this.name = type;
        this.multipliers = eff[1];
        Type.all_types[type]=this;
    }

    toString() {
        return this.name;
    }
}

class Attack {
    static all_moves={};
    constructor(attackData) {
        this.moveId = attackData.move_id;
        this.name = attackData.name;
        this.type = attackData.type;
        this.power = attackData.power;
        this.duration = attackData.duration;
        Attack.all_moves[this.moveId]=this;
    }

    toString() {
        return this.name;
    }
}

function import_pokemon() {
    let pokemonData = pokemons;
    let typeData = pokemon_types;
    let movesData = pokemon_moves;
    let poki={}

    pokemonData.forEach((data) => {

        const pokemon = new Pokemon(data);
        poki[pokemon.pokemonId] = pokemon;

        const pokemonTypeData = typeData.find((type) => type.pokemon_id === data.pokemon_id);
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
        const pokemonMovesData = movesData.find((moves) => moves.pokemon_id === data.pokemon_id);
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

// Fonction pour afficher la liste des Pokémons dans un tableau
function displayPokemonTable() {
    const tbody = document.querySelector('#pokemon-table tbody');

    // Parcourir la liste des Pokémons et créer une ligne de tableau pour chaque Pokémon
    for (const pokemonId in all_pokemons) {
        const pokemon = all_pokemons[pokemonId];
        const pokemonRow = createPokemonRow(pokemon);
        tbody.appendChild(pokemonRow);
    }
}

// Appeler la fonction pour afficher la liste des Pokémons dans le tableau lors du chargement de la page
window.onload = displayPokemonTable;


Attack.all_attacks = {};
all_pokemons=import_pokemon()
