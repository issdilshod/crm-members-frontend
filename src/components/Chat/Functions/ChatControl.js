
class ChatControl{

    static getPartnerName(meUuid, members){
        let result = '';
        for (let key in members){
            if (meUuid!=members[key]['user_uuid'])
            {
                result = members[key]['first_name'] + ' ' + members[key]['last_name'];
            }
        }
        return result;
    } 

    static getPartnerLastSeen(meUuid, members){
        let result = '';
        for (let key in members){
            if (meUuid!=members[key]['user_uuid'])
            {
                result = members[key]['last_seen'];
            }
        }
        return result;
    } 
}

export default ChatControl;