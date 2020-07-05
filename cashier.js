const readline = require("readline");
const eventEmitter = require("./eventEmitter.js");
const {Menu} = require("./menu.js");
const {isNaturalNumber, isString} = require('./myUtil.js');

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
        this.menu = menu;
    }
    start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        let msg = ORDER_MSG;
        rl.setPrompt(msg);
        rl.prompt();
        rl.on("line", 
            // 파싱, 체크, 프롬프트호출, 이미터 호출등 하나의 메서드가 하는 일이 너무많다.
            // 어떻게 나눠야 할까?
            (textLine) => {
                if(!this.isCorrectFormat(textLine)) 
                    msg = WRONG_ORDER_MSG;
                else {
                    const [num, count] = this.parsing(textLine);
                    if(!this.menu.hasMenu(num)) 
                        msg = NOT_MENU_NUM;
                    else {
                        const drink = this.menu.getDrink(num);
                        eventEmitter.emit('newOrder', drink, count);
                        msg = `${drink.name} ${count}개 주문하셨습니다.`;
                    }
                }
                console.log(msg+"\n");
                rl.prompt();
            }
        );
        rl.on("close", () => {
            process.exit(); 
        });  
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