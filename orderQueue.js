const {Drink} = require("./menu.js");
const Order = require("./order.js");

const queue = [];
let id = 1;

function enqueue(drink, count) {
    if(!(drink instanceof Drink)) return false;
    const order = new Order(id++, drink, count);
    queue.push(order);
    const text = queue.reduce((txt, order) => {
        return `${txt}\n${order.id}번 : ${order.getDrinkName()} ${order.count}개`;
    }, '');
    console.log(queue.length + "개수 ");
    console.log(text);
    return true;
}
function hasOrder() {
    return queue.length > 0;
}
function dequeue() {
    return queue.shift();
}

function length() {
    return queue.length;
}

function front() {
    return queue[0];
}
function show() {
    console.log(queue);
}

module.exports = {enqueue, dequeue, length, front, show, hasOrder};