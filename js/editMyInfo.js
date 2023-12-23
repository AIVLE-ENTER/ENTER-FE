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

// 회사 SELECT (editMyInfo.html이 불러와질떄 호출되는 함수)
document.addEventListener("DOMContentLoaded", function () {
    const company_URL=`http://localhost:8000/account/signUp/company/`;       // 회사 리스트를 불러오는 백엔드 URL
    
    // 비동기 통신으로 회사 정보 가져오기 
    axios.get(company_URL).then(
      (response) => {
        const companyData = response.data.company_list;
        console.log(companyData);
  
        // HTML select 엘리먼트 참조
        const companySelect = document.getElementById("company_select");
  
        // 비동기로 가져온 회사 정보를 이용하여 select 옵션 추가
        companyData.forEach(function (company) {
            const option = document.createElement("option");
            option.value = company.company_id;
            option.text = company.company_name;
            companySelect.appendChild(option);
        });
    });
});

// '수정하기' 버튼이 click 될 떄 호출되는 함수
function modifyMyInfo(){
    // 1. 유효성 검사
}
 