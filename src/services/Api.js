import axios from "axios";

class Api {
    constructor(){
        this.backend_domain = process.env.REACT_APP_BACKEND_DOMAIN;
    }

    getToken(){
        return JSON.parse(localStorage.getItem('auth'));
    }

    async request(_url = '', _method = 'POST', _data = {}, _params = {}){
        // set token to header
        let config = {};
        let _token = await this.getToken();
        config.headers = { 'Authorization': 'Bearer ' + _token };

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