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
    constructor(type,nom) {
        this.name = type;
        this.multipliers = nom;
        Type.all_types[nom]=this;
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

    // Créer des objets Pokemon à partir des données
    pokemonData.forEach((data) => {

        const pokemon = new Pokemon(data);
        poki[pokemon.pokemonId] = pokemon;

        // Chercher les types correspondant à ce Pokémon 
        const pokemonTypeData = typeData.find((type) => type.pokemon_id === data.pokemon_id);
        pokemonTypeData.type.forEach((tipe) => {
            if (Object.entries(Type.all_types).find(entry => entry[0] === tipe)){
                typ=Object.entries(Type.all_types).find(entry => entry[0] === tipe);
            }
            else{
                typ=new Type(tipe,pokemonTypeData.name);
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

Type.all_types = {};
Attack.all_attacks = {};

const all_pokemons = import_pokemon();

console.log('Types de Pokémon:');
console.log(all_pokemons);