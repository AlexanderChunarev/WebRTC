window.onbeforeunload = function() {
    deleteUser(API_URL, getParameter('u'))
        .catch(err => {
            console.log(err);
        });
}