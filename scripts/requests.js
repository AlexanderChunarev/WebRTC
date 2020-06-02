let accountUrl;
const API_URL = window.location.origin + '/db/users';

function generateUrl(parameter, value) {
    accountUrl = new URL(window.location.origin + '/account/');
    let search_url = accountUrl.searchParams;
    accountUrl.search = search_url.toString()
    search_url.set(parameter, value);
    return accountUrl;
}

function getParameter(parameter) {
    accountUrl = new URL(window.location.href);
    return accountUrl.searchParams.get(parameter).toString();
}

function deleteUser(url = '', id) {
    const response = fetch(url + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.then(response => {
        if (response.ok) {
            return Promise.resolve('User deleted');
        } else {
            return Promise.reject('An error occurred')
        }
    });
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
    return response.then(response =>
        response.json().then(json => {
            console.log(json);
            return json;
        }));
}

function navigateTo(url) {
    window.location.href = url;
}

