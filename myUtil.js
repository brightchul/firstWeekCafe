
function isNaturalNumber(num) {
    if(!Number.isInteger(num)) return false;
    return num > 0;
}
function isString(txt) {
    return typeof txt === 'string';
}
module.exports = {isNaturalNumber, isString};