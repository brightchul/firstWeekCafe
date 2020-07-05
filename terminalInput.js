// terminalInput는 하나만 사용한다고 생각해서 모듈로 했다.
const readline = require("readline");
const eventEmitter = require("./eventEmitter.js");


const ORDER_MSG = "주문할 음료를 입력하세요 > ";

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