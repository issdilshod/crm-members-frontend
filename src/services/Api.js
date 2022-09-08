import axios from "axios";
import { Navigate } from "react-router-dom";

class Api {
    constructor(){
        this.backend_domain = process.env.REACT_APP_BACKEND_DOMAIN;
    }

    getToken(){
        return JSON.parse(localStorage.getItem('auth'));
    }

    async request(_url = '', _method = 'POST', _data = {}, _file = false, _params = {}){
        // set token to header
        let config = {};
        let _token = await this.getToken();
        config.headers = { 'Authorization': 'Bearer ' + _token,
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': '*',
                        };
        
        // with file
        if (_file){
            config.headers = { ...config.headers, ...{'Content-Type': 'multipart/form-data'} };
            var form_data = new FormData();
            for (let items_key in _data) {
                // if file 
                if (typeof _data[items_key] == 'object'){
                    for (let item_key in _data[items_key]){
                        form_data.append(items_key, _data[items_key][item_key]);
                    }
                }else{
                    form_data.append(items_key, _data[items_key]);
                }
            }
            _data = form_data;
        }

        // create request config
        config = {
            ...config,
            ...{
              method: _method,
              data: _data,
              params: _params,
              url: process.env.REACT_APP_BACKEND_DOMAIN + _url
            },
          };
        const temConf = { ...config };
        let respond = {};

        await axios(temConf).then((response) => {
            respond = response;
        }).catch((error) => {
            respond = error.response;
        });

        // if 401 then remove token
        if (respond.status === 401){
            localStorage.removeItem('auth');
        }

        return respond;
    }
}

export default Api;