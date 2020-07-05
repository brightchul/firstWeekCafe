const Order = require('./order.js');

function clear() {
    console.clear();
}

/**
 * @param {arr} orderArr Order객체의 배열을 받는다.
 */
function show(orderArr) {
    console.clear();
    showOrders(orderArr);
    showMenu();
    return true;
}

function showOrders(orderArr) {
    let txt = orderArr.reduce((txt, order) => txt + makeOneOrderTxt(order), "");
    console.log(txt);
}

const COMPLETE_COMMENT = "1잔 완료";
const MAKING_COMMENT = "1잔 만드는 중";
const WAITING_COMMENT = "1잔 대기 중";

function makeOneOrderTxt(orderObj) {
    checkOrderObj(orderObj);
    const {id, drink, count, waiting, making, complete} = orderObj;
    let txt = `${id}번 주문\n`;
    txt += makeOneDrinkStatusTxt(drink.getName(), complete, COMPLETE_COMMENT);
    txt += makeOneDrinkStatusTxt(drink.getName(), making, MAKING_COMMENT);
    txt += makeOneDrinkStatusTxt(drink.getName(), waiting, WAITING_COMMENT);
    return txt;
}
function checkOrderObj(target) {
    if(!(target instanceof Order)) 
        throw new TypeError("Order 객체가 아닙니다!!");
}
function makeOneDrinkStatusTxt(name, count, comment) {
    let txt = "";
    for(let i=0; i<count; i++) 
        txt += `\t${name} ${comment}\n`;
    return txt;
}

let menuText = undefined;
const MENU_NOT_SETTING_MSG = "메뉴가 생성되지 않았습니다.";
/**
 * menu는 [BoardOneMenuDTO,...]로 받는다.
 * @param {arr} menuArr 
 */
function setMenuText(menuArr) {
    menuText = menuArr.reduce((txt,oneMenu) => {
        isBoardOneMenuDTO(oneMenu);
        return `${txt}    ${oneMenu.toString()})`;
    }, "[[") + "    ]]";
    return true;
}

/**
 * 
 * @param {BoardOneMenuDTO} obj : 클래스 체크
 */
function isBoardOneMenuDTO(obj) {
    if(!(obj instanceof BoardOneMenuDTO))
        throw new TypeError("BoardOneMenuDTO 객체가 아닙니다.!!");
}
class BoardOneMenuDTO {
    constructor(num, name, time) {
        this.num = num;
        this.name = name;
        this.time = time;
    }
    toString() {
        return `${this.num}. ${this.name} (${this.time})s`;
    }
}

function showMenu() {
    if(!menuText) return console.log(MENU_NOT_SETTING_MSG);
    console.log(menuText);
}

module.exports = {show, setMenuText, BoardOneMenuDTO};