exports.addToUSerCache = (_id, data) => {
  require("../cache/userCache")[_id] = data;
  const datax = require("../cache/userCache");
  console.log(datax);
};
