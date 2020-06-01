const accountUrl = new URL(window.location.origin + '/account/');
const API_URL = window.location.origin + '/db/users';
const inputNickname = document.getElementById('inputNickname');
const singInForm = document.getElementById('singInForm');

singInForm.addEventListener('submit', ev => {
    ev.preventDefault();
    postData(API_URL, {name: inputNickname.value})
        .then((data) => {
            navigateTo(generateUrl('u', data._id) + '');
            console.log(data)
        })
        .catch(err => {
            console.log(err);
        })
})

function generateUrl(parameter, value) {
    let search_url = accountUrl.searchParams;
    accountUrl.search = search_url.toString()
    search_url.set(parameter, value);
    return accountUrl.toString();
}

function getParameter(parameter) {
    return accountUrl.searchParams.get(parameter).toString();
}

async function deleteUser(url = '', id) {
    return await fetch(url + '/' + id, {
        method: 'DELETE',
    });
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
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
    return await response.json();
}

function navigateTo(url) {
    window.location.href = url;
}

