// import dateTool from "date-and-time";
// /**
//  *
//  * @param date
//  * @return
//  */
// function dateWhenTracker(date: Date) {
//   const now = new Date();

//   const dateDiff = dateTool.subtract(now, date);
//   const minuteDiff = Math.floor(dateDiff.toMinutes());
//   const hourDiff = Math.floor(dateDiff.toHours());
//   const dayDiff = Math.floor(dateDiff.toDays());

//   if (minuteDiff < 60) return minuteDiff + "m";
//   if (hourDiff < 24) return hourDiff + "h";
//   if (dayDiff < 6) return dayDiff + "d";
//   if (dayDiff > 364) return dateTool.format(date, "MMM D, YYYY");
//   if (dayDiff > 6) return dateTool.format(date, "MMM D");
// }

const myArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(myArr.pop());
console.log(myArr)