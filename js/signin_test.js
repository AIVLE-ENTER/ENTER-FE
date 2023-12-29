function signin() {
    const loginURL=`http://127.0.0.1:8000/account/auth/signIn/`;
    const userData = {
        user_id: document.getElementById('input_id').value,
        password: document.getElementById('input_password').value
    };

    axios.post(loginURL, userData)
    .then(response => {
        // localStroage에 토큰(Token)을 적재한다.
        const accessToken = response['data']['data']['token'];
        localStorage.setItem('accessToken', accessToken);
<<<<<<< HEAD
        window.location.href = 'index_test.html';

=======
        
        // index_test.html로 Routing 한다.
        alert('로그인 완료!');
        window.location.href = '../index_test.html';
>>>>>>> 4bb20a6bb0d05a97f25e1928f4f94da9c63c7ebc
    })
    .catch(error => {
        console.log(error);
        alert('로그인에 실패하였습니다.')
    });
}