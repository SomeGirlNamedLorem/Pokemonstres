class Attack {
    static all_moves={};
    constructor(attackData,speed) {
        this.moveId = attackData.move_id;
        this.name = attackData.name;
        this.type = attackData.type;
        this.power = attackData.power;
        this.duration = attackData.duration;
        this.speed = speed;
        Attack.all_moves[this.moveId]=this;
    }

    toString() {
        return this.name;
    }
}