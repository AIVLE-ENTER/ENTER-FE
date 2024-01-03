const loginURL=`http://127.0.0.1:8000/account/auth/signIn/`;

// '로그인' 버튼 클릭했을 떄 호출되는 함수 
function signin() {
    const userData = {
        user_id: document.getElementById('input_id').value,
        password: document.getElementById('input_password').value
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

var closeModalBtn = document.getElementById('closeModalBtn');
var syncBtn = document.getElementById('syncAccountBtn');
var signUpBtn = document.getElementById('signUpBtn');
var modal = document.getElementById('socialModal');
var syncView = document.getElementById('syncView');

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

function socialLogin(type) {
    // 1. 각 소셜 로그인 연결 및 인가코드 받아오기

    // 2. 백엔드로 인가코드 전송

    // 3-1. 로그인 성공 (로그인 후 프롬포트로 이동)

    // 3-2. 로그인 실패 (모달 보여주기)
    modal.style.display = 'block';
}

// 소셜 로그인 모달창 관련 함수
// 1. 회원 가입

// 2. 로그인