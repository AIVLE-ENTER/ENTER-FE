const loginURL=`http://127.0.0.1:8000/account/auth/signIn/`;
const closeModalBtn = document.getElementById('closeModalBtn');
const syncBtn = document.getElementById('syncAccountBtn');
const signUpBtn = document.getElementById('signUpBtn');
const modal = document.getElementById('socialModal');
const syncView = document.getElementById('syncView');

// '로그인' 버튼 클릭했을 떄 호출되는 함수 (일반 로그인)
function signin() {
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

//calllback으로 받은 인가코드
const code = new URL(window.location.href).searchParams.get('code');
const type = new URL(window.location.href).searchParams.get('type');

// (카카오) 액세스 토큰 얻기
const KAKAO_CLIENT_ID = "e9e3fd4510c8fd8fd6562ccf5b0d7d32";
const KAKAO_CLIENT_SECRET = "dHIzOggDqbEEPAH5KyJru0Itnl7HpIsm";
const KAKAO_REDIRECT_URI = "http://localhost:5500/signin_test.html";

const getAccessToken = async () => {
    await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: `grant_type=authorization_code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}?type=kakao&code=${code}`,
    })
    .then((response) => response.json())
    .then((json) => {
        console.log("jason 값 : ", json)
        console.log("json.access_token 값 : ", json.access_token)
          
        Kakao.Auth.setAccessToken(json.access_token);
    })
    .catch((err) => {
        console.log("[getAccessToken] failed to request user information: " + JSON.stringify(err));
    });
};

// (카카오) 백엔드로 토큰 전송
const sendToken = async () => {
    await axios({
        url: "http://localhost:8000/account/kakaoLogin/", 
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        data: {
            access_token: Kakao.Auth.getAccessToken()
        }
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
            document.getElementById("socialType").value = "kakao";
            document.getElementById("socialId").value = response.data.data.id;   
        }
    })
    .catch(error => {
        console.log('실패', error);
    });
};

// 카카오 로그인
const kakaoLogin = async () => {
    await getAccessToken(); // 1. 액세스 토큰 받기
    await sendToken(); // 2. 백엔드로 보내기
}

// 네이버 로그인

// 구글 로그인


// code가 있으면?
if (code) {
    if (type == 'kakao') {
        kakaoLogin();
    } else if (type == 'naver') {
        console.log("네이버");
    } else if (type == 'google') {
        console.log('구글');
    }
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