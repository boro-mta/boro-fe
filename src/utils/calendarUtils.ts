export const checkExcludeDatesArrayContainsDate = (
  dateToCheck: Date,
  excludedDates: Date[]
): boolean => {
  for (let i = 0; i < excludedDates.length; i++) {
    if (
      dateToCheck.getDate() === excludedDates[i].getDate() &&
      dateToCheck.getMonth() === excludedDates[i].getMonth() &&
      dateToCheck.getFullYear() === excludedDates[i].getFullYear()
    ) {
      return true;
    }
  }

  return false;
};

export const getFormattedDate = (date: Date) => {
  const day = date
    .getDate()
    .toString()
    .padStart(2, "0"); // add leading zero if day < 10
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // add leading zero if month < 10
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

export const getDayAndDayNumber = (date: Date) => {
  const options = { weekday: "short" as const, day: "2-digit" as const };
  const formattedDate = date.toLocaleString("en-US", options);

  return formattedDate.split(" ");
};
