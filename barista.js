const Order = require('./order.js');
const eventEmitter = require('./eventEmitter.js');



class Barista {
    constructor(capacity = 2) {
        this.capacity = capacity;
        this.current = 0;
        this.notCompleteOrder = 0;           // order의 waiting, making 총합을 받는다.
        this.orderArr = [];
    }
    possibleNewOrder() {
        return this.capacity > this.notCompleteOrder;
    }
    possibleNewMaking() {
        return this.capacity > this.current;
    }
    setNewOrder(newOrder) {
        if(!(newOrder instanceof Order)) throw "Order 클래스가 아닙니다.";
        if(!this.possibleNewOrder()) return eventEmitter('overCapacity', newOrder);

        this.orderArr.push(newOrder);
        this.calculateNotCompleteOrder();
        this.startMaking();
    }
    calculateNotCompleteOrder() {
        this.notCompleteOrder = this.orderArr.reduce((total, order) => total + order.getNotComplete(), 0);
    }
    run() {
        if(!this.hasWaitDrink()) return;
        this.startMaking();
        this.run();
    }
    hasWaitDrink() {
        if(this.orderArr.length == 0) return false;
        if(!this.possibleNewMaking()) return false;
        if(!this.getWaitingOrder()) return false;
        return true;
    }
    startMaking() {
        const order = this.getWaitingOrder();
        order.makingOne();
        ++this.current;
        eventEmitter.emit('makingStart', order.getDrinkName());

        new Promise((res,rej)=> {
            setTimeout(() => res(order), order.getOneMakingTime() * 1000);
        }).then(order => {
            this.completeDrink(order);
            this.run();
        });
    }
    getWaitingOrder() {
        return this.orderArr.find(order => order.hasWaiting());
    }
    removeOrder(order) {
        const orderIndex = this.orderArr.indexOf(order);
        this.orderArr.splice(orderIndex, 1);
    }
    completeDrink(order) {
        order.completeOne();
        eventEmitter.emit('oneComplete', order);
        --this.notCompleteOrder;
        --this.current;

        if(order.isAllComplete()) {
            this.removeOrder(order);
            eventEmitter.emit('moveCompleteOrder', order);
        }
    }
}

module.exports = Barista;