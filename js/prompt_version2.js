// const sidebar = document.querySelector("#sidebar");
// const hide_sidebar = document.querySelector(".hide-sidebar");
// const new_chat_button = document.querySelector(".new-chat");

/* Hidden */
// hide_sidebar.addEventListener( "click", function() {
//     sidebar.classList.toggle( "hidden" );
// });

const user_menu = document.querySelector(".user-menu ul");
const show_user_menu = document.querySelector(".user-menu button");

/* 하단 Show Menu 보여주기 */
show_user_menu.addEventListener( "click", function() {
    if( user_menu.classList.contains("show") ) {
        user_menu.classList.toggle( "show" );
        setTimeout( function() {
            user_menu.classList.toggle( "show-animate" );
        }, 200 );
    } else {
        user_menu.classList.toggle( "show-animate" );
        setTimeout( function() {
            user_menu.classList.toggle( "show" );
        }, 50 );
    }
} );

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






// '채팅방명'을 click 했을 떄 호출되는 함수
function showChats(chatRoomName) {
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

    // 입력 버튼 보이게 한다.
    var messageForm = document.getElementById('message-form');
    messageForm.style.display = 'block'; // 'none' 대신 'block' 또는 'flex'로 변경
}

// 서버에서 데이터를 가져오거나, 이미 로드된 데이터를 반환하는 함수
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
            { question: '질문1', answer: '안녕하세요 저는 그냥 노체랭랭ㄹ앤룽내ㅜㄹㅇ내ㅜ랜우랜ㅇ루ㅐㅇㄴ루ㅐㅇㄴ루ㅐㅇㄴ룽낼앤룬애룽내ㅜㄹㄴ애ㅜ랜울ㅇ내루ㅐㄴㅇ루애눌ㅇ내룽내ㅜㄹ애누랜울애눌앤루앤루ㅐㄴㅇ루ㅐㄴㅇ루ㅐㄴ우랜우랭누랭누랭누래엔루ㅐ후ㅐㅑ후댜ㅐㄱ훋개ㅜ해댜궇ㄱ대햐무랴루ㅑ우랴ㅐㅇ누량누랴앤룽내ㅑㅜㄹㄴ애ㅑ룽냐ㅐ룽내룬애루ㅐㄴㅇ루ㅑㅐㄴ우랴ㅐㄴㅇ루ㅑㅐㅇ누랴ㅐㄴㅇ루ㅐㄴㅇ루앤루ㅑㅐㄴㅇ룽내룬애루앤ㄹㅇ내루ㅐ냐혀휵뎌휵뎌ㅑ휵댜ㅕ휻ㄱㅎdasdasfasfdfdsfsdfhsdfsdfhsdufhdsiufhdsfiuhdsfiudsfisdhfiusdigsdfdifgdufgsdifusdfgdsuifdgsifgsdiufgsdifgdsifgidsfgdisfgisdfgdisfgidsfgidsfgdisufgeuifgfegfguefgwefgewfewuifgufigdufidgsfgdsfgsdifgdsifgdsfisdgfidsgfidsgfidsfgdsifgydwdywfdwydfywfdyufdwyfduydfwywqdfywdfywfqdywqdfwtdwqdfwqdfwqdufqwdtwqdfwtdwqfdytwqfdwqtydfwqytdfqwydfwqydfwqtydfqwtydfwqtydfwqytdfwqytdfwqdfwqudfwqydfwqduwqfyduwqdfwqdufwqdfuwqydufwqydufywqdfwqdfwqdyuwfqduywfdwqydwfqydwqfyd' },
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
    chatRoomName='';

    document.getElementById('topic').addEventListener('input', function() {
        document.getElementById('chatroom-name').value = this.value;
    });
}

// 팝업 닫기 함수 
function closePopup() {
    document.getElementById('new-chat-popup').style.display = 'none';
}

// '자주 사용하는 문구' click 했을 떄 열리는 함수
function useWell() {
    document.getElementById('wellPhrasesPopup').style.display = 'block';
}

// 팝업 닫기 함수 
function closeWellPhrasesPopup() {
    document.getElementById('wellPhrasesPopup').style.display = 'none';
}

// 나가기 함수
function exit(){
    window.location.href = '../index.html'; // 홈페이지 URL로 변경하세요
}

// 'New Chat - 생성하기' click 했을 떄 호출되는 함수 
function generateChat(){
    

}




