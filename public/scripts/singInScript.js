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