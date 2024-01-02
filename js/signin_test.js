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
        const setWithExpire = (key, value, exp) => {
            let now = new Date(); // 현재 날짜와 시간
            const item = {[`${key}`]: value, expires: now.getTime() + exp}
            // item의 형태로 로컬에 저장
            localStorage.setItem(key, JSON.stringify(item));
        }
        setWithExpire('accessToken', accessToken, 12*60*60*1000); //12 시간

        console.log(response.data);

        // index_test.html로 Routing 한다.
        alert('로그인 완료!');
        window.location.href = '../index_test.html';
    })
    .catch(error => {
        console.log(error);
        alert('로그인에 실패하였습니다.')
    });
}