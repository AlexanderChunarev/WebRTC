const inputNickname = document.getElementById('inputNickname');
const inputPassword = document.getElementById('inputPassword');
const signIn = document.getElementById('signIn');
const singUp = document.getElementById('signUp');

signIn.addEventListener('click', () => {
    if (inputNickname.value.trim() !== '' && inputPassword.value.trim() !== '') {
        postData(API_SELECT_URL, {name: inputNickname.value})
            .then(res => {
                if (res.length === 1) {
                    login(res[0])
                } else {
                    alert("User with nickname: " + inputNickname.value + "does not exist.");
                }
            });
    }
})

singUp.addEventListener('click', () => {
    if (inputNickname.value.trim() !== '' && inputPassword.value.trim() !== '') {
        postData(API_SELECT_URL, {name: inputNickname.value})
            .then(res => {
                if (res.length === 0) {
                    register({name: inputNickname.value, password: inputPassword.value})
                } else {
                    alert("User with this nickname already exist.");
                }
            });
    }
})

function login(user) {
    if (user.name === inputNickname.value && user.password === inputPassword.value) {
        navigateTo(generateUrl('account', 'u', user._id) + '');
    } else {
        alert("Invalid login or password.");
    }
}

function register(user) {
    postData(API_URL, user)
        .then((user) => {
            navigateTo(generateUrl('account', 'u', user._id) + '');
        })
        .catch(err => {
            console.log(err);
        })
}