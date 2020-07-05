
const {isNaturalNumber, isString} = require('./myUtil.js');
const {BoardOneMenuDTO} = require('./terminalBoard.js');

class Menu {
    constructor() {
        this.map = new Map;
    }
    addDrink(num, name, time) {
        if(!isNaturalNumber(num)) return false;
        if(!isNaturalNumber(time)) return false;
        if(!isString(name)) return false;

        this.map.set(num, {name, time});
        return true;
    }
    getDrink(num) {
        if(!isNaturalNumber(num)) return null;

        const {name, time} = this.map.get(num);
        return new Drink(name, time);
    }
    hasMenu(num) {
        return this.map.has(num);
    }
    getInfo() {
        const ret = [];
        for(const [num, {name, time}] of this.map.entries()) {
            ret.push(new BoardOneMenuDTO(num, name, time));
        }
        return ret;
    }
}

class Drink {
    constructor(name, time) {
        this.name = name;
        this.time = time;
    }
    getName() {return this.name;}
    getTime() {return this.time;}
}

module.exports = {Menu, Drink};