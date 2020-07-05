// 까페는 단 하나만 있다고 가정했고 그래서 클래스로 따로 만들지는 않았다.
const {Menu} = require('./menu.js');
const Cashier = require('./cashier.js');
const Manager = require('./manager.js');
const Barista = require('./barista.js');
const Queue = require('./queue.js');

const terminalInput = require('./terminalinput.js');
const terminalBoard = new require('./terminalBoard.js');
const eventEmitter = require('./eventEmitter.js');

const makingQueue = new Queue();
const waitingQueue = new Queue();
const completeQueue = new Queue();

const menu = new Menu();
const manager = new Manager();
const cashier = new Cashier(menu);
const barista = new Barista({makingQueue});

eventEmitter.on('newTextLineInput', textLine => {
    cashier.order(textLine);
});

eventEmitter.on('moveCompleteOrder', order => {
    completeQueue.enqueue(order);
    terminalBoard.show(waitingQueue, makingQueue, completeQueue);
    terminalInput.question();
});

eventEmitter.on('checkWaitingOrder', () => {
    if(!waitingQueue.isEmpty()) {
        eventEmitter.emit('baristaAllowableNewOrder');
    }
});

eventEmitter.on('baristaAllowableNewOrder', () => {
    if(barista.possibleNewOrder()) {
        const order = waitingQueue.dequeue();
        barista.setNewOrder(order);
        terminalBoard.show(waitingQueue, makingQueue, completeQueue);
        terminalInput.question();
    }
});

eventEmitter.on('overCapacity', newOrder => {
    console.warn("주문 허용치를 넘어섰습니다.!!!");
    waitingQueue.splice(0, 0, newOrder);
});

eventEmitter.on('makingStart', () => {
    terminalBoard.show(waitingQueue, makingQueue, completeQueue);
    terminalInput.question();
});
eventEmitter.on('completeOne', order => {
    terminalBoard.show(waitingQueue, makingQueue, completeQueue);
    terminalInput.question();
});

eventEmitter.on("wrongOrderFormat", (msg) => {
    terminalBoard.show(waitingQueue, makingQueue, completeQueue, msg);
    terminalInput.question();
});

eventEmitter.on("notMenuNumber", (msg) => {
    terminalBoard.show(waitingQueue, makingQueue, completeQueue, msg);
    terminalInput.question();
});

eventEmitter.on("newOrder", (order) => {
    waitingQueue.enqueue(order);
    terminalBoard.show(waitingQueue, makingQueue, completeQueue);
    terminalInput.question();
});



function menuSetting(menu) {
    menu.addDrink(1, "아메리카노", 3);
    menu.addDrink(2, "카페라떼", 5);
    menu.addDrink(3, "프라프치노", 10);
}

function start() {
    menuSetting(menu);
    manager.intervalCheck();
    terminalBoard.setMenuText(menu.getInfo());
    terminalBoard.show(waitingQueue, makingQueue, completeQueue);
    terminalInput.question();
}

module.exports = {start};