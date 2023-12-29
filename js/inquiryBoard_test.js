const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL
const token = localStorage.getItem('accessToken');                      // 사용자의 토큰을 얻어옴 

// inquiryBoard.html을 불러왔을 떄 로그인 여부를 판별한다.
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




$.ajax({
    url: '/board/',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        data.forEach(function(board) {
            $('boardList').append('<li><strong>' + board.title + '</strong>: ' + board.content + '</li>');
        });
    },
    error: function(error) {
        console.log(error);
    }
});

function redirectToDetailPage(postId) {
    window.location.href = '/inquiryDetail_test.html?id=' + postId;
}



