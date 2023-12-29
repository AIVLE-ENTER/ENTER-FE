<<<<<<< HEAD
// 0. 토큰(로그인 여부) 확인
const myToken = localStorage.getItem('accessToken')
if (myToken === null) {
    alert('로그인이 필요합니다.')
    window.location.href = '../index_test.html';
} else {
    // 1. 페이지 라우팅
    mypageURL = `http://127.0.0.1:8000/board/myinfo/`;
    const config = {
        headers: {
            'Authorization': JSON.stringify({'Authorization': `Bearer ${myToken}`})
        }
    }
=======
const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL
const token = localStorage.getItem('accessToken');                      // 사용자의 토큰을 얻어옴 

// enter_introduction.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo();
    } 
    // 비로그인 상태이면?
    else {
        alert('로그인을 해야 합니다.');
        window.location.href='../index_test.html';
    }
});

// 백엔드에서 유저 정보 불러오기
function getUserInfo(){
    // 백엔드 유저 정보 불러오기 
    axios({
        method: 'get',
        url: getUserInfo_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        const user_id=response.data['data']['user_id'];   // 아이디를 가져온다.
        document.querySelector('.header-link h3').textContent = `${user_id}님 안녕하세요!!`; // h3 태그에 보여준다.
    })
    .catch(error => {
        // 오류가 발생하면 이 부분이 실행됩니다.
        alert('유저 정보 불러오기 오류');
    });
}







// '회원 정보 수정하기' 버튼을 click 했을 떄 호출되는 함수 
function routeToEditMyInfo() {
    window.location.href = '../editMyInfo_test.html';
}
>>>>>>> 4bb20a6bb0d05a97f25e1928f4f94da9c63c7ebc

    axios.get(mypageURL, config)
    .then(response => {
        console.log('success');
        
        mypageInfo = response['data'];
        console.log(mypageInfo);

        mypageId = document.querySelector('.content-body-item-body1')
        mypagePw = document.querySelector('.content-body-item-body2')
        mypageName = document.querySelector('.content-body-item-body3')
        mypageEmail = document.querySelector('.content-body-item-body4')
        mypageRole = document.querySelector('.content-header-usertype')

        mypageId.append(mypageInfo['user_id']);
        mypagePw.append(mypageInfo['password']);
        mypageName.append(mypageInfo['user_name']);
        mypageEmail.append(mypageInfo['user_email']);
        if (mypageInfo['role'] === 'user') {
            mypageRole.append('사용자');
        } else {
            mypageRole.append('관리자');
        }
    })
    .catch(error => {
        console.log('failed');
        console.log(error);
    })
}
(window.screen.width / 2) - (popupWidth / 2);
// 2. 비밀번호 변경
function changePassword(){
    const popupUrl = "changePassword_test.html";
    const popupName = "비밀번호 변경";

    var popWidth = (document.body.offsetWidth / 2) - (600 / 2);
    var popHeight = (window.screen.height / 2) - (600 / 2);

    const popupOption = "location = no, width = 600, height = 600, top = " + popHeight + ",left = " + popWidth;
    console.log(popupOption);
    window.open(popupUrl, popupName, popupOption);
    
}

// 3. 회원 탈퇴
function withdrawAccount(){
    window.location.href = '../withdrawAccount_test.html';
}