// '탈퇴하기' 버튼 click 했을 떄 수행되는 함수 
function withdrawAccount(){
    // 1. setting
    var termscheckbox = document.getElementById('termsCheckbox');              // 서비스 탈퇴 안내 사항
    var radios = document.getElementsByName('reason');                         // 탈퇴 사유
    var radiosSelected = false;                                                // 탈퇴 사유 check에 대한 flag


    // 2. 체크 여부 검사
    if(!termscheckbox.checked){
        alert('서비스 탙퇴 안내 사항에 대해서 약관에 동의해주세요');
    } 
    else {
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                radiosSelected = true;
                break;
            }
        }
    
        if (radiosSelected) {
            // 3. 백엔드 코드와 연계
        } 
        else {
            alert('탈퇴 사유에 대해서 체크 해주세요');
        }
    }

}