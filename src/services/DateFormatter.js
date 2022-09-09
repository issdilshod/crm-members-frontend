class DateFormatter {

    static beautifulDate(dateTime){
        let year = dateTime.substr(0, 4);
        let month = dateTime.substr(5, 2);
        let day = dateTime.substr(8, 2);
        let monthes = {
            '01' : 'jan.', 
            '02' : 'feb.', 
            '03' : 'mar.', 
            '04' : 'apr.', 
            '05' : 'may', 
            '06' : 'jun.', 
            '07' : 'jul.', 
            '08' : 'aug.', 
            '09' : 'sep.', 
            '10' : 'oct.', 
            '11' : 'nov.', 
            '12' : 'dec.'
        };
        if(month!=0){
            month = monthes[month];
        }
        let date = day + ' ' + month + ' ' + year;
        let time = dateTime.substr(11, 5);
        let result = date + ' on ' + time;
        return result;
    }
}

export default DateFormatter;