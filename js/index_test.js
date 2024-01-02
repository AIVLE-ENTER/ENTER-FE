// 전역 변수
let user_id; // 사용자 id 
let token;   // 토큰 

// index_test.html을 불러왔을 떄 로그인 여부를 판별한다.
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('새로고침');

    checkLoginStatusAndUpdateUI();
});

// 로그인 여부를 판별하는 함수
function checkLoginStatusAndUpdateUI() {
    token = getWithExpire('accessToken'); // 토큰을 받아온다.

    // 로그인 상태이면?
    if (token!==null) {
        // 백엔드 코드를 이용해서 유저 정보 불러오기
        getUserInfo();

        // 백엔드 코드를 이용해서 채팅방 목록 보여오기
        getChatList();

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
function getUserInfo(){
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

// 'New Chat' click 시 팝업 나타나는 함수 
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

// 'New Chat', '채팅방명 수정' 팝업 닫기 함수 
function closePopup() {
    document.getElementById('new-chat-popup').style.display = 'none';
    document.getElementById('update-popup').style.display = 'none';

}

// 백엔드에서 채팅방 목록 가져오기
function getChatList(){
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
       const chatRoomList = response.data['data']['chat_list']; // 백엔드에서 받은 채팅방 목록

       const conversationsElement = document.querySelector('.conversations'); // HTML에서 채팅방 목록을 담는 ul 요소 선택
       conversationsElement.innerHTML = ''; // 기존 목록 클리어

       // 채팅방이 없을 떄 
       if(chatRoomList.length==0){
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
         chatRoomList.forEach(chatRoom => {
            const li = document.createElement('li'); // 새로운 li 요소 생성

            // 채팅방 버튼 생성
            const button = document.createElement('button');
            button.className = 'conversation-button';
            button.textContent = chatRoom.title;
            button.id = chatRoom.target_object;

            // 채팅방을 클릭하면 질문과 대답으로 구성된 히스토리를 가져온다.
            button.addEventListener('click', () => getChatQaHistory(chatRoom));

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

// AI로부터 채팅방에 대한 질문 대답에 따른 히스토리를 가져오는 함수
function getChatQaHistory(chatRoom){
    const getHistory_URL=`http://127.0.0.1:8002/history/${user_id}/${chatRoom.target_object}`; // 백엔드 소통 URL

    // AI에서 제공하는 질문과 대답 쌍으로 이루어진 데이터를 가져온다.
    axios({
        method: 'get',
        url: getHistory_URL, 
    })
    .then(response => {
        console.log('질문&대답 데이터 :', response.data.conversation);

        displayChatQaHistory(response.data.conversation, 
                                  chatRoom);   // 화면에 표시하는 함수 호출
    })
    .catch(error => {
        console.error('오류:', error);
        alert('채팅 기록을 가져오지 못했습니다.');
    });
}

// 채팅방에 대한 질문과 대답에 대한 히스토리를 화면에 보여주는 함수
function displayChatQaHistory(QaDatas, chatRoom) {
    const conversationView = document.querySelector('.view.conversation-view');
    conversationView.innerHTML = ''; // 기존에 채팅 이력을 삭제한다.

    // 채팅 이력을 그려서 화면에 보여준다.
    QaDatas.forEach(QaData => { 
        // 질문 div 생성
        const questionDiv = document.createElement('div');
        questionDiv.style.backgroundColor = '#ffaaaa'; // 배경색: 분홍색
        questionDiv.style.color = 'white'; // 텍스트 색: 흰색
        questionDiv.style.padding = '10px';
        questionDiv.style.margin = '10px 0 0 0'; // 위쪽 마진
        questionDiv.style.borderRadius = '8px'; // 모서리 외곽선 둥글게
        questionDiv.innerHTML = '질문' +  '<br><br>' + QaData.question;

        // 대답 div 생성
        const answerDiv = document.createElement('div');
        answerDiv.style.backgroundColor = '#d280d2'; // 배경색: 보라색
        answerDiv.style.color = 'white'; // 텍스트 색: 흰색
        answerDiv.style.padding = '10px';
        answerDiv.style.margin = '10px 0 40px 0'; // 위쪽 마진 및 하단 마진 증가
        answerDiv.style.borderRadius = '8px'; // 모서리 외곽선 둥글게
        answerDiv.style.display = 'flex'; // flexbox 사용
        answerDiv.style.justifyContent = 'space-between'; // 아이템을 양쪽 끝으로 정렬
        answerDiv.innerHTML = 'ENTER' + '<br><br>' + QaData.answer;

        // 대답 div 옆에 'edit Icon'을 배치한다.
        const span = document.createElement('span');
        span.className = 'material-icons';
        span.textContent = 'edit'; // Material Icons의 edit 아이콘
        span.style.color = '#808080'; // 진한 회색 적용
        span.style.marginLeft = '15px';
        span.style.marginTop = '15px';
        span.style.cursor = 'pointer'; // 마우스 오버 시 포인터 모양 변경

        // 아이콘 클릭 이벤트 리스너
        span.onclick = function() {
            checkMemo(QaData.history_id);
        };

        // 아이콘을 대답 div에 추가
        answerDiv.appendChild(span);

        // 질문과 대답 div를 conversation view에 추가
        conversationView.appendChild(questionDiv);
        conversationView.appendChild(answerDiv);
    });

    // 최신 채팅이 먼저 보이게끔 적용한다.
    conversationView.scrollTop = conversationView.scrollHeight;

    // 입력창도 보이게 해야 한다.
    const messageForm = document.getElementById('message-form'); // 메시지 폼을 선택합니다.
    messageForm.style.display = 'block'; // 메시지 폼을 보이게 설정합니다.
    
    // 입력창에 있는 값은 항상 빈값 상태로 유지
    var textareaElement = document.getElementById('message');
    textareaElement.value='';

    // 하단 입력창에 있는 '전송' 버튼에 대한 참조를 얻음
    const sendButton = document.querySelector('.send-button');

    // 하단 입력창에 있는 '전송' 버튼을 click 했을 떄 
    sendButton.onclick = function() {
        console.log('클릭');
        sendQuestion(chatRoom);
    };

    // 하단 입력창에다 엔터 클릭했을 떄 리스너
    messageForm.addEventListener("keydown", (e) => {
        // If Enter key is pressed without Shift key and the window 
        if(e.key === "Enter" && !e.shiftKey) {
            // 하단 입력창에 '전송' 버튼이 보일 떄에만 이 if문을 적용
            const sendButton = document.querySelector('.send-button');
            if (sendButton.style.display !== 'none') {
                e.preventDefault();
                sendQuestion(chatRoom);
            }
        }
    });
}

// 새로운 메시지를 전송하는 함수
function sendQuestion(chatRoom) {
    // 입력창에 적은 text를 가져온다.
    var textareaElement = document.getElementById('message');  
    var question = textareaElement.value;

    // 하단 입력창에 대한 값을 빈값으로 대치한다.
    textareaElement.value='';

    // 질문을 화면에 추가
    addQA(question,
          '#ff7777',
           false); // 질문 추가

    // 대답을 위한 빈 div 추가
    const emptyAnswerDiv = addQA('ENTER',
                                 '#cc55cc',
                                  true);

    // 대답을 실시간으로 보여주는 함수
    generateAnswerLive(emptyAnswerDiv, question, chatRoom);

    // 대답을 실시간으로 보여줄 떄는 사용자가 클릭 할 수 없게 '전송'하기 버튼을 비활성화 한다.
    const sendButton = document.querySelector('.send-button');
    sendButton.style.display = 'none'; // 버튼 표시
}

// 대화(Q, A)에 메시지를 추가하는 함수
function addQA(question, bgColor, isAnswer) {
    const conversationView = document.querySelector('.view.conversation-view');
    const messageDiv = document.createElement('div');

    messageDiv.style.backgroundColor = bgColor;
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '10px';
    messageDiv.style.margin = '10px 0';
    messageDiv.style.borderRadius = '8px';

    messageDiv.innerHTML = isAnswer ? 'ENTER' + '<br><br>' : '질문' + '<br><br>' + question;

    // 질문에만 마진을 적용하지 않고, 대답에는 마진을 적용함
    messageDiv.style.marginBottom = isAnswer ? '40px' : '0';

    conversationView.appendChild(messageDiv);
    return messageDiv; // 추가된 div 반환
}

// 대답(A)을 실시간으로 보여주는 함수
const generateAnswerLive = (emptyAnswerDiv, question, chatRoom) => {
    const answerLiveResponse_URL = `http://127.0.0.1:8002/answer/${user_id}/${chatRoom.target_object}/True`;  
    const messageElement = emptyAnswerDiv
    const conversationView = document.querySelector('.view.conversation-view');

    // AI에서 만든 대답 데이터를 받아와서 실시간으로 화면에 표시한다.
    fetch(answerLiveResponse_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
           question: question,
        }),
       })
        .then((response) => {
          console.log(response);

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
  
          const readChunk = () => {
            //console.log(reader.read().value)
            return reader.read().then(appendChunks);
          };
  
          const appendChunks = (result) => {
            console.log('appendchunks')
            const chunk = decoder.decode(result.value || new Uint8Array(), {
              stream: !result.done,
            });

            const parseData = chunk;
            console.log(parseData);

            messageElement.innerHTML +=parseData;
  
            if (!result.done) {
              return readChunk();
            }
          };
  
          return readChunk();
        })
        .then(() => {
            conversationView.scrollTop = conversationView.scrollHeight;  // 최신 질문과 대답을 볼 수 있도록 자동적으로 아래로 스크롤한다.

            // 하단 입력창에 대한 '전송' 버튼을 활성화 한다.
            const sendButton = document.querySelector('.send-button');
            sendButton.style.display = 'block'; // 버튼 표시
 
            // 채팅 이력을 다시 불러온다.
            getChatQaHistory(chatRoom);
        })
        .catch((e) => {
            console.log('error');
            console.log(e);
            
            // 하단 입력창에 대한 '전송' 버튼을 활성화 한다.
            const sendButton = document.querySelector('.send-button');
            sendButton.style.display = 'block'; // 버튼 표시

            // 채팅 이력을 다시 불러온다.
            getChatQaHistory(chatRoom);
        });
};

// 대답(R)에 대한 'edit Icon'을 클릭했을 떄 메모가 있는지 확인하는 함수
function checkMemo(history_id) {
    console.log('history_id : ', history_id);
    const getMemo_URL= `http://localhost:8000/main/memo/detail/?memo_id=${history_id}`; // 백엔드 소통 URL

    // 백엔드에서 구현한 '메모 불러오기' 기능과 소통한다.
    axios({
        method: 'get',
        url: getMemo_URL, 
        headers: { 
            'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
        },
    })
    .then(response => {
        console.log('성공:', response);
        
        // Case 1. 메모가 있으면 사용자가 입력했었던 메모를 보여주고 수정하기 삭제하기 버튼을 클릭할 수 있도록 한다.
        if(response.data.data.is_memo===true){
            showMemo(history_id,
                          true,
                          response.data.data.memo.memo_content);
        }
        // Case 2.) 메모가 없으면 빈 메모를 보여주고 저장하기 버튼을 클릭할 수 있도록 한다.
        else{
            showMemo(history_id, 
                          false);
        }
    })
    .catch(error => {
        console.log('에러 : ', error);
       
    });
}

// 메모를 보여주는 함수
function showMemo(history_id, flag, txt=''){
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.id = 'overlay'; // 오버레이에 고유한 ID 부여
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';

    // 팝업 컨테이너 생성
    const popupContainer = document.createElement('div');
    popupContainer.id = 'memoPopup';
    popupContainer.style.position = 'fixed';
    popupContainer.style.left = '50%';
    popupContainer.style.top = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.borderRadius = '8px';
    popupContainer.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    popupContainer.style.maxWidth = '500px';
    popupContainer.style.width = '80%';
    popupContainer.style.boxSizing = 'border-box';
    popupContainer.style.zIndex = '1000';

    // 팝업 타이틀 생성
    const popupTitle = document.createElement('h2');
    popupTitle.textContent = '메모 팝업';
    popupTitle.style.marginBottom = '20px';
    popupTitle.style.color = '#333';
    popupTitle.style.textAlign = 'center';

    // 메모 입력을 위한 textarea 생성
    const memoInput = document.createElement('textarea');
    memoInput.style.width = '100%';
    memoInput.style.height = '150px';
    memoInput.style.marginBottom = '10px';
    memoInput.style.boxSizing = 'border-box';

    // 버튼 컨테이너 생성 및 스타일 설정
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end'; // 버튼을 오른쪽 정렬
    buttonContainer.style.marginTop = '10px';

    // 메모가 있을 경우
    if (flag) {
        memoInput.value = txt; // 기존 메모 내용

        // 수정하기 버튼 생성 및 추가
        const editButton = document.createElement('button');
        editButton.textContent = '수정';
        editButton.style.marginLeft = '10px';
        editButton.onclick = function() {
            // 메모 수정 로직
            const updatedMemo = memoInput.value;
            updateMemo(history_id, updatedMemo);
        };

        // 삭제하기 버튼 생성 및 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.style.marginLeft = '10px';
        deleteButton.onclick = function() {
            // 메모 삭제 로직
            deleteMemo(history_id);
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
    }
    // 메모가 없을 경우
    else {
        // 저장하기 버튼 생성 및 추가
        const saveButton = document.createElement('button');
        saveButton.textContent = '저장';
        saveButton.onclick = function() {
            // 메모가 빈값인지 아닌지 확인한다.
            const memoContent = memoInput.value;
            if(memoContent === ''){
                alert('메모 내용을 입력해야 합니다.');
            }
            else {
                saveMemo(history_id, memoContent);
            }
        };

        buttonContainer.appendChild(saveButton);
    }

    // 팝업에 타이틀, textarea, 버튼 컨테이너 추가
    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(memoInput);
    popupContainer.appendChild(buttonContainer);

    // 팝업을 body에 추가
    document.body.appendChild(overlay);
    document.body.appendChild(popupContainer);

    // 팝업 외부 클릭 시 닫기 이벤트 처리
    window.onclick = function(event) {
        if (event.target == overlay) {
            document.body.removeChild(popupContainer);
            document.body.removeChild(overlay);
        }
    }
}

// 메모를 저장하는 함수
function saveMemo(history_id, memoContent){
    // 백엔드에서 구현한 '메모 작성하기' 기능과 소통한다.
    const writeMemo_URL=`http://localhost:8000/main/memo/create/`;
    axios({
        method: 'post',
        url: writeMemo_URL, 
        headers: { 
            'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
        },
        data : {'memo_id': history_id, 
                'memo_content': memoContent},
        
    })
    .then(response => {
        console.log('성공:', response);

        // 메모 팝업을 없앤다.
        closeMemo();
    })
    .catch(error => {
        console.log('에러 에러 : ', error);
        alert('에러');
    });
}

// 메모를 수정하는 함수
function updateMemo(history_id, memoContent){
    // 백엔드에서 구현한 '메모 작성하기' 기능과 소통한다.
    const updateMemo_URL=`http://localhost:8000/main/memo/update/`;

    if(memoContent==''){
        alert('빈값을 입력하셨습니다.');
    }
    else{
        axios({
            method: 'post',
            url: updateMemo_URL, 
            headers: { 
                'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
            },
            data : {'memo_id': history_id, 
                    'memo_content': memoContent},
        })
        .then(response => {
            console.log('성공:', response);
    
            // 메모 팝업을 없앤다.
            closeMemo();
        })
        .catch(error => {
            console.log('에러 에러 : ', error);
            alert('에러');
        });
    }
}

// 메모를 삭제하는 함수
function deleteMemo(history_id){
    // 백엔드에서 구현한 '메모 삭제하기' 기능과 소통한다.
    const deleteMemo_URL=`http://localhost:8000/main/memo/delete/`;

    axios({
        method: 'post',
        url: deleteMemo_URL, 
        headers: { 
            'Authorization': JSON.stringify({'Authorization': `Bearer ${token}`}),
        },
        data : {'memo_id': history_id}
    })
    .then(response => {
        console.log('성공:', response);

        // 메모 팝업을 없앤다.
        closeMemo();
    })
    .catch(error => {
        console.log('에러 에러 : ', error);
        alert('에러');
    });
}

// 메모 팝업을 닫는 함수
function closeMemo() {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('memoPopup');
    if (overlay) {
        document.body.removeChild(overlay); // 오버레이 제거
    }
    if (popupContainer) {
        document.body.removeChild(popupContainer); // 팝업 컨테이너 제거
    }
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

// 모달 창에서 자주 쓰는 문구를 목록으로 보여주는 함수
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
            <input type="radio" 
                    name="selectedMessage"
                    data-template-id="${message.template_id}"
                    style="width:30px; 
                    margin-right: 10px;">
                  
            <p style="margin: 0px 10px 0px 0px; width: 300px;">${message.template_name}</p>

            <input type='text'
                   value='${message.template_content}'
                   style='margin-right: 10px;
                   placeholder='자주쓰는 문구에 대한 Text를 불러와야 합니다.'
                   disabled>

            <button type="button"
                    style="background-color: #ccccff; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 160px;"
                    onclick="editFrequentMessage('${message.template_id}')">수정하기</button>

            <button type="button" 
                    style="background-color: #ffcccc; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 160px;"
                    onclick="deleteFrequentMessage('${message.template_id}')">삭제하기</button>

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
        reflectFrequentMessage();
    };

    actionDiv.appendChild(addButton);
    actionDiv.appendChild(reflectButton);
    container.appendChild(actionDiv); // 컨테이너에 추가
}

// 모달 창에서 '자주 쓰는 문구' -> '수정하기' 버튼이 click 될 떄 호출하는 함수
function editFrequentMessage(template_id){
      // 수정용 팝업 표시
      document.getElementById("editFrequentMessagePopup").style.display = "flex";

      // 입력을 빈칸으로 표시
      document.getElementById("editMessageTitle").value='';
      document.getElementById("editMessageContent").value='';

      // '수정하기' 버튼에 template_id 설정
     document.getElementById("editSubmitButton").dataset.templateId = template_id;
}

// 자주 쓰는 문구를 수정하는 팝업에서 '수정하기'를 click했을 떄 호출되는 함수
function submitEditFrequentMessage(){
    var templateId = document.getElementById("editSubmitButton").dataset.templateId;
    var editMessageTitle = document.getElementById("editMessageTitle").value;
    var editMessageContent = document.getElementById("editMessageContent").value;

    // 백엔드에서 구현한 '자주 쓰는 문구 수정' 기능과 통신한다.
    const editFrequentMessage_URL='http://localhost:8000/main/frequentMessage/update/'; 
    axios({
        method: 'post',
        url: editFrequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data:  {'template_id': templateId, 
                'template_name': editMessageTitle, 
                'template_content': editMessageContent},
    })
    .then(response => {
        // '수정하는 자주 쓰는 문구' 팝업을 종료한다.
        document.getElementById("editFrequentMessagePopup").style.display = "none";

        // AI 설정 팝업을 다시 불러온다
        handleUseClick();
    })
    .catch(error => {
        console.log('에러');
        console.log(error);
    });
}

// 자주 쓰는 문구를 수정하는 팝업에서 '취소하기'를 click 했을 떄 호출되는 함수
function closeEditFrequentMessage(){
    // 수정용 팝업의 'display' 속성을 'none'으로 설정
    document.getElementById("editFrequentMessagePopup").style.display = "none";
}

// 모달 창에서 '자주 쓰는 문구' -> '삭제하기' 버튼이 click 될 떄 호출하는 함수
function deleteFrequentMessage(template_id){
    // 백엔드에서 구현한 '자주 쓰는 문구 삭제하기' 기능과 통신한다.
    const deleteFrequentMessage_URL='http://localhost:8000/main/frequentMessage/delete/';
    axios({
        method: 'post',
        url: deleteFrequentMessage_URL,
        headers: {
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        },
        data:{'template_id': template_id},
    })
    .then(response => {
        // AI 설정 팝업을 다시 불러온다
        handleUseClick();
    })
    .catch(error => {
        console.log('에러');
        console.log(error);
    });
   
}

// 모달 창에서 '자주 쓰는 문구' -> '추가하기' 버튼이 click 될 떄 호출되는 함수
function addFrequentMessage() {
    // 추가용 팝업 표시
    document.getElementById("addFrequentMessagePopup").style.display = "flex";

    // 입력을 빈칸으로 표시
    document.getElementById("messageTitle").value='';
    document.getElementById("messageContent").value='';
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
        document.getElementById("addFrequentMessagePopup").style.display = "none";

        // AI 설정 팝업을 다시 불러온다
        handleUseClick();
    })
    .catch(error => {
        console.log('에러');
        console.log(error);
    });
}

// 자주 쓰는 문구를 추가하는 팝업에서 '취소'를 click 했을 떄 호출되는 함수
function closeFrequentMessage() {
    document.getElementById("addFrequentMessagePopup").style.display = "none";
}

// 모달 창에서 '자주 쓰는 문구' -> '반영하기' 버튼을 click 했을 떄 호출되는 함수
function reflectFrequentMessage(){
    const selectedCheckbox = document.querySelector('.promptTemplate input[type="radio"]:checked'); 

    // 체크박스를 적용했는지 안했는지 여부를 판단한다.
    if (selectedCheckbox) {
        // const templateId = selectedCheckbox.getAttribute('data-template-id');
        const templateValue = selectedCheckbox.nextElementSibling.nextElementSibling.value; // 체크박스의 다음 다음 요소인 input 태그의 value를 가져옵니다.

        // AI 설정 팝업을 닫는다.
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';

        // 블러를 제거한다.
        removeBlurFromElements();

        // 하단 입력창이 열려있는지 안열려있는지 확인
        checkMessageFormDisplay(templateValue);
    } 
    else {
        alert('선택된 메시지가 없습니다.');
    }
}

// 하단 입력창이 열려 있는지 확인한다.
function checkMessageFormDisplay(templateValue){
    const messageForm = document.getElementById('message-form');
    const style = window.getComputedStyle(messageForm);

    if (style.display==='block') {
        // 하단 입력창에 text 붙이기
        var textareaElement = document.getElementById('message');
        textareaElement.value=templateValue;
    }  
    else {
        alert('하단에 입력창이 활성화 되어야 적용할 수 있습니다.');
    }
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