// '비밀번호 확인' 영역(Area)에서 비밀번호를 비교하는 함수 
function checkPasswordMatch() {
    console.log('checkPasswordMatch 함수 실행');
 
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm_password').value;

    if (password != confirmPassword) {  // password와 confirmPassword가 다른 경우
        document.getElementById('password_match').textContent = '비밀번호가 일치하지 않습니다.';     // 텍스트 변경
        document.getElementById('password_match').style.color = 'red';                            // 텍스트 색상을 빨간색으로 변경
        document.getElementById('password_match').style.display = 'inline';                        // 요소를 보이게 함
    } 
    else {                              //  password와 confirmPassword가 같은 경우
        document.getElementById('password_match').textContent = '비밀번호가 일치합니다.';     // 텍스트 변경
        document.getElementById('password_match').style.color = 'green';                    // 텍스트 색상을 녹색으로 변경
        document.getElementById('password_match').style.display = 'inline';                 // 요소를 보이게 함
    }
}

// '비밀번호 변경' 버튼 click 했을 떄 호출되는 함수
function changePassword(){

}