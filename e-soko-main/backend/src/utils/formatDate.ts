export const formatDate = (date: Date) => {
    const dateList = date.toISOString().replace(/[-:.TZ]/g, '').split('');
    const hours = (parseInt(dateList[8] + dateList[9]) + 3).toString();
    
    dateList.splice(8, 2, hours)

    return dateList.slice(0, 13).join('');
}