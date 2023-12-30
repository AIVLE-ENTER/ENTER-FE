// 전역 변수
let user_id; // 사용자 id 
let token;   // 토큰 

// index_test.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    token = getWithExpire('accessToken'); // 토큰을 받아온다.

    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo(token);

        // 백엔드 코드를 이용해서 채팅방 목록 보여오기
        getChatList(token);

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

      // Header 창 오른쪽 '~님 안녕하세요!!를 보여주지 않도록 한다.
      document.querySelector('header .header-link').style.display='none';
    }
}

// 백엔드에서 유저 정보 불러오기
function getUserInfo(token){
    const getUserInfo_URL= 'http://localhost:8000/account/auth/userInfo/';  // 백엔드 소통 URL

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
        // console.log('성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        user_id=response.data['data']['user_id'];   // 아이디를 가져온다.
        document.querySelector('.header-link h3').textContent = `${user_id}님 안녕하세요!!`; // h3 태그에 보여준다.
    })
    .catch(error => {
        window.location.reload(); // 새로 고침한다.
    });
}

// 'New Chat - 생성하기' click 했을 떄 호출되는 함수
function generateChat(event) {
    event.preventDefault();  // 폼 제출에 의한 페이지 새로고침 방지

    console.log('생성하기');

    var topic=document.getElementById('topic').value;                // 주제를 가져온다.
    var chatRoomName=document.getElementById('chatroom-name').value; // 채팅방명을 가져온다.
    var generateChat_URL='http://localhost:8000/main/chatWindow/create/'; // 백엔드 통신 URL

    if(topic=='' || chatRoomName==''){  // 둘 중 하나가 빈 값일 떄 처리
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.style.display = 'block'; // 오류 메시지 요소를 보이게 설정
        errorMessageDiv.textContent='빈 값이 있습니다.'; // 오류 메시지 설정
        return;
    }

    // 백엔드에서 구현한 '채팅방 생성' 기능을 통신한다.
    axios({
        method: 'post',
        url: generateChat_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
            'target': topic, 
            'title': chatRoomName,
        }
    })
    .then(response => {
        console.log('message : ', response.data.message);
        console.log('errors : ', response.data.errors);

        closePopup(); // 팝업 창을 닫음

        window.location.reload(); // 새로 고침하기
    })
    .catch(error => {
        console.error('Error :', error);

        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.style.display = 'block'; // 오류 메시지 요소를 보이게 설정
        errorMessageDiv.textContent=error.response.data.message; // 오류 메시지 설정
    });
}

// 'New Chat'click 시 팝업 나타나는 함수 
function openPopup() {
    document.getElementById('new-chat-popup').style.display = 'flex';

    var topic = document.getElementById('topic');
    var chatRoomName = document.getElementById('chatroom-name');
    const errorMessageDiv = document.getElementById('error-message');

    topic.value='';
    chatRoomName.value='';
    errorMessageDiv.style.display = 'none';

    document.getElementById('topic').addEventListener('input', function() {
        document.getElementById('chatroom-name').value = this.value;
    });
}

// 'New Chat', '채팅방명 수정' 팝업 닫기 함수 
function closePopup() {
    document.getElementById('new-chat-popup').style.display = 'none';
    document.getElementById('update-popup').style.display = 'none';

}

// 백엔드에서 채팅방 목록 가져오기
function getChatList(token){
    const getChatList_URL=`http://localhost:8000/main/`;

    axios({
        method: 'get',
        url: getChatList_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        // 요청이 성공하면 이 부분이 실행됩니다.
        console.log('채팅방 불러오기 성공:', response.data); // 로그에 응답 데이터를 찍습니다.

       // 채팅방 목록을 화면에 붙이기
       const chat_List = response.data['data']['chat_list']; // 백엔드에서 받은 채팅방 목록
       //  console.log(`chatList : ${chat_List}`);

       const conversationsElement = document.querySelector('.conversations'); // HTML에서 채팅방 목록을 담는 ul 요소 선택
       conversationsElement.innerHTML = ''; // 기존 목록 클리어

       // 채팅방이 없을 떄 
       if(chat_List.length==0){
            // 채팅방 목록이 비어 있을 때
            const li = document.createElement('li');
            li.textContent = '채팅방이 없습니다';
            li.style.textAlign = 'center';
            li.style.marginTop = '150px'; // 위치를 아래로 조정
            li.style.fontSize = '1.6em'; // 텍스트 크기 키우기
            conversationsElement.appendChild(li);
       }
       // 채팅방이 있을 떄 
       else{
         // 채팅방 목록을 순회하면서 각 채팅방에 대한 HTML 요소 생성
         chat_List.forEach(chatRoom => {
            const li = document.createElement('li'); // 새로운 li 요소 생성

            // 채팅방 버튼 생성
            const button = document.createElement('button');
            button.className = 'conversation-button';
            button.textContent = chatRoom.title;
            button.id = chatRoom.target_object;

            // 채팅방을 클릭하면 질문과 대답으로 구성된 히스토리를 가져온다.
            button.addEventListener('click', () => getHistory(chatRoom));

            // 채팅방 수정, 삭제 아이콘 생성
            const span = document.createElement('span');
            span.className = 'material-icons';
            span.textContent = 'more_vert';
            span.style.marginLeft = '15px';
            span.style.marginTop = '15px';

            // '|' 아이콘 클릭 시 이벤트 리스너 추가
            span.onclick = function() {         
                event.stopPropagation(); // 이벤트 버블링 방지
                   
                // 수정이나 삭제가 나오는 context-menu를 보여준다.
                const contextMenu = document.getElementById('contextMenu');
                contextMenu.style.display = 'block';
                contextMenu.setAttribute('data-chat-window-id', chatRoom.chat_window_id); 
                contextMenu.style.left = event.clientX + 'px';
                contextMenu.style.top = event.clientY + 'px';

                 // 외부 클릭 시 컨텍스트 메뉴 숨기기
                document.addEventListener("click", function() {
                    document.getElementById("contextMenu").style.display = "none";
                });
            };

            // li 요소에 버튼과 삭제 아이콘 추가
            li.appendChild(button);
            li.appendChild(span);

            // ul 요소에 새로운 li 요소 추가
            conversationsElement.appendChild(li);
        });
       }
    })
    .catch(error => {
        // 오류가 발생하면 이 부분이 실행됩니다.
        alert('채팅방 불러오기 오류');
    });
}

// 채팅방에 따른 질문과 히스토리를 가져오는 함수
function getHistory(chatRoom){
    console.log(chatRoom);
    // url에 userID와 TargetObject(키워드)를 포함해야 한다.

                // // 172.29.26.116:8000/user_id/keyword
                // axios({
                //     method: 'get',
                //     url: `http://172.29.26.116:8000/asdf123/cafe`,
                // })
                // .then(response => {
                //     // 요청이 성공한 경우
                //     console.log('성공:', response);
                //     // 여기에 성공했을 때의 로직을 추가합니다.
                // })
                // .catch(error => {
                //     // 오류가 발생한 경우
                //     console.error('오류:', error);
                //     // 여기에 오류 처리 로직을 추가합니다.
                // });

}

// context에서 '수정'을 클릭했을 떄 
function modify(){
    var contextMenu=document.getElementById("contextMenu");
    var chatWindowId=contextMenu.getAttribute('data-chat-window-id');
    var update_popup=document.getElementById('update-popup');

    // 채팅방 제목을 수정하는 팝업을 띄운다.
    update_popup.style.display = 'flex';
    update_popup.setAttribute('data-chat-window-id', chatWindowId); 

    // 채팅방 제목을 빈값으로 만든다.
    var form = document.getElementById('update-chat-form');
    form.elements['chatroom-name'].value = '';

    // 혹시 오류 메시지가 있으면 빈칸으로 설정한다.
    var form = document.getElementById('update-chat-form');
    var errorMessageDiv = form.querySelector('#error-message');
    errorMessageDiv.textContent='';
}

// 팝업에서 채팅방 제목을 수정했을 떄 호출되는 함수
function editChatRoom(){
    event.preventDefault(); // 새로고침 방지

    var contextMenu = document.getElementById('update-popup');
    var chatWindowId = contextMenu.getAttribute('data-chat-window-id');

    var form = document.getElementById('update-chat-form');
    var chatroomName = form.elements['chatroom-name'].value;

    const editChatRoom_URL='http://localhost:8000/main/chatWindow/update/'; // 백엔드 소통 URL

    // 백엔드에서 구현한 '채팅방 수정' 기능을 통신한다.
    axios({
        method: 'post',
        url: editChatRoom_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
           'chat_window_id':chatWindowId, 
            'title': chatroomName,
        }
    })
    .then(response => {
        console.log('성공!!');

        document.getElementById('update-popup').style.display = 'none';   // 팝업을 숨김

        window.location.reload(); // 새로 고침
    })
    .catch(error => {
        console.log(`에러 : ${error.response.data.message}`);

        // 폼 요소 가져오기
        var form = document.getElementById('update-chat-form');

        // 폼 내의 오류 메시지 요소에 접근
        var errorMessageDiv = form.querySelector('#error-message');

        // 에러 메시지를 보여준다.
        errorMessageDiv.style.display='block';
        errorMessageDiv.textContent=error.response.data.message;
    });
}

// 채팅방을 삭제할 떄 함수
function deleteChatRoom(){
    var contextMenu=document.getElementById("contextMenu");
    var chatWindowId=contextMenu.getAttribute('data-chat-window-id');

    const deleteChatRoom_URL='http://localhost:8000/main/chatWindow/delete/'; // 백엔드 소통 URL

    // 백엔드에서 구현한 '채팅방 삭제' 기능을 통신한다.
    axios({
        method: 'post',
        url: deleteChatRoom_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {
           'chat_window_id': chatWindowId,
        }
    })
    .then(response => {
        console.log('성공!!');
        window.location.reload(); // 새로 고침
    })
    .catch(error => {
        console.log(`에러 : ${error.response.data.message}`);
    });
}

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

// 모달 창에서 '크롤러 설정'을 click 했을 떄 호출되는 함수
function handleCrawlerClick(){
    
}

// 모달 창에서 '템플릿'을 click 했을 떄 호출되는 함수
function handleTemplateClick(){

}

// 모달 창에서 '자주 쓰는 문구'을 click 했을 떄 호출되는 함수
function handleUseClick(){
    // '메인 창'을 block으로 보이게끔 한다.
    var popup3_content = document.querySelector(".popup3-content");
    popup3_content.style.display = 'block'; // 팝업 내용을 표시합니다.

    // 백엔드에서 구현한 '자주 쓰는 문구 리스트 불러오기'를 구현한다.
    var frequentMessage_URL='http://localhost:8000/main/frequentMessage/';
    axios({
        method: 'get',
        url: frequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
    })
    .then(response => {
        console.log('자주 쓰는 문구 리스트 : ', response.data.data.message_list);

        // 화면에 자주 쓰는 문구를 보여준다.
        const messageList = response.data.data.message_list;
        renderFrequentMessages(messageList); // 화면에 자주 쓰는 문구를 보여주는 함수 호출
    })
    .catch(error => {
        // console.log('에러');
        // console.error(error); // 오류 처리
        alert('자주 쓰는 문구를 불러오는데 오류가 발생했습니다.');
    });
}

// 모달 창에서 자주 쓰는 문구를 보여주는 함수
function renderFrequentMessages(messageList){
    const container = document.querySelector('.popup3-content'); // 문구를 표시할 컨테이너 선택
    container.innerHTML = ''; // 기존 내용 클리어

    // 하나씩 자주 쓰는 문구를 화면에 그린다.
    messageList.forEach(message => {   
        const div = document.createElement('div');
        div.className = 'promptTemplate';
        div.style.display = 'flex';
        div.style.alignItems = 'center';

        div.innerHTML = `
            <input type="checkbox" 
                   style="width:30px; 
                   margin-right: 10px;">

            <p style="margin: 0px 10px 0px 0px; width: 300px;">${message.template_name}</p>

            <input type='text'
                   value='${message.template_content}'
                   style='margin-right: 10px;
                   placeholder='자주쓰는 문구에 대한 Text를 불러와야 합니다.'
                   disabled>

            <button type="button" 
                    style="background-color: #ffcccc; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 140px;"
                    onclick="deleteTemplate(this)">삭제하기</button>

            <div style="margin-left: 20px;"></div>
        `;

        container.appendChild(div);
    });

    // "추가하기"와 "반영하기" 버튼을 포함하는 div 추가
    const actionDiv = document.createElement('div');
    actionDiv.style.display = 'flex';
    actionDiv.style.justifyContent = 'flex-end';

    const addButton = document.createElement('span');
    addButton.className = 'add';
    addButton.textContent = '추가하기';
    addButton.onclick = function() {
        addFrequentMessage(); // "추가하기" 버튼 클릭 시 호출될 함수
    };

    const reflectButton = document.createElement('span');
    reflectButton.className = 'reflect';
    reflectButton.textContent = '반영하기';
    // 필요한 경우 반영하기 버튼 클릭 시 호출될 함수 추가
    reflectButton.onclick = function() {
        // 반영하기 로직 구현
    };

    actionDiv.appendChild(addButton);
    actionDiv.appendChild(reflectButton);
    container.appendChild(actionDiv); // 컨테이너에 추가
}

// 모달 창에서 '자주 쓰는 문구' -> '추가하기' 버튼이 click 될 떄 호출되는 함수
function addFrequentMessage() {
    document.getElementById("addFrequentMessagePopup").style.display = "flex";
}

// 자주 쓰는 문구를 추가하는 팝업에서 '추가'를 click했을 떄 호출되는 함수
function submitFrequentMessage() {
    // 문구 제목과 내용의 값을 가져옵니다.
    var title = document.getElementById("messageTitle").value;
    var content = document.getElementById("messageContent").value;

    // 백엔드에서 구현한 '자주 쓰는 문구 생성'과 연계한다.
    var addFrequentMessage_URL='http://localhost:8000/main/frequentMessage/create/';
    axios({
        method: 'post',
        url: addFrequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data: {'template_name': title,
               'template_content': content,
              },
    })
    .then(response => {
        console.log('성공');

        // '자주 쓰는 문구 생성' 팝업을 종료한다.
        title='';
        content='';
        document.getElementById("addFrequentMessagePopup").style.display = "none";
        // AI 설정 팝업을 다시 불러온다.


    })
    .catch(error => {
        console.log('에러');
        console.log(error);

        title='';
        content='';
    });
}

// 자주 쓰는 문구를 추가하는 팝업에서 '취소'를 click 했을 떄 호출되는 함수
function closeFrequentMessagePopup() {
    document.getElementById("addFrequentMessagePopup").style.display = "none";
}


// 모달 창에서 '자주 쓰는 문구' -> '삭제하기' 버튼이 click 될 떄 호출되는 함수
function deleteTemplate(button) {
    // 버튼이 속한 promptTemplate 요소를 삭제
    button.parentElement.remove();
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


// 기존에 Html 코드로 '채팅방 목록'에 있었을 경우 -> 휴지통 버튼을 누른 경우 
// function initializeTrashIcons() {
//     document.querySelectorAll('.trash-icon').forEach(function(icon) {
//         icon.addEventListener('click', function(event) {
//             console.log('휴지통 버튼');

//             event.stopPropagation(); // 버블링 방지
//             this.closest('li').remove(); // 가장 가까운 li 요소 삭제

//             clearMainContent(); // Main 화면의 내용을 클리어합니다.
//         });
//     });
// }


// 문서 로드 시 초기화 함수 실행
// document.addEventListener('DOMContentLoaded', 
//                           initializeTrashIcons);

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

