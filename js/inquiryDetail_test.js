const currentId = window.location.search.substring(4);
var boardDetaildUrl = 'http://127.0.0.1:8000/board/' + currentId + '/';
var myInfoURL = `http://127.0.0.1:8000/account/auth/userInfo/`;

const token = JSON.parse(localStorage.getItem('accessToken')).accessToken;
const config = {
    headers: {
        'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`})
    }
}

axios.get(boardDetaildUrl)
.then((response) => {
    var inquiryData = response.data;
    console.log(inquiryData)
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


function editButton() {    
    var userId;
    axios.get(myInfoURL, config)
    .then((response) => {
        userId = response['data']['data']['user_id'];
    })
    .catch((error) => {
        console.log('Id Error.');
        console.log(error);
    })

    axios.get(boardDetaildUrl)
    .then((response) => {
        var inquiryData = response.data
        console.log(inquiryData);
        console.log(userId)
        if (inquiryData['user_id'] !== userId) {  // board 작성자 user_id 필요해 보임
            alert('권한이 없습니다.');
        } else {
            const popupUrl = "changeBoard_test.html";
            const popupName = "게시글 수정";
        
            var popWidth = (document.body.offsetWidth / 2) - (600 / 2);
            var popHeight = (window.screen.height / 2) - (600 / 2);
        
            const popupOption = "location = no, width = 600, height = 600, top = " + popHeight + ",left = " + popWidth;
            console.log(popupOption);

            window.open(popupUrl, popupName, popupOption);
        }
    })
    
}



