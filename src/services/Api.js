import axios from "axios";

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
            for (let key in _data) {
                form_data.append(key, _data[key]);
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
        return respond;
    }
}

export default Api;