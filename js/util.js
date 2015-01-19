var pad = function(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
};

var fromDate = function(date) {
  //return date.getYear() + 1900 + "" + date.getMonth() + 1 + "" date.getDate();
  return date.getYear() + 1900 + "" + pad(date.getMonth() + 1) + "" + pad(date.getDate());
  //return date;
};

var toTimestamp = function(date) {
  return fromDate(date) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
}

var toEpoch = function(date) {
  return date.valueOf().toString();
}

var fromEpoch = function(epoch) {
  return parseInt(epoch);
}

var isEmptyObj = function(obj) {
  return !(Object.keys(obj).length);
}