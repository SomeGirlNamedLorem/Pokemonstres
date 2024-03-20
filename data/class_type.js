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