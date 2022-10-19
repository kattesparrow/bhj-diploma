/**
* Основная функция для совершения запросов
* на сервер.
* */

const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.responseType = 'json';
    let url = options.url;
    
    if (options.data) {
        if (options.method === 'GET') {
            url += '?' + Object.entries(options.data).map(
                ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            ).join('&');
        } else {
            Object.entries(options.data).forEach(element => formData.append(...element));
        }
    }
    try {
        xhr.open(options.method, url);
        if(options.method === 'GET') {
            xhr.send();
        } else {
            xhr.send(formData);
        }
    }
    catch (e) {
        callback(e);
    }

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            let err = null;
            let resp = null;

            if(xhr.status != 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {
                const rs = xhr.response;
                if(rs && rs.success) {
                    resp = rs;
                } else {
                    err = rs;
                }
            }
            options.callback(err, resp);
        }
    }
};


