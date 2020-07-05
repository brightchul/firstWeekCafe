const orderQueue = require('./orderQueue.js');
const eventEmitter = require('./eventEmitter.js');



class Manager {
    constructor() {
        this.completeOrderArr = [];
    }
    addCompleteOrder(order) {
        this.completeOrderArr.push(order);
    }
    intervalCheck() {
        setInterval(() => {
            if(orderQueue.hasOrder()) {
                eventEmitter.emit('baristaAllowableNewOrder');
            }
        }, 1000);
    }
    sendToOrderBarista() {
        eventEmitter.emit('sendToOrderBarista');
    }
}

module.exports = Manager;