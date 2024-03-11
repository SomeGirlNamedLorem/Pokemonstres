// Classe Pokemon
class Pokemon {
    constructor(pokemonData) {
        this.pokemonId = pokemonData.pokemon_id;
        this.pokemonName = pokemonData.pokemon_name;
        this.baseAttack = pokemonData.base_attack;
        this.baseDefense = pokemonData.base_defense;
        this.baseStamina = pokemonData.base_stamina;
        this.form = pokemonData.form;
        this.types = []; // Nous allons stocker les types ici
        this.attacks = []; // Nous allons stocker les attaques ici
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

// Classe Type
class Type {
    constructor(typeData) {
        this.name = typeData.type;
        this.multipliers = typeData[this.name];
    }

    toString() {
        return this.name;
    }
}

// Classe Attack
class Attack {
    constructor(attackData) {
        this.moveId = attackData.move_id;
        this.name = attackData.name;
        this.type = attackData.type;
        this.power = attackData.power;
        this.duration = attackData.duration;
        // Ajoutez d'autres propriétés si nécessaire
    }

    toString() {
        return this.name;
    }
}

function import_pokemon() {
    const all_pokemons = {};

    // Importer les données des fichiers .js
    const pokemonData = pokemon;
    const typeData = pokemon_types;
    const movesData = pokemon_moves;

    // Créer des objets Pokemon à partir des données
    pokemonData.forEach((data) => {
        const pokemon = new Pokemon(data);
        all_pokemons[pokemon.pokemonId] = pokemon;

        // Chercher les types correspondant à ce Pokémon 
        const pokemonTypeData = typeData.find((type) => type.pokemon_id === data.pokemon_id);
        if (pokemonTypeData && pokemonTypeData.type && Array.isArray(pokemonTypeData.type)) {
            pokemonTypeData.type.forEach((type) => {
                pokemon.types.push(type);
            });
        } else {
            console.log("Aucun type trouvé pour ce Pokémon:", data);
        }

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

    return all_pokemons;
}

// Variables de classe pour stocker toutes les données
Type.all_types = {};
Attack.all_attacks = {};

// Exemple d'utilisation
const all_pokemons = import_pokemon();



// Affichez les types de Pokémon
console.log('Types de Pokémon:');
console.log(all_pokemons);