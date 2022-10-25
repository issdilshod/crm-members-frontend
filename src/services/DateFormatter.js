class DateFormatter {

    static beautifulDate(dateTime){
        let months = ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'];
        dateTime = new Date(dateTime);

        let year = dateTime.getFullYear();
        let month = dateTime.getMonth();
        let day = (dateTime.getDate()<10?'0'+dateTime.getDate():dateTime.getDate());
        let hours = (dateTime.getHours()<10?'0'+dateTime.getHours():dateTime.getHours());
        let minutes = (dateTime.getMinutes()<10?'0'+dateTime.getMinutes():dateTime.getMinutes());
        let result = day + ' ' + months[month] + ' ' + year + ' on ' + hours + ':' + minutes;
        return result;
    }
}

export default DateFormatter;