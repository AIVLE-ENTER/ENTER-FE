// index_test.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('accessToken');

    console.log(`token : ${token}`);

    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo();

        // 백엔드 코드를 이용해서 채팅방 목록 보여오기

    } 
    // 비로그인 상태이면?
    else {
          // sidebar에 '로그인을 해야 사용 가능 합니다' 문구를 보여준다.
          document.getElementById('sidebar').innerHTML = `
          <div style="text-align:center; padding:20px;">
              <h2>로그인을 해야 사용 가능합니다</h2>
              <a href="../signin_test.html" style="text-decoration: none; color: black;">
                  로그인
              </a>
          </div>
      `;

      // Header 창 오른쪽 'winner23456님 안녕하세요!!를 보여주지 않도록 한다.
      document.querySelector('header .header-link').style.display='none';
    }
}

// 백엔드에서 유저 정보 불러오기
function getUserInfo(){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL
    const token = localStorage.getItem('accessToken');                      // 사용자의 토큰을 얻어옴 

    // 백엔드 유저 정보 불러오기 
    axios({
        method: 'get',
        url: getUserInfo_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        const user_id=response.data['data']['user_id'];   // 아이디를 가져온다.
        document.querySelector('.header-link h3').textContent = `${user_id}님 안녕하세요!!`; // h3 태그에 보여준다.
    })
    .catch(error => {
        // 오류가 발생하면 이 부분이 실행됩니다.
        alert('유저 정보 불러오기 오류');
    });
}



// 문서 로드 시 초기화 함수 실행
document.addEventListener('DOMContentLoaded', 
                          initializeTrashIcons);



// const sidebar = document.querySelector("#sidebar");
// const hide_sidebar = document.querySelector(".hide-sidebar");
// const new_chat_button = document.querySelector(".new-chat");

/* Hidden */
// hide_sidebar.addEventListener( "click", function() {
//     sidebar.classList.toggle( "hidden" );
// });

// const user_menu = document.querySelector(".user-menu ul");
// const show_user_menu = document.querySelector(".user-menu button");

// /* 하단 Show Menu 보여주기 */
// show_user_menu.addEventListener( "click", function() {
//     if( user_menu.classList.contains("show") ) {
//         user_menu.classList.toggle( "show" );
//         setTimeout( function() {
//             user_menu.classList.toggle( "show-animate" );
//         }, 200 );
//     } else {
//         user_menu.classList.toggle( "show-animate" );
//         setTimeout( function() {
//             user_menu.classList.toggle( "show" );
//         }, 50 );
//     }
// } );

// const models = document.querySelectorAll(".model-selector button");

// for( const model of models ) {
//     model.addEventListener("click", function() {
//         document.querySelector(".model-selector button.selected")?.classList.remove("selected");
//         model.classList.add("selected");
//     });
// }

// const message_box = document.querySelector("#message");

// message_box.addEventListener("keyup", function() {
//     message_box.style.height = "auto";
//     let height = message_box.scrollHeight + 2;
//     if( height > 200 ) {
//         height = 200;
//     }
//     message_box.style.height = height + "px";
// });

// function show_view( view_selector ) {
//     document.querySelectorAll(".view").forEach(view => {
//         view.style.display = "none";
//     });

//     document.querySelector(view_selector).style.display = "flex";
// }

// document.querySelectorAll(".conversation-button").forEach(button => {
//     button.addEventListener("click", function() {
//         show_view( ".conversation-view" );
//     })
// });

// new_chat_button.addEventListener("click", function() {
//     show_view( ".new-chat-view" );
// });


// 'Prompt-Main'화면을 clear, 입력창을 보이지 않게 하는 함수
function clearMainContent() {
    const mainContent = document.querySelector('.conversation-view');
    const messageForm = document.getElementById('message-form');

    if (mainContent) {
        mainContent.innerHTML = ''; // Main 화면의 내용을 비웁니다.
    }

    if (messageForm) {
        messageForm.style.display = 'none'; // 하단 입력창을 숨깁니다.
    }
}

// '채팅방명'을 click 했을 떄 호출되는 함수
function showChats(chatRoomName) {
    var messageForm = document.getElementById('message-form'); // 하단 입력 창을 보이게 한다.
    messageForm.style.display = 'block'; 

    var chatData = getChatData(chatRoomName);    // 서버에서 질문(Q)와 대답(R) 관련된 데이터를 가져온다.

    var conversationView = document.querySelector('.conversation-view');
    conversationView.innerHTML = '';

    chatData.forEach(function(chat) {    // 질문(Q)와 대답(R) 데이터를 화면에 뿌려준다.(JS 코드로 html 설정)
        var questionDiv = document.createElement('div');    // 질문(Q)
        questionDiv.className = 'chat-container';
        var questionElem = document.createElement('p');
        questionElem.className = 'question';
        questionElem.innerHTML = '<b>Q:</b> ' + chat.question;
        questionDiv.appendChild(questionElem);
        conversationView.appendChild(questionDiv);

        var answerDiv = document.createElement('div');     // 대답(R)
        answerDiv.className = 'chat-container';
        var answerElem = document.createElement('p');
        answerElem.className = 'answer';
        answerElem.innerHTML = '<b>A:</b> ' + chat.answer;
        answerDiv.appendChild(answerElem);
        conversationView.appendChild(answerDiv);
    });

    // 채팅 내용이 추가된 후 스크롤을 맨 아래로 이동
    conversationView.scrollTop = conversationView.scrollHeight;
}

// 서버에서 질문과 대답 형식의 데이터를 가져오거나, 이미 로드된 데이터를 반환하는 함수
function getChatData(chatRoomName) {
    // 예시 데이터 
    return {
        'gigagenie': [
            { question: '질문1', answer: '안녕하세요 저는 그냥 노체랭랭ㄹ앤룽내ㅜㄹㅇ내ㅜ랜우랜ㅇ루ㅐㅇㄴ루ㅐㅇㄴ루ㅐㅇㄴ룽낼앤룬애룽내ㅜㄹㄴ애ㅜ랜울ㅇ내루ㅐㄴㅇ루애눌ㅇ내룽내ㅜㄹ애누랜울애눌앤루앤루ㅐㄴㅇ루ㅐㄴㅇ루ㅐㄴ우랜우랭누랭누랭누래엔루ㅐ후ㅐㅑ후댜ㅐㄱ훋개ㅜ해댜궇ㄱ대햐' },
            { question: '질문2', answer: '대답2' },
            { question: '질문1', answer: '안녕하세요 저는 그냥 노체랭랭ㄹ앤룽내ㅜㄹㅇ내ㅜ랜우랜ㅇ루ㅐㅇㄴ루ㅐㅇㄴ루ㅐㅇㄴ룽낼앤룬애룽내ㅜㄹㄴ애ㅜ랜울ㅇ내루ㅐㄴㅇ루애눌ㅇ내룽내ㅜㄹ애누랜울애눌앤루앤루ㅐㄴㅇ루ㅐㄴㅇ루ㅐㄴ우랜우랭누랭누랭누래엔루ㅐ후ㅐㅑ후댜ㅐㄱ훋개ㅜ해댜궇ㄱ대햐' },
            { question: '질문2', answer: '대답2' },
            { question: '질문1', answer: '안녕하세요 저는 그냥 노체랭랭ㄹ앤룽내ㅜㄹㅇ내ㅜ랜우랜ㅇ루ㅐㅇㄴ루ㅐㅇㄴ루ㅐㅇㄴ룽낼앤룬애룽내ㅜㄹㄴ애ㅜ랜울ㅇ내루ㅐㄴㅇ루애눌ㅇ내룽내ㅜㄹ애누랜울애눌앤루앤루ㅐㄴㅇ루ㅐㄴㅇ루ㅐㄴ우랜우랭누랭누랭누래엔루ㅐ후ㅐㅑ후댜ㅐㄱ훋개ㅜ해댜궇ㄱ대햐' },
            { question: '질문2', answer: '대답2' },
            { question: '질문1', answer: '안녕하세요 저는 그냥 노체랭랭ㄹ앤룽내ㅜㄹㅇ내ㅜ랜우랜ㅇ루ㅐㅇㄴ루ㅐㅇㄴ루ㅐㅇㄴ룽낼앤룬애룽내ㅜㄹㄴ애ㅜ랜울ㅇ내루ㅐㄴㅇ루애눌ㅇ내룽내ㅜㄹ애누랜울애눌앤루앤루ㅐㄴㅇ루ㅐㄴㅇ루ㅐㄴ우랜우랭누랭누랭누래엔루ㅐ후ㅐㅑ후댜ㅐㄱ훋개ㅜ해댜궇ㄱ대햐' },
            { question: '질문2', answer: '대답2' },
            { question: '질문1', answer: '안녕하세요 저는 그냥 노체랭랭ㄹ앤룽내ㅜㄹㅇ내ㅜ랜우랜ㅇ루ㅐㅇㄴ루ㅐㅇㄴ루ㅐㅇㄴ룽낼앤룬애룽내ㅜㄹㄴ애ㅜ랜울ㅇ내루ㅐㄴㅇ루애눌ㅇ내룽내ㅜㄹ애누랜울애눌앤루앤루ㅐㄴㅇ루ㅐㄴㅇ루ㅐㄴ우랜우랭누랭누랭누래엔루ㅐ후ㅐㅑ후댜ㅐㄱ훋개ㅜ해댜궇ㄱ대햐무랴루ㅑ우랴ㅐㅇ누량누랴앤룽내ㅑㅜㄹㄴ애ㅑ룽냐ㅐ룽내룬애루ㅐㄴㅇ루ㅑㅐㄴ우랴ㅐㄴㅇ루ㅑㅐㅇ누랴ㅐㄴㅇ루ㅐㄴㅇ루앤루ㅑㅐㄴㅇ룽내룬애루앤ㄹㅇ내루ㅐ냐혀휵뎌휵뎌ㅑ휵댜ㅕ휻ㄱㅎdasdasfasfdfdsfsdfhsdfsdfhsdufhdsiufhdsfiuhdsfiudsfisdhfiusdigsdfdifgdufgsdifusdfgdsuifdgsifgsdiufgsdifgdsifgidsfgdisfgisdfgdisfgidsfgidsfgdisufgeuifgfegfguefgwefgewfewuifgufigdufidgsfgdsfgsdifgdsifgdsfisdgfidsgfidsgfidsfgdsifgydwdywfdwydfywfdyufdwyfduydfwywqdfywdfywfqdywqdfwtdwqdfwqdfwqdufqwdtwqdfwtdwqfdytwqfdwqtydfwqytdfqwydfwqydfwqtydfqwtydfwqtydfwqytdfwqytdfwqdfwqudfwqydfwqduwqfyduwqdfwqdufwqdfuwqydufwqydufywqdfwqdfwqdyuwfqduywfdwqydwfqydwqfydadsadasdsadsadsadsdsadsadsdsadsadsadsadsadsad' },
            { question: '질문2', answer: '대답2' },
            // 여기에 더 많은 질문과 대답을 추가할 수 있습니다.
        ],
        'pass' : [
            { question: '질문1', answer: '대답1' },
            { question: '질문2', answer: '대답2' },
            // 여기에 더 많은 질문과 대답을 추가할 수 있습니다.
        ],
        // 다른 채팅방 데이터도 이와 유사하게 추가
    }[chatRoomName];
}

// 'New Chat'click 시 팝업 나타나는 함수 
function openPopup() {
    document.getElementById('new-chat-popup').style.display = 'flex';

    var topic = document.getElementById('topic');
    var chatRoomName = document.getElementById('chatroom-name');

    topic.value='';
    chatRoomName.value='';

    document.getElementById('topic').addEventListener('input', function() {
        document.getElementById('chatroom-name').value = this.value;
    });
}

// 'New Chat' 팝업 닫기 함수 
function closePopup() {
    document.getElementById('new-chat-popup').style.display = 'none';
}

// 'New Chat - 생성하기' click 했을 떄 호출되는 함수 (휴지통 버튼 기능도 포함)
function generateChat(event) {
    // 폼 제출에 의한 페이지 새로고침 방지
    event.preventDefault();

    var chatRoomName = document.getElementById('chatroom-name').value;
    if (chatRoomName) {
        var li = document.createElement('li');
        var button = document.createElement('button');
        var span = document.createElement('span'); // 휴지통 아이콘을 위한 span 요소 생성

        // 버튼 설정
        button.className = 'conversation-button';
        button.setAttribute('onclick', "showChats('" + chatRoomName + "')");
        button.textContent = chatRoomName;

        // 휴지통 아이콘 설정
        span.className = 'trash-icon';
        span.style.marginLeft = '5px';
        span.innerHTML = '🗑️';

        // 휴지통 아이콘에 이벤트 리스너 추가
        span.addEventListener('click', function(event) {
            console.log('휴지통 아이콘 출력');
            event.stopPropagation(); // 버블링 방지
            li.remove(); // 해당 li 요소 삭제

            clearMainContent(); // Main 화면의 내용을 클리어하고, 하단 입력창을 보이지 않게 합니다.
        });

        // li 요소에 버튼 추가
        li.appendChild(button);

        // li 요소에 휴지통 아이콘 추가
        li.appendChild(span);

        // ul 요소에 li 요소 추가
        document.getElementsByClassName('conversations')[0].appendChild(li);
        
        closePopup(); // 팝업 창을 닫음
    }
}

// 기존에 Html 코드로 '채팅방 목록'에 있었을 경우 -> 휴지통 버튼을 누른 경우 
function initializeTrashIcons() {
    document.querySelectorAll('.trash-icon').forEach(function(icon) {
        icon.addEventListener('click', function(event) {
            console.log('휴지통 버튼');

            event.stopPropagation(); // 버블링 방지
            this.closest('li').remove(); // 가장 가까운 li 요소 삭제

            clearMainContent(); // Main 화면의 내용을 클리어합니다.
        });
    });
}

// '엔터란?'를 클릭하면 Routing 하는 함수
function question_enter(){
    window.location.href='../enter_introduction.html';
}

// 'AI 설정'을 click하면 호출되는 함수
function toggleModal() {
    var modal = document.getElementById("myModal");  // 모달창 
    var isModalOpen = modal.style.display === "block";

    var popup1_content = document.querySelector(".popup1-content"); // '크롤러 설정'에 대한 content
    var popup2_content = document.querySelector(".popup2-content"); // '템플릿'에 대한 content
    var popup3_content = document.querySelector(".popup3-content"); // '자주 쓰는 문구'에 대한 content

    if (isModalOpen) {     // modal.style.display==='block'일 떄 (즉 Model 화면을 나가려고 할 떄 )
        modal.style.display="none";
        removeBlurFromElements();
    } else {               // modal.style.display==='none'일 떄  (즉 Model 화면으로 들어왔을 떄 )
        modal.style.display = "block";

        popup3_content.style.display='none';

        applyBlurToElements();
    }
}

// 모달을 제외한 주요 요소에 블러 효과 적용 하는 함수
function applyBlurToElements() {
    // 모달을 제외한 주요 요소에 블러 효과 적용
    document.querySelector('header').classList.add('blur-effect');
    document.querySelector('#sidebar').classList.add('blur-effect');
    document.querySelector('main').classList.add('blur-effect');
}

// 모든 요소에서 블러 효과를 제거하는 함수 
function removeBlurFromElements() {
    // 모든 요소에서 블러 효과 제거
    document.querySelector('header').classList.remove('blur-effect');
    document.querySelector('#sidebar').classList.remove('blur-effect');
    document.querySelector('main').classList.remove('blur-effect');
}

// '문의 게시판?'를 클릭하면 Routing 하는 함수
function goInquiry(){
    window.location.href='../inquiryBoard_test.html';
}


// '로그아웃'을 클릭하면 Routing 하는 함수
function goLogout(){
    alert('로그아웃을 했습니다.');
    localStorage.removeItem('accessToken'); // localStroage에서 'accessToken' 삭제

    
    window.location.reload(); // 현재 페이지를 새로고침
}

// 모달 창에서 '크롤러 설정'을 click 했을 떄 호출되는 함수
function handleCrawlerClick(){
    
}

// 모달 창에서 '템플릿'을 click 했을 떄 호출되는 함수
function handleTemplateClick(){

}

// 모달 창에서 '자주 쓰는 문구'을 click 했을 떄 호출되는 함수
function handleUseClick(){
    var popup3_content = document.querySelector(".popup3-content");
    popup3_content.style.display = 'block'; // 팝업 내용을 표시합니다.
}

// 모달 창에서 '자주 쓰는 문구' -> '추가하기' 버튼이 click 될 떄 호출되는 함수
function addTemplate() {
    // 새로운 프롬프트 템플릿 생성
    var newPrompt = document.createElement("div");
    newPrompt.className = 'promptTemplate';
    newPrompt.style.display = 'flex';
    newPrompt.style.alignItems = 'center';

    // 체크박스 추가
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.width = "30px";
    checkbox.style.marginRight = "10px";
    newPrompt.appendChild(checkbox);

    // 문구 텍스트 추가
    var text = document.createElement("p");
    text.style.margin = "0 20px 0 0";
    text.style.width = "80px";
    text.textContent = "문구";
    newPrompt.appendChild(text);

    // 간격을 위한 빈 div 태그 추가
    var spacerDiv = document.createElement("div");
    spacerDiv.style.marginLeft = "10px";
    newPrompt.appendChild(spacerDiv);

    // 입력창 추가
    var input = document.createElement("input");
    input.type = 'text';
    input.placeholder = '자주쓰는 문구에 대한 Text를 불러와야 합니다.';
    input.style.width = '575px'; // 입력창의 너비를 200픽셀로 설정
    newPrompt.appendChild(input);

    // '삭제하기' 버튼 추가
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "삭제하기";
    deleteButton.style.backgroundColor = "#ffcccc";
    deleteButton.style.color = "black";
    deleteButton.style.padding = "5px 10px";
    deleteButton.style.border = "none";
    deleteButton.style.borderRadius = "5px";
    deleteButton.style.marginLeft = "10px";
    deleteButton.style.width = "120px";
    deleteButton.onclick = function() { deleteTemplate(this) };
    newPrompt.appendChild(deleteButton);

    // 버튼 div를 찾고 새로운 템플릿을 그 전에 삽입
    var buttonDiv = document.querySelector('.content-area .popup3-content .promptTemplate').nextSibling;
    var contentArea = document.querySelector('.content-area .popup3-content');
    contentArea.insertBefore(newPrompt, buttonDiv);
}

// 모달 창에서 '자주 쓰는 문구' -> '삭제하기' 버튼이 click 될 떄 호출되는 함수
function deleteTemplate(button) {
    // 버튼이 속한 promptTemplate 요소를 삭제
    button.parentElement.remove();
}





