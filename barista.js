const Order = require('./order.js');
const eventEmitter = require('./eventEmitter.js');

class Barista {
    constructor({capacity = 2, makingQueue}) {
        this.capacity = capacity;
        this.currentOrder = 0;
        this.notCompleteOrder = 0;           // order의 waiting, making 총합을 받는다.
        this.makingQueue = makingQueue;
        this.orderArr = [];
    }
    possibleNewOrder() {
        return this.capacity > this.notCompleteOrder;
    }
    possibleNewMaking() {
        return this.capacity > this.currentOrder;
    }
    setNewOrder(newOrder) {
        if(!(newOrder instanceof Order)) 
            throw new TypeError("Order 클래스가 아닙니다.");
        if(!this.possibleNewOrder()) 
            return eventEmitter('overCapacity', newOrder);

        this.makingQueue.enqueue(newOrder);
        this.calculateNotCompleteOrder();
        this.startMaking();
    }
    calculateNotCompleteOrder() {
        this.notCompleteOrder = this.makingQueue.reduce(
            (total, order) => total + order.getNotComplete(), 0);
    }
    run() {
        if(!this.hasWaitDrink()) return;
        this.startMaking();
    }
    hasWaitDrink() {
        if(this.makingQueue.length == 0) return false;
        if(!this.possibleNewMaking()) return false;
        if(!this.getWaitingOrder()) return false;

        return true;
    }
    startMaking() {
        const order = this.getWaitingOrder();
        order.makingOne();
        ++this.currentOrder;
        eventEmitter.emit('makingStart');

        new Promise((res,rej)=> {
            setTimeout(() => res(order), order.getOneMakingTime() * 1000);
        }).then(order => {
            this.completeDrink(order);
            this.run(); // 만들던 것이 완료되면 그 다음 주문들을 처리하기 위함
        });
        this.run(); // 2개 이상 주문을 했을 때 동시 처리를 위함
    }
    getWaitingOrder() {
        return this.makingQueue.find(order => order.hasWaiting());
    }
    removeOrder(order) {
        const orderIndex = this.makingQueue.indexOf(order);
        this.makingQueue.splice(orderIndex, 1);
    }
    completeDrink(order) {
        order.completeOne();
        eventEmitter.emit('completeOne', order);
        this.decreaseNotCompleteOrder();

        if(order.isAllComplete()) {
            this.allComplateOrder(order);
        }
    }
    decreaseNotCompleteOrder() {
        --this.notCompleteOrder;
        --this.currentOrder;
    }
    allComplateOrder(order) {
        this.removeOrder(order);
        eventEmitter.emit('moveCompleteOrder', order);
    }
}

module.exports = Barista;