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
            eventEmitter.emit("checkWaitingOrder");
        }, 1000);
    }
}

module.exports = Manager;