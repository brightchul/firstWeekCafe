class Order {
    constructor(id, drink, count) {
        this.id = id;
        this.drink = drink;
        this.count = count;
        this.waiting = count;
        this.making = 0;
        this.complete = 0;
    }
    getNotComplete() {
        return this.waiting + this.making;
    }
    hasWaiting() {
        return this.waiting > 0;
    }
    hasMaking() {
        return this.making > 0;
    }
    getDrinkName() {
        return this.drink.getName();
    }
    getOneMakingTime() {
        return this.drink.getTime();
    }
    isAllComplete() {
        return this.count === this.complete;
    }
    makingOne() {
        if(this.waiting > 0) {
            this.waiting--;
            this.making++;
        }
    }
    completeOne() {
        if(this.making > 0) {
            this.making--;
            this.complete++;
        }
    }
}

module.exports = Order;