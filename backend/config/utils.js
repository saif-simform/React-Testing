function parseTime(s) {
  var c = s.split(":");
  return parseInt(c[0]) * 60 + parseInt(c[1]);
}

const getDateRange = (fromDate, toDate) => {
  const fromYear = fromDate.getFullYear();
  const fromMonth = fromDate.getMonth();
  const toYear = toDate.getFullYear();
  const toMonth = toDate.getMonth();
  const months = [];
  for (let year = fromYear; year <= toYear; year++) {
    let monthNum = year === fromYear ? fromMonth : 0;
    const monthLimit = year === toYear ? toMonth : 11;
    for (; monthNum <= monthLimit; monthNum++) {
      let month = monthNum + 1;
      months.push({ year, month });
    }
  }
  const allMonths = months.map((el) => {
    let date = new Date(
      new Date(
        new Date(new Date().setDate(el.month)).setFullYear(el.year)
      ).setMonth(el.month - 1)
    );
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      firstDay,
      lastDay,
    };
  });
  return allMonths;
};
const getWeekRange = (startDate, endDate) => {
  let dates = [];
  const addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let currentDate = startDate;
  if (currentDate.getDay() > 0) {
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
  }
  while (currentDate <= endDate) {
    let endWeekDate = addDays.call(currentDate, 6);
    dates.push({ firstDay: currentDate, lastDay: endWeekDate });
    currentDate = addDays.call(currentDate, 7);
  }
  return dates;
};
module.exports = {
  parseTime,
  getDateRange,
  getWeekRange,
};
