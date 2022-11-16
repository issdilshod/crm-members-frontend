class DateFormats {

    static last_message_date(dateTime)
    {
        let current = new Date();
        dateTime = new Date(dateTime);
        let result = dateTime.getMonth()+1 + '/' + dateTime.getDate() + '/' + dateTime.getFullYear();

        if (current.getFullYear()==dateTime.getFullYear() &&
            current.getMonth()==dateTime.getMonth() &&
            current.getDate()==dateTime.getDate()
        ){
            result = (dateTime.getHours()<10?'0'+dateTime.getHours():dateTime.getHours()) + ':' + (dateTime.getMinutes()<10?'0'+dateTime.getMinutes():dateTime.getMinutes());
        }

        return result;
    }

    static message_time(dateTime)
    {
        dateTime = new Date(dateTime);

        let hours = (dateTime.getHours()<10?'0'+dateTime.getHours():dateTime.getHours());
        let minutes = (dateTime.getMinutes()<10?'0'+dateTime.getMinutes():dateTime.getMinutes());

        let result = hours + ':' + minutes;
        return result;
    }

    static message_time_title(dateTime)
    {
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

    static message_day(dateTime)
    {
        let months = ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'];
        dateTime = new Date(dateTime);

        let month = dateTime.getMonth();
        let day = (dateTime.getDate()<10?'0'+dateTime.getDate():dateTime.getDate());

        let result = day + ' ' + months[month];
        return result;
    }

    static message_day_title(dateTime)
    {
        let months = ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'];
        dateTime = new Date(dateTime);

        let year = dateTime.getFullYear();
        let month = dateTime.getMonth();
        let day = (dateTime.getDate()<10?'0'+dateTime.getDate():dateTime.getDate());
        let result = day + ' ' + months[month] + ' ' + year;
        return result;
    }

    static check_different_day(lastDate, currentDate)
    {
        lastDate = new Date(lastDate);
        currentDate = new Date(currentDate);

        let lastRow = lastDate.getFullYear()+lastDate.getMonth()+lastDate.getDate();
        let currentRow = currentDate.getFullYear()+currentDate.getMonth()+currentDate.getDate();

        if (lastRow!=currentRow){
            return true;
        }

        return false;
    }
}

export default DateFormats;