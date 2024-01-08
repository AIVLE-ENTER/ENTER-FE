// 3 ~ 58줄 추가좀 했습니다

// inquiryBoard_test.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('새로고침');

    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    const token = getWithExpire('accessToken'); // 토큰을 받아온다.
    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo(token);
    } 
    // 비로그인 상태이면?
    else {
      // Header 창 오른쪽 '~님 안녕하세요!!를 보여주지 않도록 한다.
      document.querySelector('header .header-link').style.display='none';
      document.querySelector('header .login').style.display = 'block';
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
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        user_name=response.data['data']['user_name'];   // 아이디를 가져온다.
        document.querySelector('.header-link h3').textContent = `${user_name}님 안녕하세요!!`; // h3 태그에 보여준다.
        document.querySelector('header .logout').style.display = 'block';
    })
    .catch(error => {
        window.location.reload(); // 새로 고침한다.
    });
}




const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL 
const token = getWithExpire('accessToken'); // 토큰을 받아온다.

var contentNumber = 1;

tempUrl = 'http://127.0.0.1:8000/board/' // ?page=2 이런식으로 페이지 넣어서 보내야 함
axios.get(tempUrl)
.then((response) => {
    console.log(response);
    console.log('success');
    var board_list = response.data['post_list'];
    
    console.log(Object.keys(board_list).length)
    totalBoardCount = document.querySelector('.aside');
    totalBoardCount.append('총 ' + response.data['tot_post'] + '개의 게시물이 있습니다.');

    
    board_list.forEach((content) => {     
        htmlItem = document.createElement('tbody');
        htmlItem.onclick = function() {
            redirectToDetailPage(content.board_id);
        }
        htmlItem.innerHTML = `<td>${contentNumber++}</td>
                                <td>${content.question_type_title}</td>
                                <td>${content.question_title}</td>
                                <td>${content.user_name}</td>
                                <td>${content.question_datetime.substr(0, 10)}</td>
                                <td>${15}</td>`
        document.getElementById('boardList').appendChild(htmlItem);
        
    });
})
.catch((error) => {
    console.log(`error: ${error}`);
})

function redirectToDetailPage(postId) {    
    window.location.href = '/inquiryDetail_test.html?id=' + postId;
}



