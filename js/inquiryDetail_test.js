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

const currentId = window.location.search.substring(4);
var boardDetaildUrl = `http://127.0.0.1:8000/board/` + currentId + `/`;
var myInfoURL = `http://127.0.0.1:8000/account/auth/userInfo/`;
var editBoardURL = `http://127.0.0.1:8000/board/` + currentId + `/post_update_get/`;
var deleteBoardURL = `http://127.0.0.1:8000/board/` + currentId + `/delete/`;

const token = JSON.parse(localStorage.getItem('accessToken')).accessToken;
const config = {
    headers: {
        'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`})
    }
}

axios.get(boardDetaildUrl)
.then((response) => {
    var inquiryData = response.data;
    
    var faqItemType = document.querySelector('.faqItem-type');
    var faqItemTitle = document.querySelector('.faqItem-title');
    var faqItemWriter = document.querySelector('.faqItem-writer');
    var faqItemContent = document.querySelector('.faqItem-content');
    var faqItemImage = document.querySelector('.faqItem-image');

    faqItemType.append(inquiryData['question_type_title']);
    faqItemTitle.append(inquiryData['question_title']);
    faqItemWriter.append(inquiryData['user_name']);
    faqItemContent.append(inquiryData['question_content']);
    
    var imageDownloadLink = document.createElement("a");
    imageDownloadLink.style.marginLeft = "20px";
    imageDownloadLink.href = inquiryData['question_image_file'];
    imageDownloadLink.download = 'Temp Name';
    imageDownloadLink.textContent = 'Temp Name';
    faqItemImage.appendChild(imageDownloadLink);
})
.catch((error) => {
    console.log(`error: ${error}`);
})

function replyButton() {
    
    axios.get(myInfoURL, config)
    .then((response) => {
        var user_role = response.data.data.role;
        console.log(user_role);
        if (user_role == 'user') {
            alert('권한이 없습니다.');
        } else {
            const popupUrl = "inquiry_test.html";
            const popupName = "게시글 수정";
        
            var popWidth = (document.body.offsetWidth / 2) - (600 / 2);
            var popHeight = (window.screen.height / 2) - (600 / 2);
        
            const popupOption = "location = no, width = 600, height = 600, top = " + popHeight + ",left = " + popWidth;
            console.log(popupOption);

            window.open(popupUrl, popupName, popupOption);
        }
    })
}

function editButton() {   
    console.log(config);
    axios.get(editBoardURL, config)
    .then((response) => {
        const popupUrl = "inquiry_test.html";
        const popupName = "게시글 수정";
    
        var popWidth = (document.body.offsetWidth / 2) - (600 / 2);
        var popHeight = (window.screen.height / 2) - (600 / 2);
    
        const popupOption = "location = no, width = 600, height = 600, top = " + popHeight + ",left = " + popWidth;
        console.log(popupOption);

        window.open(popupUrl, popupName, popupOption);
    })
    .catch((error) => {
        console.log('error');
        alert('권한이 없습니다.')
    }) 
}

function deleteButton() {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
        axios.post(deleteBoardURL, {}, config)
        .then((response) => {
            alert('삭제가 완료되었습니다.');
            window.location.href = '../inquiryBoard_test.html';   
        })
        .catch((error) => {
            console.log('error')
        })
    } else {
        alert('취소되었습니다.')
    }
}
