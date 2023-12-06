let currentDate = new Date();

let formattedDate = currentDate.toISOString().split("T")[0];

module.exports = { formattedDate };
