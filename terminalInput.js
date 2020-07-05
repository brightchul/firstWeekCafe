const readline = require("readline");
const eventEmitter = require("./eventEmitter.js");


const ORDER_MSG = "주문할 음료를 입력하세요 > ";
const WRONG_ORDER_MSG = "잘못된 주문입니다. ex) 1:2"
const NOT_MENU_NUM = "없는 메뉴 번호 입니다.";
const NOT_MENU_CLASS_ERR = "메뉴 클래스가 아닙니다.";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt(ORDER_MSG);

rl.on("line", (textLine) => {
    eventEmitter.emit('newTextLineInput', textLine);
    rl.prompt();
});

rl.on("close", () => {
    process.exit(); 
});  

function question() {
    rl.prompt();
}

module.exports = {question};