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

        // 관리자일 경우에만 답변하기 버튼 보여주기
        if(user_role=='admin') {
            document.querySelector(".reply-button").style.display='block';        
        }
    })
    .catch(error => {
        window.location.reload(); // 새로 고침한다.
    });
}

const currentId = window.location.search.substring(4);
var boardDetaildUrl = `http://127.0.0.1:8000/board/` + currentId + `/`;
var myInfoURL = `http://127.0.0.1:8000/account/auth/userInfo/`;
var editBoardURL = `http://127.0.0.1:8000/board/` + currentId + `/post_update_post/`;
var deleteBoardURL = `http://127.0.0.1:8000/board/` + currentId + `/delete/`;

const token = getWithExpire('accessToken'); // 토큰을 받아온다.
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
    var llist = inquiryData['question_image_file'].split('/')
    len = llist.length;
    imageDownloadLink.textContent = decode(llist[len-1]);

    function decode(x) {

        y = decodeURIComponent(x.replace(/\+/g,  " "));
        return y
    }

    console.log(llist[len-1]);
    faqItemImage.appendChild(imageDownloadLink);

    // 작성자일 경우에만 수정, 삭제 버튼 보여주기
    if(user_id==inquiryData['user_id']) {
        document.querySelector(".edit-button").style.display='block';
        document.querySelector(".delete-button").style.display='block';
    }
})
.catch((error) => {
    console.log(`error: ${error}`);
})

function replyButton() {
    if (user_role == 'user') {
        Toast.fire({
            width: '420px',
            icon: 'error',
            title: '권한이 없습니다.'
        });
    } else {
        console.log('');
    }
}

function editButton() {
    const title = document.querySelector(".faqItem-title");
    const content = document.querySelector(".faqItem-content");
    const category = document.querySelector(".faqItem-type");
    const replybutton = document.querySelector(".reply-button");
    const editbutton = document.querySelector(".edit-button");
    const deletebutton = document.querySelector(".delete-button");
    const buttonsection = document.querySelector(".button-section");
    const itembox = document.querySelector(".faqItem-box");
    const imagep = document.querySelector(".faqItem-image > p");

    var typeURL=`http://localhost:8000/board/questionTypeList/`;
    var editURL = 
    replybutton.remove();
    editbutton.remove();
    deletebutton.remove();

    const completeeditbutton = document.createElement("button");
    const cancelbutton = document.createElement("button");
    completeeditbutton.textContent = '수정완료';
    cancelbutton.textContent = '취소';
    cancelbutton.type = 'button';

    buttonsection.appendChild(completeeditbutton);
    buttonsection.appendChild(cancelbutton);

    const categoryedit = document.createElement("select");

    cat = category.textContent;

    axios.get(typeURL).then(
        (response) => {
            const typeData = response.data.type_list;
        
            typeData.forEach(function (type) {
                const option = document.createElement("option");
                option.value = type.question_type_id;
                option.text = type.question_type_title;
                if (option.text==cat){
                    option.selected = true;
                }
                categoryedit.appendChild(option);
            });
        });
        //console.log(category.textContent);

    category.textContent = '';
    category.appendChild(categoryedit);

    const contentedit = document.createElement("textarea");
    //contentedit.id = 'inputBoardContent';
    contentedit.className = 'faqItem-content';
    contentedit.textContent = content.textContent;

    const titleedit = document.createElement("textarea");
    titleedit.className = 'faqItem-title';
    //titleedit.id = 'inputBoardTitle';
    titleedit.textContent = title.textContent;

    content.textContent = '';
    title.textContent = '';
    content.appendChild(contentedit);
    title.appendChild(titleedit);


    imagep.textContent = "기존파일";
    filediv = document.createElement('div')
    filediv.className = "file-detach";
    filep = document.createElement('p');
    filep.textContent = '파일을 새로 첨부하려면 파일을 선택하세요.';
    fileinput = document.createElement('input');
    fileinput.type = "file";
    fileinput.id = 'imageFile';
    filediv.appendChild(filep);
    filediv.appendChild(fileinput);
    itembox.appendChild(filediv);

    const editcomplete = () =>{
        var formData = new FormData();
        var question_type = categoryedit.value;
        console.log(question_type);
        var title = titleedit.value;
        var content = contentedit.value;
        var image = document.getElementById("imageFile").files[0];

        formData.append('question_type_id', question_type);
        formData.append('question_title', title);
        formData.append('question_content', content);
        if (image !== null) {
            formData.append('image', image);
        } else {
            formData.append('image', none);
        }
        if (question_type == '문의 유형 선택' || title === null || content === null) {
            alert("글의 제목과 내용 모두 작성해 주세요!")
        } else {
            axios.post(editBoardURL, formData, config)
            .then((response) => {
                console.log('success');
                alert('작성이 완료되었습니다.');
                window.location.reload();  
            })
            .catch((error) => {
                console.log('error');
            })
        }    
    };

    const cancel = () =>{
        window.location.reload();
    };

    cancelbutton.onclick = cancel;
    completeeditbutton.onclick = editcomplete;




    


    // console.log(config);
    // axios.get(editBoardURL, config)
    // .then((response) => {
    //     const popupUrl = "inquiry_test.html";
    //     const popupName = "게시글 수정";
    
    //     var popWidth = (document.body.offsetWidth / 2) - (600 / 2);
    //     var popHeight = (window.screen.height / 2) - (600 / 2);
    
    //     const popupOption = "location = no, width = 600, height = 600, top = " + popHeight + ",left = " + popWidth;
    //     console.log(popupOption);

    //     window.open(popupUrl, popupName, popupOption);
    // })
    // .catch((error) => {
    //     console.log('error');
    //     alert('권한이 없습니다.')
    // }) 
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
