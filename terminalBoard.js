// 터미널 보드는 하나만 있으면 되기에 모듈로 끝냈다.

const Order = require('./order.js');

const COMPLETE_COMMENT = "1잔 완료";
const MAKING_COMMENT = "1잔 만드는 중";
const WAITING_COMMENT = "1잔 대기 중";
const MENU_NOT_SETTING_MSG = "메뉴가 생성되지 않았습니다.";

const WAITING_ORDERS_TEXT = "========[ 대기하는 주문 ]========";
const MAKING_ORDERS_TEXT  = "========[만드는 중인 주문]========";
const COMPLETE_ORDERS_TEXT ="========[  완료된 주문  ]========";

let menuText = undefined;   // 메뉴 텍스트를 저장한다.

/**
 * 
 * @param {Queue} waitingQueue 
 * @param {Queue} makingQueue 
 * @param {Queue} completeQueue 
 */
function show(waitingQueue, makingQueue, completeQueue, msg="") {
    let boardTxt = makeOrdersTxt(WAITING_ORDERS_TEXT, waitingQueue);
    boardTxt += makeOrdersTxt(MAKING_ORDERS_TEXT, makingQueue);
    boardTxt += makeOrdersTxt(COMPLETE_ORDERS_TEXT, completeQueue);
    boardTxt += getMenuTxt();
    boardTxt += "\n" + msg;

    console.clear();
    console.log(boardTxt);

    return true;
}

function makeOrdersTxt(text, queue) {
    let ret = text;
    ret += queue.reduce((txt, order) => txt + makeOneOrderTxt(order), "\n") + "\n";
    return ret;
}


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
    for(let i=0; i<count; i++) txt += `\t${name} ${comment}\n`;
    return txt;
}

/**
 * menu는 [BoardOneMenuDTO,...]로 받는다.
 * @param {arr} menuArr 
 */
function setMenuText(menuArr) {
    menuText = menuArr.reduce((txt,oneMenu) => {
        isBoardOneMenuDTO(oneMenu);
        return `${txt}    ${oneMenu.toString()})`;
    }, "[[") + "    ]]\n";
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

function getMenuTxt() {
    if(!menuText) return console.log(MENU_NOT_SETTING_MSG);
    return menuText
}

module.exports = {show, setMenuText, BoardOneMenuDTO};