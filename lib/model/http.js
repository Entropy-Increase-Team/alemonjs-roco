import axios from 'axios';

function isHttpOk(status) {
    return status >= 200 && status < 300;
}
async function requestJson(config) {
    const response = await axios.request({
        ...config,
        validateStatus: () => true
    });
    return {
        status: response.status,
        data: response.data ?? null
    };
}
async function requestText(config) {
    const response = await axios.request({
        ...config,
        responseType: 'text',
        validateStatus: () => true
    });
    return {
        status: response.status,
        data: response.data ?? ''
    };
}

export { isHttpOk, requestJson, requestText };
