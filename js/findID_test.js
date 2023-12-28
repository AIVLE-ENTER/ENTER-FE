function findId() {
    const findIdURL=`http://127.0.0.1:8000/account/auth/findID/`;
    const userData = {
        user_name: document.getElementById('name').value,
        email: document.getElementById('input_email').value
    };

    console.log(userData);

    axios.post(findIdURL, userData)
    .then(response => {
        alert('아이디 찾기에 성공했습니다.');
        console.log(response);
    })
    .catch(error => {
        console.log(error);
        alert('아이디 찾기에 실패하였습니다.')
    });

}