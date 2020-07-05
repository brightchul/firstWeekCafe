const {Menu} = require('./menu.js');
const Cashier = require('./cashier.js');
const Manager = require('./manager.js');
const Barista = require('./barista.js');
const terminalBoard = require('./terminalBoard.js');
const eventEmitter = require('./eventEmitter.js');
const orderQueue = require('./orderQueue.js');



console.clear();

// 메뉴 세팅
const menu = new Menu();
menu.addDrink(1, "아메리카노", 3);
menu.addDrink(2, "카페라떼", 5);
menu.addDrink(3, "프라프치노", 10);

const cashier = new Cashier(menu);
const manager = new Manager();
const barista = new Barista();


eventEmitter.on('moveCompleteOrder', order => {
    // 매니저는 받아서 전광판으로 보내준다.
    // console.log(`${order.id}번 ${order.getDrinkName()} ${order.count}개 모두 완성!!!`);
    manager.addCompleteOrder(order);
    terminalBoard.show();
});

eventEmitter.on('baristaAllowableNewOrder', () => {
    if(barista.possibleNewOrder()) {
        manager.sendToOrderBarista();
    }
});
eventEmitter.on('sendToOrderBarista', () => {
    barista.setNewOrder(orderQueue.dequeue());
    terminalBoard.show();
});

eventEmitter.on('overCapacity', newOrder => {
    console.warn("주문 허용치를 넘어섰습니다.!!!");
    orderQueue.splice(0, 0, newOrder);
});

eventEmitter.on('makingStart', drinkName => {
    terminalBoard.show();
    // console.log(`${drinkName} 시작!`);
});
eventEmitter.on('oneComplete', order => {
    // console.log(`${order.getDrinkName()} 완료!`);
    terminalBoard.show();
});

eventEmitter.on("newOrder", (drink, count) => {
    const flag = orderQueue.enqueue(drink, count);
    if(!flag) 
        console.log(`${drink.name} ${count}개 주문이 실패했습니다. 다시 시도해주세요. `);
    terminalBoard.show();
});


function start() {
    manager.intervalCheck();
    terminalBoard.setMenuText(menu.getInfo());
    terminalBoard.show();
    cashier.start();
}

module.exports = {start};