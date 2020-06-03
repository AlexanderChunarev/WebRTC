const inputNickname = document.getElementById('inputNickname');
const singInForm = document.getElementById('singInForm');

singInForm.addEventListener('submit', ev => {
    ev.preventDefault();
    postData(API_URL, {name: inputNickname.value})
        .then((user) => {
            navigateTo(generateUrl('account', 'u', user._id) + '');
        })
        .catch(err => {
            console.log(err);
        })
})