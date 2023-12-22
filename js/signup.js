// '중복 확인'을 click 했을 떄 '중복 확인'을 확인하는 함수 
function checkDuplicateID() {
   // 1. setting
   var input_id=document.getElementById(`input_id`).value;                                      // 사용자가 입력한 아이디를 가져옴 
   var regIdPw = /^[a-zA-Z0-9]{4,12}$/;                                                         // 아이디 정규표현식 
   const duplicateID_URL=`http://localhost:8000/account/signUp/checkId/?id=${input_id}`;       // '중복 확인'을 체크해주는 백엔드 URL

   console.log(`url : ${duplicateID_URL}`);

   // 2. 사용자가 어떤 아이디를 입력했는가에 따라 서로 다른 로직 구현
   if(input_id==""){                                       // 사용자가 입력한 것이 빈칸일 경우 
        alert("아이디를 입력하세요.")
        uid.focus();
        return false;
    }
   
    else if(!regIdPw.test(input_id)){                     // 사용자가 입력했으나 유효성 검사가 맞지 않은 경우
        alert(`4~12자 영문 대소문자, 숫자만 입력하세요.`);
        uid.focus();
        return false;
    }
    else{                                                // 사용자가 입력한 것이 최종적으로 유효성 검사가 통과된 경우
        // 2. 백엔드가 마련해둔 '중복 확인' 코드와 연계
        const result = function() {                     // 반환값 형식은  response: {”is_available”: true of false}
            axios.get(duplicateID_URL).then(
              (response) => {
                console.log(response);

                // 3. 사용자가 입력한 아이디가 '중복 확인' 됐는지 여부에 따라 서로 다른 로직 구현 
                const is_available = response.data.is_available;
                if (is_available) {  // 사용 가능할 때 처리할 이벤트 (아이디 중복 X)
                  // 3-1. '중복 확인' 버튼  숨기기(Hidden)
                  const duplicate_btn = document.getElementById('check-duplicate');
                  duplicate_btn.style.display = 'none';

                  // 3-2. '아이디 수정하기' 버튼 보여주기(Activate)
                  const modify_btn = document.getElementById('modify-id');
                  modify_btn.style.display = 'block';

                  // 3-3. '아이디 입력' 영역 비활성화(Disabled)
                  document.getElementById('input_id').disabled = true;
                }
                else {             // 사용 불가할 때 처리할 이벤트 (아이디 중복)
                  alert(`중복된 아이디가 있습니다.`);

                  // 1. 입력했던 아이디를 빈칸으로 재설정한다.
                  document.getElementById('input_id').value = '';
                }
            });
          }
          
        result();  // result 함수 호출 
    }
}

// '아이디 수정'을 click했을 떄에 대해 호출한 함수 
function modify_ID(){
  // 1. 입력했던 아이디를 빈칸으로 재설정한다.
  document.getElementById('input_id').value = '';
    
  // 2. 중복 확인' 버튼 보여주기(Activate)
  const duplicate_btn = document.getElementById('check-duplicate');
  duplicate_btn.style.display = 'block';

  // 3. '아이디 수정하기' 버튼 숨기기(Hidden)
  const modify_btn = document.getElementById('modify-id');
  modify_btn.style.display = 'none';

  // 4. '아이디 입력' 영역 활성화(Abled)
  document.getElementById('input_id').disabled = false;
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

// '인증번호 받기' click했을 떄 이를 수행하는 함수
function requestVerificationCode(){
    console.log('requestVerificationCode() 실행');

    // 1. setting 
    var regMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   // 이메일 유효성 검사를 위한 변수 
    var input_email=document.getElementById('input_email').value;                                        // 사용자가 입력한 아이디를 가져온다.
    const requestVerifyCode_URL=`http://localhost:8000/utils/sendCertificationNumber/`;       // 백엔드와 소통할 URL

    // 2. 이메일 유효성 검사
    if (regMail.test(input_email)) {       // 이메일 형식이 맞으면?
      console.log('유효한 이메일 주소입니다.');

      // 3. 백엔드와 소통하는 로직을 여기에 추가
      const result=function(){
          axios.post(requestVerifyCode_URL, {'email':input_email, 'purpose':'signup'})
                .then(function (response) {
                  console.log(response);

                  // 4. 타이머 5분 호출 
                  document.querySelector('.timer-container').style.display = 'block';                  // 타이머를 보이게 함
                  document.getElementById('input_email').disabled=true;                                // '이메일 입력' 칸 비활성화
                  document.getElementById('receiveVerificationCodeBtn').disabled=true;                 // '인증번호 받기' 칸 비활성화
                                                                                      
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
  var interval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
          clearInterval(interval);

          alert("인증 시간이 지났습니다. 다시 시도하세요");                                       // alert           
          display.style.display = 'none';                                                       // 타이머 숨기기
          emailInput.value = '';                                                                // 이메일 입력 필드 초기화
          verfiyCodeInput.value='';                                                             // '인증번호 입력' 필드 초기화
          document.getElementById('input_email').disabled = false;                              // '이메일 입력' 칸 활성화
          document.getElementById('receiveVerificationCodeBtn').disabled=false;                 // '인증번호 받기' 칸 활성화
      }                                                                                         
  }, 1000);
}

// '가입하기' 버튼 click했을 떄 이를 수행하는 함수 
function signUp(){
  
  
}

