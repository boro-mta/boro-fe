export const checkExcludeDatesArrayContainsDate = (dateToCheck: Date, excludedDates: Date[]): boolean => {
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