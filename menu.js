
const {isNaturalNumber, isString} = require('./myUtil.js');
const {BoardOneMenuDTO} = require('./terminalBoard.js');

// [ 메뉴  =  1. 아메리카노(3s)    2. 카페라떼(5s)    3. 프라프치노(10s) ]
// 3가지 메뉴를 일단은 가진다.

class Menu {
    constructor() {
        this.map = new Map;
    }
    addDrink(num, name, time) {
        if(num === undefined || name === undefined || time === undefined) {
            return false;
        }
        if(!isNaturalNumber(num)) return false;
        if(!isNaturalNumber(time)) return false;
        if(!isString(name)) return false;

        this.map.set(num, {name, time});
        return true;
    }
    getDrink(num) {
        if(!isNaturalNumber(num)) return null;
        const {name, time} = this.map.get(num);
        const drink = new Drink(name, time);
        return drink;
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