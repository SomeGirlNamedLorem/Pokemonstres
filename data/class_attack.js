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