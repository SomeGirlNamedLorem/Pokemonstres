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
    let poki={};

    pokemonData.forEach((data) => {
        let pokemon = new Pokemon(data);
        let format = poki[pokemon.pokemonId];
        
        //Pour considerer les Pokemons n'ayant pas de formes "Normal" dans le fichier
        if (!format || (format.form != "Normal" && data.form === "Normal")) {
            poki[pokemon.pokemonId] = pokemon;
        }

        if (data.form === "Normal" && (!format || format.form != "Normal")) {
            let pokemonTypeData = typeData.find((type) => type.pokemon_id === data.pokemon_id && type.form === "Normal");
            //Type
            pokemonTypeData.type.forEach((tipe) => {
                let typ;
                if (Object.entries(Type.all_types).find(entry => entry[0] === tipe)){
                    typ = Object.entries(Type.all_types).find(entry => entry[0] === tipe)[1];
                } else {
                    typ = new Type(tipe, Object.entries(type_effectiveness).find(entry => entry[0] === tipe));
                }
                pokemon.types.push(typ);
            });

            //Attaques
            const pokemonMovesData = movesData.find((moves) => moves.pokemon_id === data.pokemon_id);
            if (pokemonMovesData) {
                pokemonMovesData.fast_moves.forEach((attackName) => {
                    const attackData = fast_moves.find((move) => move.name === attackName);
                    if (attackData) {
                        const attack = new Attack(attackData);
                        pokemon.attacks.push(attack);
                    } else {
                        console.log("prob :", attackName);
                    }
                });

                pokemonMovesData.charged_moves.forEach((attackName) => {
                    const attackData = charged_moves.find((move) => move.name === attackName);
                    if (attackData) {
                        const attack = new Attack(attackData);
                        pokemon.attacks.push(attack);
                    } else {
                        console.log("prob : ", attackName);
                    }
                });
            }
        }
    });

    return poki;
}

function getPokemonsByType(typeName){
    let typos=[];
    Object.values(Pokemon.all_pokemons).forEach((pok)=>{
        pok.types.forEach((tip)=>{
            if (tip.name==typeName){
                typos.push(pok);
            }
        })
    })
    return typos
}

function getPokemonsByAttack(attackName){
    let typos=[];
    Object.values(Pokemon.all_pokemons).forEach((pok)=>{
        pok.attacks.forEach((tip)=>{
            if (tip.name==attackName){
                typos.push(pok);
            }
        })
    })
    return typos
}

function getAttacksByType(typeName){
    let typos=[];
    Object.values(Attack.all_moves).forEach((pok)=>{
        if (pok.type==typeName){
            typos.push(pok);
        }
    })
    return typos
}

function sortPokemonByName() {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => a.pokemonName.localeCompare(b.pokemonName));
}

function sortPokemonByStamina() {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => b.baseStamina - a.baseStamina);
}

function getWeakestEnemies(attack) {
    let weakestEnemies = [];
    for (let pokemonId in Pokemon.all_pokemons) {
        let pokemon = Pokemon.all_pokemons[pokemonId];
        if (pokemon.getAttacks().some(a => a.name === attack)) {
            console.log(pokemon)
            weakestEnemies.push(pokemon);
        }
    }
    return weakestEnemies;
}

function getStrongestEnemies(attack) {
    return getWeakestEnemies(attack).reverse();
}

//Recupere l'objet "type" a partir d'une chaine de caractere du nom du type entree en argument
function getTyp(nom){
    let typ = Object.values(Type.all_types).find(typ => typ.name === nom);
    if (typ) {
        return typ;
    }
}

//Recupere l'objet "pokemon" a partir d'une chaine de caractere du nom du pokemon entree en argument
function getNam(nom){
    let pok = Object.values(Pokemon.all_pokemons).find(pok => pok.pokemonName === nom);
    if (pok) {
        return pok;
    }
}

//Recupere l'objet "attaque" a partir d'une chaine de caractere du nom de l'attaque entree en argument
function getAtt(nom){
    let att = Object.values(Attack.all_moves).find(att => att.name === nom);
    if (att) {
        return att;
    }
}

//Verifie que l'ensemble des Pokemon a bien ete charge
function alpha(tt){
    for (i=1;i<899;i++){
        if (!tt[i]){
            console.log(i)
        }
    }
}

function getWeakestEnnemy(attack){
    let list=[];
    let cofPok=-1;
    typ=getTyp(getAtt(attack).type)
    console.log(typ)
    Object.values(Pokemon.all_pokemons).forEach((pok)=>{
        cofSol=1
        Object.values(pok.types).forEach((typos)=>{
            cofSol=cofSol*typ.multipliers[typos]
        })
        if (cofSol==cofPok){
            list.push(pok)
            console.log(pok+" "+cofSol)
            console.log(pok.types+" "+cofSol)
        }
        else if (cofSol>cofPok){
            cofPok=cofSol
            list=[]
            list.push(pok)
        }
    })
    return list
}

function getBestAttackTypesForEnemy(name){
    cofPok=-1
    list=[]
    Object.values(Type.all_types).forEach((typ)=>{
        cofSol=1
        Object.values(getNam(name).types).forEach((typos)=>{
            cofSol=cofSol*typ.multipliers[typos]
        })
        if (cofSol==cofPok){
            list.push(typ)
        }
        else if (cofSol>cofPok){
            cofPok=cofSol
            list=[]
            list.push(typ)
        }
    })
    return list
}

tt=import_pokemon()

console.log(tt);
console.log(Object.keys(tt).length);
alpha(tt)
