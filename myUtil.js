// 유틸 함수이기 때문에 클래스로 하지는 않았다.
function isNaturalNumber(num) {
    if(!Number.isInteger(num)) return false;
    return num > 0;
}
function isString(txt) {
    return typeof txt === 'string';
}
module.exports = {isNaturalNumber, isString};