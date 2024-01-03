// 전역 변수
let user_id; // 사용자 id 
let token;   // 토큰 

// withdrawAccount_test.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('새로고침');

    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    token = getWithExpire('accessToken'); // 토큰을 받아온다.

    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo(token);
    } 
    // 비로그인 상태이면?
    else {
          // sidebar에 '로그인을 해야 사용 가능 합니다' 문구를 보여준다.
          document.getElementById('sidebar').innerHTML = `
          <div style="text-align:center; padding:20px;">
              <h2>로그인을 해야 사용 가능합니다</h2>
              <a href="../signin_test.html" style="text-decoration: none; color: black;">
                  로그인
              </a>
          </div>
      `;

      // Header 창 오른쪽 '~님 안녕하세요!!를 보여주지 않도록 한다.
      document.querySelector('header .header-link').style.display='none';
    }
}

// 백엔드에서 유저 정보 불러오기
function getUserInfo(token){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL

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
        // console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        user_id=response.data['data']['user_id'];   // 아이디를 가져온다.
        document.querySelector('.header-link h3').textContent = `${user_id}님 안녕하세요!!`; // h3 태그에 보여준다.
    })
    .catch(error => {
        window.location.reload(); // 새로 고침한다.
    });
}

// '탈퇴하기' 버튼 click 했을 떄 수행되는 함수 
function withdrawAccount(){
    // 1. setting
    var termscheckbox = document.getElementById('termsCheckbox');              // 서비스 탈퇴 안내 사항
    var radios = document.getElementsByName('reason');                         // 탈퇴 사유
    var radiosSelected = false;                                                // 탈퇴 사유 check에 대한 flag


    // 2. 체크 여부 검사
    if(!termscheckbox.checked){
        alert('서비스 탙퇴 안내 사항에 대해서 약관에 동의해주세요');
    } 
    else {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                radiosSelected = true;
                break;
            }
        }
    
        if (radiosSelected) {
            // 사용자가 비밀번호를 입력하도록 팝업을 띄운다.
            showPasswordModal(); // 비밀번호 입력 모달 표시
        } 
        else {
            alert('탈퇴 사유에 대해서 체크 해주세요');
        }
    }
}

// 사용자가 비밀번호를 입력하도록 요청하는 팝업을 표시하는 함수
// 모달을 화면 중앙에 표시하고 요소들을 세로로 배치하는 스타일로 수정
function showPasswordModal() {
    // 모달 HTML 구조
    var modalHTML = `
        <div id="passwordModal" 
             style="display:none; position:fixed; z-index:100; left:0; top:0; 
                   width:100%; height:100%; overflow:auto; background-color: rgba(0,0,0,0.4);">
            <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; 
                        border: 1px solid #888; width: 30%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
                <h2 style="text-align:center;">비밀번호 확인</h2>

                <div style="display: flex; flex-direction: column; align-items: center;">
                    <input type="password" 
                           id="passwordInput" 
                           placeholder="비밀번호 입력" 
                           style="margin-bottom: 10px; padding: 10px; width: 80%;">

                    <button onclick="confirmPassword()" 
                            style="width: 80%; padding: 10px; margin-bottom: 10px;">확인</button>

                    <button onclick="closeModal()"
                            style="width: 80%; padding: 10px;">취소</button>
                </div>
            </div>
        </div>
    `;

    // 페이지에 모달 추가
    document.body.innerHTML += modalHTML;

    // 모달 표시
    document.getElementById('passwordModal').style.display = 'block';
}

// 모달에서 '확인' 버튼을 클릭했을 때 실행되는 함수
function confirmPassword() {
    var password = document.getElementById('passwordInput').value;
    if (password === ''){
        alert('비밀번호가 빈값 입니다.');
    }
    else {
        // 백엔드에서 구현한 '탈퇴 기능'과 소통한다.
        const signOut_URL= 'http://localhost:8000/account/auth/signOut/';  // 백엔드 소통 URL

        axios({
            method: 'post',
            url: signOut_URL,
            headers: { 
                'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
            },
            data: {'user_id': user_id, 'password': password} 
        })
        .then(response => {
            closeModal();                                            // 모달 닫기
            alert('회원 탙퇴되었습니다.');                            // alert
            localStorage.removeItem('accessToken');                  // localStorage에 accessToken 제거
            window.location.href='../index_test.html'               // index_test.html로 Routing 하기

        })
        .catch(error => {
            alert('다시 진행해주세요.');
            closeModal();
        });
    }

   
}

// 모달을 닫는 함수
function closeModal() {
    var modal = document.getElementById('passwordModal');
    modal.style.display = 'none';
    modal.parentNode.removeChild(modal); // 모달 요소 제거
}
