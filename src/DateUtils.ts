export function getStartOfPreviousSevenDayPeriod(): Date {
    const currentDate = new Date();
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 6);

    const midnight = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));

    console.log(midnight);
    return midnight;
}
