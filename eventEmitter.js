// 전역객체로 사용하기 위한 이벤트 이미터
const events = require('events');
const eventEmitter = new events.EventEmitter();

module.exports = eventEmitter;