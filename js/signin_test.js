// '로그인' 버튼을 click 했을 떄 호출하는 함수
function signin(){
    // 1. setting
    var input_id=document.getElementById('input_id').value;                 // 아이디 입력값
    var input_password=document.getElementById('input_password').value;     // 비밀번호 입력값
    var login_URL=`http://localhost:8000/account/auth/login/`;              // 백엔드 통신 URL

    console.log('input_id : ' + input_id);
    console.log('input_password : ' + input_password);

    // 2. 유효성 검사 
    if(input_id=='' || input_password==''){
        alert('다시 로그인 해주세요');
    }
    else {
        // 3. 백엔드에서 마련한 '로그인' 기능과 통신하여 연계
        const result=function(){
            axios.post(login_URL, 
                      {'user_id':input_id,
                       'password':input_password,
                      })
                  .then(function (response) {
                    console.log(response);
  
                    // 4. 로그인 완료 하면 Home 페이지(index.html)로 Routing 한다.
                    alert('로그인 완료!!');
                    window.location.href = '../index.html';
                  })
                  .catch(function (error) {
                    console.log(error);
                    alert('로그인 실패!! 다시 로그인 해주세요');
                    window.location.href = '../signin.html';
                  });
          }
  
          result();  // result 함수 호출 

    }
}