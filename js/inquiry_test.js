var boardURL= 'http://localhost:8000/board/';
var boardCreateURL= 'http://localhost:8000/board/create/';
var myInfoURL = `http://127.0.0.1:8000/account/auth/userInfo/`;
var typeURL=`http://localhost:8000/board/questionTypeList/`;

var token = JSON.parse(localStorage.getItem('accessToken')).accessToken;
const config = {
    headers: {
        'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`})
    }
}

axios.get(typeURL).then(
(response) => {
    const typeData = response.data.type_list;
    const typeSelect = document.getElementById("exampleSelect");

    typeData.forEach(function (type) {
        const option = document.createElement("option");
        option.value = type.question_type_id;
        option.text = type.question_type_title;
        typeSelect.appendChild(option);
    });
});


var myInfoData;
axios.get(myInfoURL, config)
.then((response) => {
    myInfoData = response;
})
.catch((error) => {
    console.log(error)
})

function writeBoard() {
    var formData = new FormData();

    var question_type = document.getElementById("exampleSelect").value;
    var title = document.getElementById("inputBoardTitle").value;
    var content = document.getElementById("inputBoardContent").value;
    var image = document.getElementById("imageFile").files[0];

    formData.append('question_type_id', question_type);
    formData.append('question_title', title);
    formData.append('question_content', content);
    if (image !== null) {
        formData.append('image', image);
    } else {
        formData.append('image', none);
    }    

    if (title === null || content === null) {
        alert("글의 제목과 내용 모두 작성해 주세요!")
    } else {
        axios.post(boardCreateURL, formData, config)
        .then((response) => {
            console.log('success');
            alert('작성이 완료되었습니다.');
            window.location.href = '../inquiryBoard_test.html';   
        })
        .catch((error) => {
            console.log('error');
        })
    }    

    
}