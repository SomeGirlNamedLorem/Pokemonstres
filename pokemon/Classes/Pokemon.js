class Pokemon{
    constructor(id,nom,att,def,pv){
        this._id=id;
        this._nom=nom;
        this._att=att;
        this._def=def;
        this._pv=pv;
        this._types=[];
        this._attaques=[];
    }

    toString(){
        console.log(this._id+". "+this._nom+" possède une attaque de "+this._att+" une défense de "+this._def+" et "+this._pv+"pv");
    }

}

class Attack{
    static all_attacks =[];
    constructor(id,nom,type,power,stamina,energy,duration){
        this._id=id;
        this._nom=nom;
        this._type=type;
        this._power=power;
        this._stamina=stamina;
        this._energy=energy;
        this._duration=duration;
    }

    toString(){
        console.log(this._id+". L'attaque "+this._nom+" type : "+this._type+", Puissance : "+this._power+" Perte en stamina : "+this._stamina+", Perte en énergie : "+this._energy+". Durée : "+this._duration);
    }
}

function import_pokemon(){
    pokemons.forEach((pokemon) => {
        if (pokemon[3]=="Normal"){
            console.log("test");
            let newpkm = new Pokemon(pokemon[4],pokemon[5],pokemon[0],pokemon[1],pokemon[2]);

            pokemon_type.forEach((tt) => {
                if ((tt["pokemon_id"]==pokemon[4])&&(tt["form"]=="Normal")){

                    types=tt["types"];
                    newpkm._types=types;

                    pokemon_type.forEach((type) => {
                        if (all_types[type].isEmpty()){
                            new TypeError();
                        }
                    });
                }
            });

            all_pokemons[pokemon[4]]=newpkm;
        }
    }
    );
}

all_pokis=import_pokemon();
console.log(all_pokis);