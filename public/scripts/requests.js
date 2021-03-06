const API_URL = window.location.origin + '/db/users/';
const API_STATUS_URL = API_URL + 'update/status';
const API_SELECT_URL = API_URL + 'select'

function generateUrl(tag, parameter, value) {
    let url = new URL(window.location.origin + '/' + tag + '/');
    let search_url = url.searchParams;
    url.search = search_url.toString()
    search_url.set(parameter, value);
    return url;
}

function getParameter(parameter) {
    let url = new URL(window.location.href);
    return url.searchParams.get(parameter).toString();
}

function postData(url = '', data = {}) {
    const response = fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return setResponse(response, response.then(res => {
        return res.json();
    }));
}

function getData(url = '') {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
}

function setResponse(response, onSuccess = '', onError = 'An error occurred') {
    return response.then(response => {
        if (response.ok) {
            return Promise.resolve(onSuccess);
        } else {
            return Promise.reject(onError)
        }
    });
}

function navigateTo(url) {
    window.location = url;
}

function setActivityStatus(user, isActive) {
    user.isActive = isActive;
    postData(API_STATUS_URL, user)
}

