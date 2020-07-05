const readline = require("readline");
const eventEmitter = require("./eventEmitter.js");
const {Menu} = require("./menu.js");
const {isNaturalNumber, isString} = require('./myUtil.js');
const Order = require("./order.js");

const ORDER_MSG = "주문할 음료를 입력하세요 > ";
const WRONG_ORDER_MSG = "잘못된 주문입니다. ex) 1:2"
const NOT_MENU_NUM = "없는 메뉴 번호 입니다.";
const NOT_MENU_CLASS_ERR = "메뉴 클래스가 아닙니다.";

const checkMenuClass = v => {
    if(!(v instanceof Menu)) 
        throw NOT_MENU_CLASS_ERR;
}

class Cashier {
    constructor(menu) {
        checkMenuClass(menu);
        this.orderCount = 1;
        this.menu = menu;
        // this.rl = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // });
    }
    order(orderText) {
        if(!this.isCorrectFormat(orderText)) 
            return eventEmitter.emit('wrongOrderFormat', WRONG_ORDER_MSG);

        const [num, count] = this.parsing(orderText);
        if(!this.menu.hasMenu(num)) 
            return eventEmitter.emit('notMenuNumber', NOT_MENU_NUM);
        
        const drink = this.menu.getDrink(num);
        const order = new Order(this.orderCount++, drink, count);
        eventEmitter.emit('newOrder', order);
    }
    
    /**
     * '숫자:숫자' 포맷을 확인한다.
     * @param {string} text 
     */
    isCorrectFormat(text) {
        if(text.length === 0) return false;
        if(!this.checkSemicolon(text)) return false;
        if(!this.checkNumber(...this.parsing(text))) return false;

        return true;
    }

    /**
     * ':' 가 없는지 확인
     * ':' 가 가장 첫번째, 끝에 있는지 확인
     * ':' 가 2개 이상 있는지 확인
     * @param {string} text 
     */
    checkSemicolon(text) {
        const leftIndex = text.indexOf(':');
        const rightIndex = text.lastIndexOf(':');

        if(leftIndex === -1) return false;
        if(leftIndex === 0 || rightIndex === text.length-1) return false;
        if(leftIndex !== rightIndex) return false;

        return true;
    }

    checkNumber(...targets) {
        if(targets.length === 0) return false;
        return targets.every(isNaturalNumber);
    }

    parsing(text) {
        return text.split(':').map(o => parseInt(o));
    }
}

module.exports = Cashier;