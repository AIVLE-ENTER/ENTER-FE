function goToSignUp(){
    console.log('goToSignUp 함수 실행');

    // 1. 약관에 동의했는지 여부 판단
    var checkbox = document.getElementById('termsCheckbox');

    if (checkbox.checked) {  // 체크박스가 선택되었다면, 원하는 라우트로 이동합니다.
       
        window.location.href = '../signup.html';
    } 
    else {                 // 체크박스가 선택되지 않았다면, 경고 메시지를 표시합니다.
      
        alert('약관에 동의해야 회원가입을 진행할 수 있습니다.');
    }

}