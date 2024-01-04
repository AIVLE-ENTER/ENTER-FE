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
