// enter_introduction.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    getUserInfo();
});

// 백엔드에서 유저 정보 불러오기
function getUserInfo(){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL
    const token = localStorage.getItem('accessToken');                      // 사용자의 토큰을 얻어옴 

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

// '아이디 찾기' 버튼을 click했을 떄 호출되는 함수 
function findID(){
    window.location.href='../findID_test.html';
}

// '비밀번호 변경' 버튼을 click 했을 떄 호출되는 함수 
function changePassword(){
    window.location.href='../changePassword_test.html';
    
}

// '프롬프트 템플릿 생성하기' 버튼을 click 했을 떄 호출되는 함수
function makePrompotTemplate(){
    window.location.href = '../makePromptTemplate_test.html';
}

// '탈퇴하기' 버튼을 click 했을 떄 호출되는 함수
function withdrawAccount(){
    window.location.href = '../withdrawAccount_test.html';
}