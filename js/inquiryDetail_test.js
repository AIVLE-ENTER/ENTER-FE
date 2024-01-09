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

// 전역 변수
let user_role = 'user';
let user_id = '';

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
        user_role=response.data.data.role;
        user_id=response.data.data.user_id;
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
    imageDownloadLink.className = 'attached-file';
    imageDownloadLink.style.marginLeft = "20px";
    imageDownloadLink.href = inquiryData['question_image_file'];
    imageDownloadLink.download = 'Attached File';
    imageDownloadLink.textContent = 'Attached File';
    faqItemImage.appendChild(imageDownloadLink);

    // 답변이 아직 없고 & 관리자일 경우에만 답변하기 버튼 보여주기
    if(user_role=='admin' & inquiryData['answer_content']==null) {
        document.querySelector(".reply-button").style.display='block';        
    }

    // 작성자일 경우에만 수정, 삭제 버튼 보여주기
    if(user_id==inquiryData['user_id']) {
        document.querySelector(".edit-button").style.display='block';
        document.querySelector(".delete-button").style.display='block';
    } else if(user_role=='admin') {
        // 관리자일 경우 삭제버튼 보여주기
        document.querySelector(".delete-button").style.display='block';
    }
})
.catch((error) => {
    console.log(`error: ${error}`);
})


// 답변 모달창
const answer_modal = document.getElementById('answer-modal');
function replyButton() {
    if (user_role == 'user') {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '권한이 없습니다.'
        });
    } else {
        answer_modal.style.display = 'block';
    }
}
// 모달 닫기 버튼 클릭 시 이벤트 처리
const closeModalAnswer = document.getElementById('closeModalAnswer');
closeModalAnswer.addEventListener('click', function () {
    answer_modal.style.display = 'none';
});

// 모달 바깥 영역 클릭 시 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === answer_modal) {
        answer_modal.style.display = 'none';
    }
});
// 답변 하기
function answer() {
    var answerURL = `http://localhost:8000/board/${currentId}/answer_create`;
    var answer_content = document.getElementById("answer_content").value;
    console.log(answer_content);

    if(answer_content=="") {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '답변을 입력해주세요.'
        });
        return false;
    }

    // 백엔드 유저 정보 불러오기 
    axios({
        method: 'post',
        url: answerURL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
            post_id: currentId,
            answer_content: answer_content
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.
        if(response.data.success==true) {
            Toast.fire({
                width: '420px',
                icon: 'success',
                title: '답변이 작성되었습니다.'
            });
            setTimeout(function() {
                location.reload();
            }, 900);
        } else {
            Toast.fire({
                width: '420px',
                icon: 'error',
                title: '답변은 관리자만 작성할 수 있습니다.'
            });
            setTimeout(function() {
                location.reload();
            }, 900);
        }
    })
    .catch(error => {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '오류가 발생했습니다. 다시 시도해주세요.'
        });
        setTimeout(function() {
            location.reload();
        }, 900);
    });
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
    Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: "삭제한 데이터는 복구할 수 없습니다!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#454997',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            // 실제 동작 수행
            axios.post(deleteBoardURL, {}, config)
            .then((response) => {
                Toast.fire({
                    width: '420px',
                    icon: 'success',
                    title: '삭제되었습니다.'
                });
                setTimeout(function() {
                    window.location.href = '../inquiryBoard_test.html';   
                }, 900);
            })
            .catch((error) => {
                Toast.fire({
                    width: '420px',
                    icon: 'error',
                    title: '오류가 발생했습니다. 다시 시도해주세요.'
                });
                setTimeout(function() {
                    location.reload();
                }, 900);
            });
        }
    });
}