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

/* 주제(Target) 목록 중에 하나의 주제를 선택했을 떄 */
  
const chatRoomsData = {                                                 // 각 주제별 채팅방 목록 예시 데이터
    'gigagenie': ['기가지니 채팅방 1', '기가지니 채팅방 2', '기가지니 채팅방 3', '기가지니 채팅방 4',
                  '기자지니 채팅방 5', '기가지니 채팅방 6', '기가지니 채팅방 7', '기가지니 채팅방 8'],
    'pass': ['PASS 채팅방 1', 'PASS 채팅방 2'],
    'other1': ['Other1 채팅방 1', 'Other1 채팅방 2'],
    'other2': ['Other2 채팅방 1', 'Other2 채팅방 2'],
    'other3': ['Other3 채팅방 1', 'Other3 채팅방 2'],
    'other4': ['Other4 채팅방 1', 'Other4 채팅방 2'],
    // 여기에 추가 주제별 채팅방 목록 추가 가능
};

    // 주제(Target)를 선택했으면 그에 따른 채팅방 목록도 보여주기 
function showChats(topicKey) {
    const chatListDiv = document.getElementById('chat-list');
    chatListDiv.innerHTML = ''; // 기존 내용 초기화

    const ul = document.createElement('ul');
    ul.className = 'conversations';

    const chats = chatRoomsData[topicKey];
    chats.forEach(chat => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = chat;
        button.onclick = function() {
            // 여기에 채팅방 선택 시 수행할 동작 추가
            
            console.log(chat + ' 채팅방이 선택되었습니다.');
            displayChatHistory(chat);  // 목록을 가져옴 
        };

        li.appendChild(button);
        ul.appendChild(li);
    });

    chatListDiv.appendChild(ul);
}


/* 주제에 따른 채팅방을 click 했을 떄 과거의 히스토리를 목록으로 보여주는 함수 */
const chatRoomHistories = {
    '기가지니 채팅방 1': [
        { type: 'Q', text: '기가지니는 어떤 서비스인가요?' },
        { type: 'A', text: '기가지니는 AI 기반 음성 인식 서비스입니다.sadsadsadsadsadsadasdsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsaasdsadsadsadsadsadsadsadsadsadsadsadsadasdsadsadsadsadsasasasadasdsadsadassadsadsadsadsasadsadsadsadsadsadsadsadsadasdasdsadsadsasadsadasdsadassadsadsadsadsadsadsadsadsadsadsadsadassadasdsadsadsadsadsadsadasdasdsadadsdsadsadsadsadsadsadsasadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsad' },

        { type: 'Q', text: '기가지니는 어떤 서비스인가요?' },
        { type: 'A', text: '기가지니는 AI 기반 음성 인식 서비스입니다.sadsadsadsadsadsadasdsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsaasdsadsadsadsadsadsadsadsadsadsadsadsadasdsadsadsadsadsasasasadasdsadsadassadsadsadsadsasadsadsadsadsadsadsadsadsadasdasdsadsadsasadsadasdsadassadsadsadsadsadsadsadsadsadsadsadsadassadasdsadsadsadsadsadsadasdasdsadadsdsadsadsadsadsadsadsasadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsad' },  

        { type: 'Q', text: '기가지니는 어떤 서비스인가요?' },
        { type: 'A', text: '기가지니는 AI 기반 음성 인식 서비스입니다.sadsadsadsadsadsadasdsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsaasdsadsadsadsadsadsadsadsadsadsadsadsadasdsadsadsadsadsasasasadasdsadsadassadsadsadsadsasadsadsadsadsadsadsadsadsadasdasdsadsadsasadsadasdsadassadsadsadsadsadsadsadsadsadsadsadsadassadasdsadsadsadsadsadsadasdasdsadadsdsadsadsadsadsadsadsasadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsad' },
        
        { type: 'Q', text: '기가지니는 어떤 서비스인가요?' },
        { type: 'A', text: '기가지니는 AI 기반 음성 인식 서비스입니다.sadsadsadsadsadsadasdsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsaasdsadsadsadsadsadsadsadsadsadsadsadsadasdsadsadsadsadsasasasadasdsadsadassadsadsadsadsasadsadsadsadsadsadsadsadsadasdasdsadsadsasadsadasdsadassadsadsadsadsadsadsadsadsadsadsadsadassadasdsadsadsadsadsadsadasdasdsadadsdsadsadsadsadsadsadsasadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsad' },
    ],
    '기가지니 채팅방 2':[
        { type: 'Q', text: '기가지니는 어떤 서비스인가요?' },
        { type: 'A', text: '기가지니는 AI 기반 음성 인식 서비스입니다.sadasdsadsadsadsadsadadasdsfafsg' }
    ],
    // 다른 채팅방의 대화 히스토리
};
// 채팅방 히스토리를 표시하는 함수
function displayChatHistory(chatRoomKey) {
    const conversationView = document.querySelector('.view.conversation-view');
    conversationView.innerHTML = ''; // 기존 내용 초기화

    const histories = chatRoomHistories[chatRoomKey] || [];
    histories.forEach(item => {
        const messageDiv = document.createElement('div');
        messageDiv.className = item.type === 'Q' ? 'question' : 'answer';

        // 아이콘을 위한 span 요소 생성
        const iconSpan = document.createElement('span');
        iconSpan.className = 'message-icon';
        iconSpan.textContent = item.type === 'Q' ? 'Q' : 'A';

        // 메시지 텍스트를 위한 span 요소 생성
        const textSpan = document.createElement('span');
        textSpan.className='text';
        textSpan.textContent = item.text;

        // span 요소들을 messageDiv에 추가
        messageDiv.appendChild(iconSpan);
        messageDiv.appendChild(textSpan);

        conversationView.appendChild(messageDiv);
    });
    
    // 버튼 입력창 보여주기 
    const message_form = document.querySelector('#message-form');
    message_form.style.display='block';
}




// 'New Chat'click 시 팝업 나타나는 함수 
function openPopup() {
    document.getElementById('new-chat-popup').style.display = 'flex';
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

function exit(){
    window.location.href = '../index.html'; // 홈페이지 URL로 변경하세요
}


