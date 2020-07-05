class Queue extends Array{
    constructor(...args) {
        super(...args);
    }
    enqueue(v) {
        super.push(v);
        return true;
    }
    dequeue() {
        return super.shift();
    }
    push(v) {
        throw new Error("push()는 사용할 수 없습니다.");
    }
    shift() {
        throw new Error("shift()는 사용할 수 없습니다.");
    }
    isEmpty() {
        return this.length === 0;
    }
}

module.exports = Queue;