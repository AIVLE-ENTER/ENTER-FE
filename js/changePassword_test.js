// 전역적으로 관리되는 변수
var interval;   // Timer를 시작하고 종료하는데 큰 공헌을 하는 변수
 
// '인증번호 받기' click했을 떄 이를 수행하는 함수
function requestVerificationCode(){
    console.log('requestVerificationCode() 실행');

    // 1. setting 
    var regMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   // 이메일 유효성 검사를 위한 변수 
    var input_email=document.getElementById('input_email').value;                                        // 사용자가 입력한 아이디를 가져온다.
    const requestVerifyCode_URL=`http://localhost:8000/utils/sendCertificationNumber/`;                  // 백엔드와 소통할 URL

    // 2. 이메일 유효성 검사
    if (regMail.test(input_email)) {       // 이메일 형식이 맞으면?
    console.log('유효한 이메일 주소입니다.');

    // 3. 백엔드와 소통하는 로직을 여기에 추가
    const result=function(){
        axios.post(requestVerifyCode_URL, {'email':input_email, 'purpose':'findPW'})
                .then(function (response) {
                console.log(response);

                // 4. 타이머 5분 호출 
                document.querySelector('.timer-container').style.display = 'inline-block';                  // 타이머를 보이게 함
                document.querySelector('#timer').style.display='inline-block';                              // 타이머를 보이게함
                document.getElementById('input_email').disabled=true;                                       // '이메일 입력' 칸 비활성화
                document.getElementById('receiveVerificationCodeBtn').disabled=true;                        // '인증번호 받기' 칸 비활성화
                document.getElementById('verifyCodeInput').disabled=false;                                  // '인증번호 입력' 칸 활성화
                document.getElementById('checkAuthNum').style.display = 'inline-block';                     // '인증번호 확인' 버튼 보이기
                                                                                    
                timer1();  
                })
                .catch(function (error) {
                console.log(error);
                });
    }

    result();  // result 함수 호출 
    } 
    else {
        alert('유효하지 않은 이메일 주소입니다.');

        document.getElementById('input_email').value = '';    // 입력했던 아이디를 빈칸으로 재설정한다.
    }
}

// 타이머 작동 함수 1
function timer1() {
    var oneMinute = 60,
        display = document.querySelector('#timer'),
        emailInput = document.querySelector('#input_email');                                    // 이메일 입력 필드 선택
        verfiyCodeInput=document.querySelector('#verifyCodeInput');                             // 인증번호 입력 필드 선택

    timer2(oneMinute, display, emailInput, verfiyCodeInput);
}

// 타이머 작동 함수 2
function timer2(duration, display, emailInput, verfiyCodeInput) {
    var timer = duration, minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            alert("인증 시간이 지났습니다. 다시 시도하세요");                                       // alert

            clearInterval(interval);                                                              // 타이머 종료
            display.style.display = 'none';                                                       // 타이머 숨기기

            emailInput.value = '';                                                                // 이메일 입력 필드 초기화
            document.getElementById('input_email').disabled = false;                              // '이메일 입력' 칸 활성화

            verfiyCodeInput.value='';                                                             // '인증번호 입력' 필드 초기화
            document.getElementById('verifyCodeInput').disabled=true;                             // '인증번호 입력' 칸 비활성화

            document.getElementById('receiveVerificationCodeBtn').disabled=false;                 // '인증번호 받기' 칸 활성화
            
            document.getElementById('checkAuthNum').style.display = 'none';                       // '인증번호 입력' 버튼 비활성화
        }                                                                                         
    }, 1000);
}

// '인증번호 확인' 버튼 click했을 떄 이를 수행하는 함수
function checkAuthNum(){
    // 1. setting
    var input_email=document.getElementById('input_email');                                                                                                                 // 이메일 입력칸
    var input_email_value=document.getElementById('input_email').value;                                                                                                     // 이메일 입력값
    var receiveVerificationCodeBtn=document.getElementById('receiveVerificationCodeBtn');                                                                                   // 인증번호 받기 버튼
    var verifyCodeInput=document.getElementById('verifyCodeInput');                                                                                                         // 인증번호 입력칸
    var verifyCodeInputValue=document.getElementById('verifyCodeInput').value;                                                                                              // 인증번호 입력값
    var checkAuthNumBtn=document.getElementById('checkAuthNum');                                                                                                            // 인증번호 확인 버튼
    var timer = document.querySelector('#timer');                                                                                                                           // 타이머
    var signUpBtn = document.getElementById('signUpBtn');                                                                                                                   // 가입하기 버튼 

    const checkAuthNum_URL=`http://localhost:8000/utils/checkCertificationNumber/?email=${input_email_value}&certification_number=${verifyCodeInputValue}&purpose=findID`;  // 백엔드 통신 URL

    // 2. 백엔드가 마련해둔 '인증번호 확인' 코드와 연계
    const result = function() {                     
    axios.get(checkAuthNum_URL).then(
        (response) => {
        console.log(response);
        const is_success=response.data.success;
    
        // 3. success 속성에 따라 서로 다른 로직 부여
        if(is_success==true){
            alert('인증 확인이 성공하였습니다. 비밀번호 변경 버튼이 활성화 되었습니다.');                // alert
                                                                                                
            clearInterval(interval);                                                             // 타이머 중지
            document.querySelector('.timer-container').style.display = 'none';                   // 타이머를 안보이게 한다.
            timer.style.display='none';                                                          // 타이머를 안보이게 한다.    
            
            input_email.disabled=true;                                                           // 이메일 입력칸 비활성화
            
            receiveVerificationCodeBtn.disabled=true;                                            // 인증번호 받기 버튼 비활성화

            verifyCodeInput.disabled=true;                                                       // 인증번호 입력칸 비활성화 

            checkAuthNumBtn.style.display='none';                                                // 인증번호 확인 버튼 Hidden

            signUpBtn.disabled=false;                                                            // 가입하기 버튼 활성화
        }
        else{  
            alert("인증확인이 실패했습니다. 다시 시도하세요");                                      // alert     
            
            clearInterval(interval);                                                             // 타이머 중지
            document.querySelector('.timer-container').style.display = 'none';                   // 타이머를 안보이게 한다.
            timer.style.display='none';                                                          // 타이머 중지

            input_email.disabled=false;                                                          // 이메일 입력칸 활성화
            input_email.value='';                                                                // 이메일 입력값 지우기

            receiveVerificationCodeBtn.disabled=false;                                           // 인증번호 받기 버튼 활성화
            
            verifyCodeInput.disabled=true;                                                       // 인증번호 입력칸 비활성화
            verifyCodeInput.value='';                                                            // 인증번호 입력값 지우기

            checkAuthNumBtn.style.display='none';                                                // 인증번호 확인 버튼 Hidden
        }
    });
    }

    result();
}

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
    console.log('비밀번호 변경');

}