import axios from 'axios';
import config from '@/config';

const instance = axios.create({
    baseURL: config.BASE_URL,
    timeout: 6000,
    headers: {}
});

//请求拦截处理
instance.interceptors.request.use( config => {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//返回拦截处理
instance.interceptors.response.use( response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance;