// 아이디 찾는 함수 
function findId() {
    const findIdURL=`http://127.0.0.1:8000/account/auth/findID/`;
    const userData = {
        user_name: document.getElementById('name').value,
        email: document.getElementById('input_email').value
    };

    console.log(userData);

    // 백엔드에서 구현한 '아이디 찾기' 기능과 통신한다.
    axios.post(findIdURL, userData)
    .then(response => {
        alert('아이디 찾기에 성공했습니다.');

        console.log(response.data.id_list);

        showUserIdPopup(response.data.id_list); // 찾은 아이디를 팝업으로 보여주는 함수를 실행한다.
    })
    .catch(error => {
        console.log(error);
        alert('아이디 찾기에 실패하였습니다.')
    });
}

// 찾은 아이디를 팝업 형태로 보여주는 함수 
function showUserIdPopup(userIdList) {
    const userIdElements = userIdList.map(id => {
        const maskedId = maskUserId(id);
        return `<li>회원님의 아이디는 ${maskedId} 입니다.</li>`;
    });

    document.getElementById("userIdList").innerHTML = `<ul>${userIdElements.join("")}</ul>`;
    document.getElementById("userIdModal").style.display = "block";
}

// 팝업 나가기 함수
function closeUserIdPopup() {
    document.getElementById("userIdModal").style.display = "none";
}


// 마스킹 적용 함수
function maskUserId(userId) {
    if (userId.length <= 1) {
        return userId;
    } else if (userId.length === 2) {
        return userId.charAt(0) + '*';
    } else {
        const partLength = Math.floor(userId.length / 2);
        const maskedPart = '*'.repeat(partLength);
        return userId.substring(0, 1) + maskedPart + userId.substring(userId.length - 1, userId.length);
    }
}
