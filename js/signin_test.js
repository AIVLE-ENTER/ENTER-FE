const loginURL=`http://127.0.0.1:8000/account/auth/signIn/`;
const signUpURL = `http://localhost:5500/signup_test.html`;
const closeModalBtn = document.getElementById('closeModalBtn');
const syncBtn = document.getElementById('syncAccountBtn');
const signUpBtn = document.getElementById('signUpBtn');
const modal = document.getElementById('socialModal');
const syncView = document.getElementById('syncView');

// '로그인' 버튼 클릭했을 떄 호출되는 함수 (일반 로그인)
function signin() {
    console.log('로그인 버튼 클릭');
    
    const userData = {
        user_id: document.getElementById('input_id').value,
        password: document.getElementById('input_password').value,
        type: "",
    };

    axios.post(loginURL, userData)
    .then(response => {
        // localStroage에 토큰(Token)을 적재한다.
        const accessToken = response['data']['data']['token'];
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

// '로그인' button mouseOver 했을 떄 실행되는 함수
function changeButtonStyle(button) {
    button.style.boxShadow = '3px 3px 8px rgba(0, 0, 0, 0.5)'; // 마우스 오버 시 그림자 추가
}
  
// '로그인' button  mouseOut 했을 떄 실행되는 함수 
function resetButtonStyle(button) {
    button.style.boxShadow = 'none'; // 마우스 아웃 시 그림자 제거
}

//calllback으로 받은 인가코드
const code = new URL(window.location.href).searchParams.get('code');
const type = new URL(window.location.href).searchParams.get('type');

// 소셜 로그인
const socialLogin = async(type) => {
    axios({
        url: `http://localhost:8000/account/${type}Login/`,
        method: 'post',
        data: {code: code},
    })
    .then(response => {
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        // 2-1. 로그인 성공 (로그인 후 프롬프트 페이지로 이동)
        if (response.data.message == "exists") {
            console.log("로그인 성공");
            // localStroage에 토큰(Token)을 적재한다.
            const accessToken = response.data.data.token;
            setWithExpire('accessToken', accessToken, 12*60*60*1000); //12 시간

            // index_test.html로 Routing 한다.
            alert('로그인 완료!');
            window.location.href = '../index_test.html';
        } else {
            // 2-2. 로그인 실패 (모달창 띄우기)
            modal.style.display = 'block';
            document.getElementById("socialType").value = type;
            document.getElementById("socialId").value = response.data.data.id;
            document.getElementById("signUpBtn").setAttribute("onclick", `location.href='${signUpURL}?type=${type}&socialId=${response.data.data.id}'`);
        }
    })
    .catch(error => {
        console.log('실패', error);
    });
}

// code가 있으면?
if (code) {
    socialLogin(type);
}
    
// 모달창 이벤트 처리
// 모달 닫기 버튼 클릭 시 이벤트 처리
closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    syncView.style.display = 'none';
});

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        syncView.style.display = 'none';
    }
}); 

// 기존 회원 연동 버튼 클릭시
syncBtn.addEventListener('click', function () {
    syncView.style.display = 'flex';
})

// 소셜 연동 로그인
function syncLogin() {
    userData = {
        type: document.getElementById("socialType").value,
        social_id: document.getElementById("socialId").value,
        user_id: document.getElementById("syncId").value,
        password: document.getElementById("syncPassword").value,
    }

    axios.post(loginURL, userData)
    .then(response => {
        // localStroage에 토큰(Token)을 적재한다.
        const accessToken = response['data']['data']['token'];
        setWithExpire('accessToken', accessToken, 12*60*60*1000); //12 시간
        alert('로그인 완료!');
        window.location.href = '../index_test.html';
    })
    .catch(error => {
        console.log(error);
        alert('로그인에 실패하였습니다.')
    });

}