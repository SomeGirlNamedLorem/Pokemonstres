class Pokemon {
    static all_pokemons = {};
    constructor(pokemonData) {
        this.pokemonId = pokemonData.pokemon_id;
        this.pokemonName = pokemonData.pokemon_name;
        this.generation = this.getGeneration(this.pokemonId);
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

    getGeneration(pokemonId) {
        for (const genName in generations) {
            const pokemonList = generations[genName];
            const foundPokemon = pokemonList.find(pokemon => pokemon.id === pokemonId);
            if (foundPokemon) {
                return genName;
            }
        }
        return "Unknown Generation"; // Retourne cela si aucune correspondance trouvée
    }    
}