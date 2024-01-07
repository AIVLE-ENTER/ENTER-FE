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
        getChatRoomList();

    } 
    // 비로그인 상태이면?
    else {
        // 'sidebar'에는 이렇게 화면을 그려준다.
        document.getElementById('sidebar').innerHTML = `
            <div style="height: calc(100vh - 50px); padding:10px; display: flex; flex-direction: column; justify-content: center;">
                <h2 style='font-weight: 100; text-align:center;'>로그인 후 <span style="color: #454997;">ENTER</span>를 <br> 마음껏 활용하세요</h2>
        
                <div style='margin-top: 350px; width: 100%; border-bottom: 1px solid black;'></div>

                <div style='margin-top:20px;'>
                    <a href="../enter_introduction.html" 
                       style="text-decoration: none; color: black; display: block; margin-bottom: 20px;">
                        <img src="assets/img/what_enter.png" 
                             style="width: 20px; height: 20px; vertical-align: middle; margin-bottom:3px; margin-right: 5px;">
                        엔터란?
                    </a>
                    <a href="../signin_test.html"
                       style="text-decoration: none; color: black; display: block;">
                        <img src="assets/img/login_out.png" 
                             style="width: 20px; height: 20px; vertical-align: middle; margin-bottom:3px; margin-right: 5px;">
                        로그인
                    </a>
                </div>
            </div>
        `;

        // 'main -> new-chat-view'에 이렇게 화면을 그려준다.
        const newChatView = document.querySelector('.new-chat-view');
        newChatView.innerHTML = "<p style='margin-top:60px; text-align: center; height:20.5px; font-size:20px; font-weight:bold;'>간단하고 손쉬운 프롬프트 사용으로<br>손쉽게 <span style='color: #454997;'>경쟁력</span>을 키워보세요</p>";

        // 'main -> conversation-view'에는 이렇게 화면을 그려준다.
        const conversationView = document.querySelector('.view.conversation-view');
        conversationView.style.overflow = 'scroll';
        conversationView.style.display = 'flex';  // display 'flex'
        conversationView.style.alignItems = 'center'; // 모든 자식 요소를 가로축 중앙에 정렬

        // 질문과 대답 데이터 5쌍
        const questionsAndAnswers = [
            {
                question: "KT 인터넷에 대한 사용자들의 평가는 어떤지 알려줘!",
                answer: '전반적으로 KT 인터넷에 대한 의견은 긍정적인 경향을 보입니다. 가격, 서비스 품질, 평가 등 다양한 측면에서 KT 인터넷이 좋다는 의견이 많이 나타났습니다. 그러나 일부 지역에 따라 3통신사 인터넷의 차이가 있을 수 있다는 의견도 있습니다. 따라서 전체적으로 KT 인터넷이 양호하다고 평가되지만, 개별적인 지역에 따라 상이할 수 있다는 점을 고려해야 합니다.',
            },
            {
                question: "카페달에 대한 긍정적 댓글은 무엇이 있을까?",
                answer: '또한, 댓글들은 카페의 아늑한 분위기와 포근함을 강조하고 있으며, 카이막과 커피의 맛을 함께 즐기는 것을 추천하고 있습니다. 이러한 긍정적인 평가와 추천은 해당 카페가 고객들에게 만족스러운 경험을 제공하고 있음을 시사합니다. 따라서, 해당 카페는 카이막과 커피의 맛으로 인해 사람들에게 인기가 있고, 아늑한 분위기와 좋은 서비스로 인해 계속해서 방문하고자 하는 고객들의 관심을 얻고 있을 것으로 예상됩니다.',
            },
            {
                question: "kt인터넷에서 기술지원부족에 대한 이야기를 어떤 리뷰를 하고 있는 리뷰를 모두 보여줘",
                answer: 'kt인터넷에서 기술지원부족에 대한 이야기를 다음과 같은 리뷰들이 있습니다: 1. 내용: 인터넷은 kt인듯, 날짜: 2023-10-02 18:29 2. 내용: 인터넷 문제 맞았네 나도 kt 쓰는데 kt가 문제가 많은건가..?, 날짜: 2023-08-12 22:05 3. 내용: Kt인터넷문제..?, 날짜: 2023-08-06 04:30 4. 내용: 요즘 kt 인터넷이 문제 많다는 소리 때문에 상대적 올려치기인듯, 날짜: 2023-11-08 13:00 이 리뷰들은 kt인터넷의 기술지원이 부족하다는 내용을 언급하고 있습니다.',
            },
            {
                question: "kt인터넷에 가지고 있는 불만중 가격 문제에 대한 불평을 자세하게 확인한 후 알려줘.",
                answer: '제가 확인한 내용을 바탕으로 말씀드리면, 주어진 내용들 중에서 kt인터넷의 가격에 대한 불만을 자세히 확인할 수 있는 내용은 지금 KT 인터넷이랑 결합돼있어서 요금제를 알뜰로 못가는게 ㄹㅇ ㅠㅠㅠㅠ라는 내용입니다. 이 사용자는 KT 인터넷과 결합되어 있어서 다른 요금제를 선택할 수 없다는 점에 대해 실망을 표현하고 있습니다. 하지만 다른 내용들은 KT 인터넷의 가격에 대한 직접적인 언급을 포함하고 있지 않으므로, 더 자세한 내용을 확인하기 어렵습니다.',
            },
            {
                question: "카페달에 대한 좋은 댓글 대표적으로 3개만 알려줘라",
                answer: '카페달은 아늑하고 포근한 분위기로 손님들을 맞이하고 있습니다. 커피와 카이막이 맛있는 것으로 알려져 있으며, 카이막과 함께 먹으면 천국이라고 합니다. 방문자들은 카페의 분위기와 맛에 매우 만족하며, 다시 방문하고 싶다는 긍정적인 반응을 보여주고 있습니다. 가격도 합리적이며, 서비스도 친절하다는 평가를 받고 있습니다. 따라서 카페달은 아늑하고 맛있는 카이막과 함께 편안한 분위기에서 휴식을 즐기기에 좋은 선택지로 손님들에게 추천되고 있습니다.',
            },
        ];

        // 질문과 대답 데이터 5쌍을 이용하여 질문 div와 대답 div를 생성한다.
        for(let i = 0; i < questionsAndAnswers.length; i++){
            // 질문 div 생성
            const questionDiv = document.createElement('div');
            questionDiv.style.width = '80%'; // 질문 div width
            questionDiv.style.backgroundColor = '#F7F6FF'; // 질문 배경색
            questionDiv.style.color = '#515563'; // 질문 텍스트 색
            questionDiv.style.padding = '10px';   
            questionDiv.style.margin = '10px 0 0 0'; // 위쪽 마진
            questionDiv.style.borderRadius = '8px'; // 모서리 외곽선 둥글게
            questionDiv.style.display = 'flex'; // flexbox 사용
            questionDiv.style.flexDirection = 'column'; // 아이콘과 텍스트를 위아래로 정렬
            questionDiv.style.alignItems = 'flex-start'; // 텍스트를 왼쪽 정렬

            // '사람' 아이콘 추가
            const userIcon = document.createElement('i');
            userIcon.className = 'material-icons'; // Material Icons 클래스
            userIcon.textContent = 'person'; // 사용자 아이콘
            userIcon.style.color = 'black'; // 아이콘 색상을 검정색으로 설정
            userIcon.style.marginBottom = '10px'; // 아이콘과 텍스트 간격 조절
            userIcon.style.cursor = 'default'; // 마우스 커서를 기본으로 설정

            questionDiv.appendChild(userIcon); // 아이콘을 div에 추가

            // 질문 텍스트 추가
            const questionText = document.createElement('span');
            questionText.innerHTML = '<br>' + questionsAndAnswers[i].question;
            questionText.style.padding = '10px';   // 패딩 추가
            questionDiv.appendChild(questionText); // 질문 텍스트를 div에 추가

            // 대답 div 생성
            const answerDiv = document.createElement('div');
            answerDiv.style.width = '80%'; // 대답 영역 width
            answerDiv.style.backgroundColor = '#F2F7FF'; // 대답 배경색
            answerDiv.style.color = 'black'; // 대답 텍스트 색
            answerDiv.style.padding = '10px';
            answerDiv.style.margin = '10px 0 40px 0'; // 위쪽 마진 및 하단 마진 증가
            answerDiv.style.borderRadius = '8px'; // 모서리 외곽선 둥글게
            answerDiv.style.display = 'flex'; // flexbox 사용
            answerDiv.style.flexDirection = 'column'; // 아이콘과 텍스트를 위아래로 정렬
            answerDiv.style.alignItems = 'flex-start'; // 텍스트를 왼쪽 정렬

            // 이미지 추가 (ENTER 이미지를 사용하려면 이미지 경로를 수정해야 함)
            const enterImage = document.createElement('img');
            enterImage.src = 'assets/img/ENTR_logo.png'; // ENTER 이미지 파일 경로
            enterImage.style.height = '24px'; // 이미지 높이 조절

            // 대답 텍스트 추가
            const answerText = document.createElement('span');
            answerText.innerHTML = '<br>' + questionsAndAnswers[i].answer;
            answerText.style.padding = '10px'; // 패딩 추가
            answerText.style.marginTop = '10px'; // 텍스트 위쪽 마진 추가
            answerText.style.whiteSpace = 'pre-wrap';  // 대답 줄 바꿈

            // 'edit Icon'을 배치한 div 생성
            const editIconDiv = document.createElement('div');
            editIconDiv.style.marginTop = '10px'; // edit 아이콘 위쪽 마진 추가
            editIconDiv.style.marginLeft = 'auto'; // 오른쪽 정렬

            // 'edit Icon' 추가
            const span = document.createElement('span');
            
            // 이미지 태그 생성
            const img = document.createElement('img');
            img.src = 'assets/img/memo_icon.png'; // 이미지의 URL을 설정하세요.
            img.alt = '메모 아이콘'; // 이미지에 대한 대체 텍스트를 설정하세요.
            img.width = 22; // 너비를 22px로 설정
            img.height = 22; // 높이를 22px로 설정                       
                            
            span.appendChild(img); // span 요소에 이미지를 추가합니다.
            span.style.cursor = 'default'; // 마우스 커서를 기본으로 설정

            // 대답(A) 하단 오른쪽 '연필 아이콘' 클릭 이벤트
            span.onclick = function() {
                // 보기 용도이므로 굳이 이벤트가 발생할 필요가 없다.
            };

            editIconDiv.appendChild(span); // 아이콘을 div에 추가

            answerDiv.appendChild(enterImage); // 이미지를 div에 추가
            answerDiv.appendChild(answerText); // 대답 텍스트를 div에 추가
            answerDiv.appendChild(editIconDiv); // edit 아이콘을 div에 추가

            // 질문, 아이콘 및 대답 div를 conversation view에 추가
            conversationView.appendChild(questionDiv);
            conversationView.appendChild(answerDiv);
        }
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
        user_id=response.data['data']['user_id'];   // 아이디를 가져온다.
        document.querySelector('.header-myinfo-link h3').textContent = `${response.data.data.user_name}님 안녕하세요`; // h3 태그에 보여준다.
    })
    .catch(error => {
        console.log(error);
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
function getChatRoomList(){
    const getChatList_URL=`http://localhost:8000/main/`;

    axios({
        method: 'get',
        url: getChatList_URL,
        headers: { 
            'Authorization':  JSON.stringify({'Authorization': `Bearer ${token}`})
        }
    })
    .then(response => {
        console.log('채팅방 불러오기 성공:', response.data); // 로그에 응답 데이터를 찍습니다.

        const conversationsElement = document.querySelector('.conversations'); // HTML에서 채팅방 목록을 담는 ul 요소 선택
        conversationsElement.innerHTML = ''; // 기존 목록 클리어

        const chatRoomList = response.data['data']['chat_list']; // 백엔드에서 받은 채팅방 목록

        // '크롤러 설정' 섹션 요소를 찾고 chatRoomList 데이터를 저장합니다. 다 쓰일 떄가 있으니까 마련한 것이여 ~ 
        const crawlerSettingSection = document.querySelector(".sidebar-area .section:first-child");
        crawlerSettingSection.dataset.chatroomlist = JSON.stringify(chatRoomList); // JSON 문자열로 변환하여 저장
        
        // main 부분에 중앙에 '원하는 주제로 채팅을 시작하세요' imgage를 보여준다.
        var conversationView = document.querySelector('.view.conversation-view');

        // 중앙 정렬을 위한 컨테이너 div 생성
        var containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex'; // Flexbox 레이아웃 사용
        containerDiv.style.justifyContent = 'center'; // 수평 중앙 정렬
        containerDiv.style.alignItems = 'center'; // 수직 중앙 정렬
        containerDiv.style.height = '100%'; // 컨테이너의 높이 설정

        // 새로운 img 요소를 생성
        var img = document.createElement('img');
        img.src = 'assets/img/chatting.png'; // 여기에 이미지의 URL을 입력하세요
        img.alt = '설명'; // 대체 텍스트를 제공합니다
        img.style.width='400px';  // width를 정한다.
        img.style.display = 'block'; // 블록 레벨 요소로 설정
        img.style.margin = 'auto'; // 가로 방향으로 자동 마진 적용

        // 컨테이너 div에 img 요소 추가
        containerDiv.appendChild(img);

        // 대상 div에 컨테이너 div 추가
        conversationView.appendChild(containerDiv);

       // 채팅방이 없을 떄 
       if(chatRoomList.length==0){
            // 채팅방 목록이 비어 있을 때
            const li = document.createElement('li');
            li.textContent = '채팅방이 없습니다';
            li.style.padding='30px';
            li.style.textAlign = 'center';
            li.style.marginTop = '125px'; // 위치를 아래로 조정
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

            // 삼자 아이콘('|') 아이콘 클릭 시 이벤트 리스너 추가
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
    // 모든 버튼에서 'active' 클래스 제거 
    const buttons = document.querySelectorAll('.conversation-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // 클릭된 버튼에 'active' 클래스 추가 -> 이 채팅방일 수 있음을 알게끔, 다른 색깔로 화면에 표시한다.
    const activeButton = document.getElementById(chatRoom.target_object);
    if (activeButton) {
        activeButton.classList.add('active');
    }

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

// 채팅방에 대한 질문과 대답에 대한 히스토리를 보여주는 함수 (제 2안)
function displayChatQaHistory(QaDatas, chatRoom) {
    const conversationView = document.querySelector('.view.conversation-view');
    
    conversationView.style.display = 'flex';  // display 'flex'
    conversationView.style.alignItems = 'center'; // 모든 자식 요소를 가로축 중앙에 정렬
    conversationView.innerHTML = ''; // 기존에 채팅 이력을 삭제한다.

    if(QaDatas.length==0){
        alert('채팅 히스토리 데이터가 없습니다.');

        // main 부분에 중앙에 '원하는 주제로 채팅을 시작하세요' image를 보여준다.
        
        // 중앙 정렬을 위한 컨테이너 div 생성
        var containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex'; // Flexbox 레이아웃 사용
        containerDiv.style.justifyContent = 'center'; // 수평 중앙 정렬
        containerDiv.style.alignItems = 'center'; // 수직 중앙 정렬
        containerDiv.style.height = '100%'; // 컨테이너의 높이 설정

        // 새로운 img 요소를 생성
        var img = document.createElement('img');
        img.src = 'assets/img/chatting.png'; // 여기에 이미지의 URL을 입력하세요
        img.alt = '원하는 주제로 채팅을 시작하세요'; // 대체 텍스트를 제공합니다
        img.style.width='400px';  // width를 정한다.
        img.style.display = 'block'; // 블록 레벨 요소로 설정
        img.style.margin = 'auto'; // 가로 방향으로 자동 마진 적용

        // 컨테이너 div에 img 요소 추가
        containerDiv.appendChild(img);

        // 대상 div에 컨테이너 div 추가
        conversationView.appendChild(containerDiv);
    }

    // 채팅 이력을 그려서 화면에 보여준다.
    QaDatas.forEach(QaData => { 
        // 질문 div 생성
        const questionDiv = document.createElement('div');
        questionDiv.style.width = '80%'; // 질문 div width
        questionDiv.style.backgroundColor = '#F7F6FF'; // 질문 배경색
        questionDiv.style.color = '#515563'; // 질문 텍스트 색
        questionDiv.style.padding = '10px';   
        questionDiv.style.margin = '0'; // 위쪽 마진
        questionDiv.style.borderRadius = '8px'; // 모서리 외곽선 둥글게
        questionDiv.style.display = 'flex'; // flexbox 사용
        questionDiv.style.flexDirection = 'column'; // 아이콘과 텍스트를 위아래로 정렬
        questionDiv.style.alignItems = 'flex-start'; // 텍스트를 왼쪽 정렬

        // '사람' 아이콘 추가
        const userIcon = document.createElement('i');
        userIcon.className = 'material-icons'; // Material Icons 클래스
        userIcon.textContent = 'person'; // 사용자 아이콘
        userIcon.style.color = 'black'; // 아이콘 색상을 검정색으로 설정
        userIcon.style.marginBottom = '10px'; // 아이콘과 텍스트 간격 조절
        userIcon.style.cursor = 'default'; // 마우스 커서를 기본으로 설정

        questionDiv.appendChild(userIcon); // 아이콘을 div에 추가

        // 질문 텍스트 추가
        const questionText = document.createElement('span');
        questionText.innerHTML = '<br>' + QaData.question;
        questionText.style.padding = '10px';   // 패딩 추가
        questionDiv.appendChild(questionText); // 질문 텍스트를 div에 추가

        // 대답 div 생성
        const answerDiv = document.createElement('div');
        answerDiv.style.width = '80%'; // 대답 영역 width
        answerDiv.style.backgroundColor = '#F2F7FF'; // 대답 배경색
        answerDiv.style.color = 'black'; // 대답 텍스트 색
        answerDiv.style.padding = '10px';
        answerDiv.style.margin = '10px 0 40px 0'; // 위쪽 마진 및 하단 마진 증가
        answerDiv.style.borderRadius = '8px'; // 모서리 외곽선 둥글게
        answerDiv.style.display = 'flex'; // flexbox 사용
        answerDiv.style.flexDirection = 'column'; // 아이콘과 텍스트를 위아래로 정렬
        answerDiv.style.alignItems = 'flex-start'; // 텍스트를 왼쪽 정렬

        // 이미지 추가 (ENTER 이미지를 사용하려면 이미지 경로를 수정해야 함)
        const enterImage = document.createElement('img');
        enterImage.src = 'assets/img/ENTR_logo.png'; // ENTER 이미지 파일 경로
        enterImage.style.height = '24px'; // 이미지 높이 조절

        // 대답 텍스트 추가
        const answerText = document.createElement('span');
        answerText.innerHTML = '<br>' + QaData.answer;
        answerText.style.padding = '10px'; // 패딩 추가
        answerText.style.marginTop = '10px'; // 텍스트 위쪽 마진 추가
        answerText.style.whiteSpace = 'pre-wrap';  // 대답 줄 바꿈

        // 'edit Icon'을 배치한 div 생성
        const editIconDiv = document.createElement('div');
        editIconDiv.style.marginTop = '10px'; // edit 아이콘 위쪽 마진 추가
        editIconDiv.style.marginLeft = 'auto'; // 오른쪽 정렬

        // 'edit Icon' 추가
        const span = document.createElement('span');
        
        // 이미지 태그 생성
        const img = document.createElement('img');
        img.src = 'assets/img/memo_icon.png'; // 이미지의 URL을 설정하세요.
        img.alt = '메모 아이콘'; // 이미지에 대한 대체 텍스트를 설정하세요.
        img.width = 22; // 너비를 22px로 설정
        img.height = 22; // 높이를 22px로 설정                       
                        
        span.appendChild(img); // span 요소에 이미지를 추가합니다.
        span.style.cursor = 'pointer'; // 마우스 오버 시 포인터 모양 변경

        // 대답(A) 하단 오른쪽 '연필 아이콘' 클릭 이벤트
        span.onclick = function() {
            checkMemo(QaData.history_id); // 메모를 확인한다.
        };

        editIconDiv.appendChild(span); // 아이콘을 div에 추가

        answerDiv.appendChild(enterImage); // 이미지를 div에 추가
        answerDiv.appendChild(answerText); // 대답 텍스트를 div에 추가
        answerDiv.appendChild(editIconDiv); // edit 아이콘을 div에 추가

        // 질문, 아이콘 및 대답 div를 conversation view에 추가
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
        // 입력한 값이 빈값인지 확인한다.
        if(document.getElementById('message').value===''){
            document.getElementById('message').value='';  // 그래도 혹시 모르니 빈 값으로 설정 
            document.getElementById('message').placeholder = '질문을 입력하고 ENTER만 치세요!'; // placeholder로 보여준다.
            alert('빈 값 입니다.');
        }
        else{
            console.log('클릭');
            sendQuestion(chatRoom, QaDatas);   // 질문과 대답을 추가한다.
        }
    };

    // 하단 입력창에 엔터 클릭했을 때 리스너
    messageForm.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            // e.preventDefault(); // 폼의 기본 제출 이벤트 방지
            const messageInput = document.getElementById('message');
            
            if (messageInput.value.trim() === '') {
                // 입력 필드를 빈 문자열로 설정하고 placeholder 추가
                alert('빈 값 입니다.');
                messageInput.value = '';
                messageInput.placeholder = '질문을 입력하고 ENTER만 치세요!';
                window.location.reload(); // 새로고침
            } 
            else {
                // 입력 필드에 값이 있으면 질문과 대답을 처리
                sendQuestion(chatRoom, QaDatas);
            }
        }
    });

}

// 새로운 메시지를 전송하는 함수
function sendQuestion(chatRoom, QaDatas) {
    // 입력창에 적은 text를 가져온다.
    var textareaElement = document.getElementById('message');  
    var question = textareaElement.value;

    // 하단 입력창에 대한 값을 빈값으로 대치한다.
    textareaElement.value='';

    // 기존에 채팅 이력이 없었다면 "원하는 주제로 채팅을 시작하세요" image 보여줬던 것을 지운다.(Erase)
    if(QaDatas.length==0){
        const conversationView = document.querySelector('.view.conversation-view');
    
        conversationView.style.display = 'flex';  // display 'flex'
        conversationView.style.alignItems = 'center'; // 모든 자식 요소를 가로축 중앙에 정렬
        conversationView.innerHTML = ''; // 기존에 채팅 이력을 삭제한다.
    }

    // 질문을 화면에 추가
    addQA(question,
          '#F7F6FF',
           false); // 질문 추가

    // 대답을 위한 빈 div 추가
    addQA('ENTER',
          '#F2F7FF',
           true);

    // 대답을 실시간으로 보여주는 함수
    generateAnswerLive(question, chatRoom);

    // 대답을 실시간으로 보여줄 떄는 사용자가 클릭 할 수 없게 '전송'하기 버튼을 비활성화 한다.
    const sendButton = document.querySelector('.send-button');
    sendButton.style.display = 'none'; // 버튼 표시
}

// 대화(Q, A)에 메시지를 추가하는 함수
function addQA(message, bgColor, isAnswer) {
    const conversationView = document.querySelector('.view.conversation-view');
    const messageDiv = document.createElement('div');

    messageDiv.style.backgroundColor = bgColor;
    messageDiv.style.width='80%';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.padding = '10px';
    messageDiv.style.display = 'flex'; // Flexbox 적용
    messageDiv.style.flexDirection = 'column'; // 아이템을 수직으로 정렬
    messageDiv.style.alignItems = 'flex-start'; // 텍스트를 왼쪽 정렬

    // 대답인 경우
    if (isAnswer) {
        messageDiv.style.color = 'black';          // 텍스트 색깔 
        messageDiv.style.margin = '10px 0 40px 0'; // 위쪽 마진 및 하단 마진 증가

        // 이미지 추가 (경로 수정 필요)
        const enterImage = document.createElement('img');
        enterImage.src = 'assets/img/ENTR_logo.png';
        enterImage.style.height = '24px';

        // 대답 텍스트 추가
        const answerText = document.createElement('span');
        answerText.id = 'answer-text'; // ID 설정
        answerText.innerHTML = '<br>'; // 대답 텍스트 직접 지정
        answerText.style.padding = '10px'; // 패딩 추가
        answerText.style.display = 'block'; // 블록 레벨 요소로 만들기
        answerText.style.marginTop = '10px'; // 상단 여백 추가
        answerText.style.whiteSpace = 'pre-wrap'; // 대답 텍스트 줄바꿈

        messageDiv.appendChild(enterImage);
        messageDiv.appendChild(answerText);
    } 
    // 질문인 경우
    else {
        messageDiv.style.color = '#515563';     // 텍스트 색깔
        messageDiv.style.margin = '10px 0 0 0'; // 위쪽 마진만 적용

        // '사람' 아이콘 추가
        const userIcon = document.createElement('i');
        userIcon.className = 'material-icons';
        userIcon.textContent = 'person';
        userIcon.style.color = 'black'; // 아이콘 색상을 검정색으로 설정
        userIcon.style.marginBottom = '10px';

        messageDiv.appendChild(userIcon);

        // 질문 텍스트 추가
        const questionText = document.createElement('span');
        questionText.innerHTML = '<br>' + message;
        questionText.style.padding = '10px'; // 패딩 추가
        messageDiv.appendChild(questionText);
    }

    // 질문과 대답에 대한 마진 적용
    messageDiv.style.marginBottom = isAnswer ? '40px' : '0';

    conversationView.appendChild(messageDiv);
    // return messageDiv; // 추가된 div 반환
}

// 대답(A)을 실시간으로 보여주는 함수
const generateAnswerLive = (question, chatRoom) => {
    const answerLiveResponse_URL = `http://127.0.0.1:8002/answer/${user_id}/${chatRoom.target_object}/True`;  
    // const messageElement = emptyAnswerDiv
    const conversationView = document.querySelector('.view.conversation-view');

    // AI에서 구현한 '대답을 실시간으로 보내주는 기능'을 받아와서 실시간으로 화면에 표시한다.
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

            // ID를 사용하여 해당 answerText 요소 선택하여 일일히 텍스트를 더한다.
            const answerTextElement = document.getElementById('answer-text');
            answerTextElement.innerHTML += parseData;
  
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

            // 1초 (1000 밀리초) 후에 실행할 코드 또는 함수
            setTimeout(function() {
                 // 채팅 이력을 다시 불러온다.
                 getChatQaHistory(chatRoom);
            }, 1000); 
           
        })
        .catch((e) => {
            console.log('error');
            console.log(e);
            
            // 하단 입력창에 대한 '전송' 버튼을 활성화 한다.
            const sendButton = document.querySelector('.send-button');
            sendButton.style.display = 'block'; // 버튼 표시

            // 1초 (1000 밀리초) 후에 실행할 코드 또는 함수
            setTimeout(function() {
                // 채팅 이력을 다시 불러온다.
                getChatQaHistory(chatRoom);
            }, 1000);

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
        
        // 메모가 있으면 사용자가 입력했었던 메모를 보여주고 수정하기 삭제하기 버튼을 클릭할 수 있도록 한다.
        if(response.data.data.is_memo===true){
            showMemo(history_id,
                          true,
                          response.data.data.memo.memo_content);
        }
        // 메모가 없으면 빈 메모를 보여주고 저장하기 버튼을 클릭할 수 있도록 한다.
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
function showMemo(history_id, flag, txt = '') {
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
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
    memoInput.style.border = '1px solid #000000'; 
    memoInput.style.fontFamily='scd'; // 글꼴 설정
    memoInput.style.resize = 'none';


    // 버튼 컨테이너 생성 및 스타일 설정
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';

    // '나가기' 버튼 생성 및 추가
    const exitButton = document.createElement('button');
    exitButton.textContent = '나가기';
    exitButton.style.marginLeft = '10px';
    exitButton.style.fontFamily='scd'; // 글꼴 설정
    exitButton.onclick = function() {
        document.body.removeChild(popupContainer);
        document.body.removeChild(overlay);
    };

    // 메모가 있을 경우
    if (flag) {
        memoInput.value = txt; // 기존 메모 내용

        // 수정하기 버튼 생성 및 추가
        const editButton = document.createElement('button');
        editButton.textContent = '수정';
        editButton.style.marginLeft = '10px';
        editButton.style.fontFamily='scd'; // 글꼴 설정
        editButton.onclick = function() {
            const updatedMemo = memoInput.value;
            updateMemo(history_id, updatedMemo);
        };

        // 삭제하기 버튼 생성 및 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.fontFamily='scd'; // 글꼴 설정
        deleteButton.onclick = function() {
            deleteMemo(history_id);
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(exitButton); // 나가기 버튼 추가
    }
    // 메모가 없을 경우
    else {
        // 저장하기 버튼 생성 및 추가
        const saveButton = document.createElement('button');
        saveButton.textContent = '저장';
        saveButton.style.fontFamily='scd'; // 글꼴 설정
        saveButton.onclick = function() {
            const memoContent = memoInput.value;
            if (memoContent === '') {
                alert('메모 내용을 입력해야 합니다.');
            } else {
                saveMemo(history_id, memoContent);
            }
        };

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(exitButton); // 나가기 버튼 추가
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
        if (event.target === overlay) {
            document.body.removeChild(popupContainer);
            document.body.removeChild(overlay);
        }
    };
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

    if(memoContent==''){  // 메모 내용이 빈값인 경우
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
function AIconfig() {
    var modal = document.getElementById("myModal");  // 모달창 
    var isModalOpen = modal.style.display === "block";

    // modal.style.display==='block'일 떄 (즉 Model 화면을 나가려고 할 떄 )
    if (isModalOpen) {     
        modal.style.display="none";

        removeBlurFromElements();
    } 
    // modal.style.display==='none'일 떄  (즉 Model 화면으로 들어왔을 떄 )
    else {                
        modal.style.display = "block";

        document.querySelector(".popup1-content").style.display='none';
        document.querySelector(".popup2-content").style.display='none';
        document.querySelector(".popup3-content").style.display='none';
        document.querySelector(".popup4-content").style.display='none';
        document.querySelector(".popup5-content").style.display='none';
        
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
function handleCrawlerClick() {
    // '크롤러 설정' 섹션에서 data-chatroomlist 속성을 가져옵니다. 다 쓰일떄가 있으니까 가져온거여 ~ 
    const crawlerSettingSection = document.querySelector(".sidebar-area .section:first-child");
    const chatRoomList = JSON.parse(crawlerSettingSection.dataset.chatroomlist); // JSON 문자열을 객체로 변환

    console.log('chatRoomList : ', chatRoomList);

    var popup2_content = document.querySelector(".popup2-content");
    popup2_content.style.display = 'none'; // '프롬프트 설정' 콘텐츠는 display None

    var popup3_content = document.querySelector(".popup3-content");
    popup3_content.style.display = 'none'; // '리포트 설정' 콘텐츠는 display None

    var popup4_content = document.querySelector(".popup4-content");
    popup4_content.style.display = 'none';    // '자주 쓰는 문구' 콘텐츠는 display None

    var popup5_content = document.querySelector(".popup5-content");
    popup5_content.style.display = 'none';    // '모델 설정' 콘텐츠는 display None

    var popup1_content = document.querySelector(".popup1-content");
    popup1_content.innerHTML = '';
    popup1_content.style.display = 'flex';
    popup1_content.style.flexDirection = 'column';
    popup1_content.style.justifyContent = 'center';
    popup1_content.style.alignItems = 'center';


    // 버튼 스타일
    var buttonStyle = 'background-color: #000000; color: #FFFFFF; margin: 10px; padding: 10px 20px; border: none; cursor: pointer; width: 160px; height: 50px; text-align:center;  font-family: scd';

    // '대상 설정' 버튼 생성 및 스타일링
    var targetSettingButton = document.createElement('button');
    targetSettingButton.textContent = '대상 설정';
    targetSettingButton.style.cssText = buttonStyle;
    targetSettingButton.onclick = function() { 
        targetSetting(chatRoomList); // '대상 설정'에 대한 팝업을 띄운다.
    };
    popup1_content.appendChild(targetSettingButton);

    // '수집 현황' 버튼 생성 및 스타일링
    var collectionStatusButton = document.createElement('button');
    collectionStatusButton.textContent = '수집 현황';
    collectionStatusButton.style.cssText = buttonStyle;
    collectionStatusButton.onclick = function() { 
        collectStatus(chatRoomList); // '수집 현황'에 대한 팝업을 띄운다.
     };
    popup1_content.appendChild(collectionStatusButton);

    // '크롤러 템플릿 설정' 버튼 생성 및 스타일링
    var crawlerTemplateSettingButton = document.createElement('button');
    crawlerTemplateSettingButton.textContent = '크롤러 템플릿 설정';
    crawlerTemplateSettingButton.style.cssText = buttonStyle;
    crawlerTemplateSettingButton.onclick = function() {
        crawlerTemplateSetting();  // '크롤러 템플릿 설정'에 대한 팝업을 띄운다.
    };
    popup1_content.appendChild(crawlerTemplateSettingButton);
}

// 모달 창 '크롤러 설정' - '대상 설정'을 click 했을 떄 호출되는 함수
function targetSetting(chatRoomList) {
    // 팝업 div 생성
    var popup = document.createElement('div');
    popup.style.width = '400px';
    popup.style.height = '300px';
    popup.style.backgroundColor = 'white';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.border = '1px solid black';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = 1000;
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.justifyContent = 'space-around';
    // popup.style.alignItems = 'center';

    // '수집 대상' 텍스트
    var collectionTargetText = document.createElement('h3');
    collectionTargetText.textContent = '수집 대상';
    popup.appendChild(collectionTargetText);

    // 동적으로 생성한 드롭다운 메뉴
    var dropdown = document.createElement('select');
    dropdown.style.width = '80%';
    dropdown.style.height = '25px';
    dropdown.style.border = '1px solid #000000';
    dropdown.style.fontFamily = 'scd'; // font-family 스타일 추가


    // chatRoomList 길이가 0이면?
    if (chatRoomList.length === 0) {
        alert("채팅방을 만들어야 수집할 수 있습니다.");
        return; 
    }

    // chatRoomList를 이용하여 드롭다운 옵션을 동적으로 생성
    chatRoomList.forEach(chatRoom => {
        var option = document.createElement('option');
        option.value = chatRoom.target_object;                                // 채팅방의 고유 ID
        option.textContent = chatRoom.target_object + ' | ' + chatRoom.title; // 드롭다운에 이렇게 표시한다.
        dropdown.appendChild(option);
    });

    popup.appendChild(dropdown);

    // 버튼 컨테이너
    var buttonContainer = document.createElement('div');
    buttonContainer.style.width = '100%';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end'; // 오른쪽 정렬
    buttonContainer.style.alignItems = 'flex-end'; // 하단 정렬
    

    // '수집시작' 버튼
    var startButton = document.createElement('button');
    startButton.textContent = '수집시작';
    startButton.style.marginRight = '10px'; // '나가기' 버튼과 간격
    startButton.style.fontFamily='scd';  // 글꼴 설정
    startButton.onclick = function() {
        // 1. 첫 번쨰 드롭다운 메뉴에 있는 관련된 정보들이 콘솔에 정상적으로 찍히는지 확인한다.
        console.log('지금 선택한 드롭다운 메뉴의 target_object : ', dropdown.options[dropdown.selectedIndex].value);


        // 2. 수집 시작 버튼을 클릭했을 떄 AI 측과 연동하여 로직을 구성한다.
        // axios({
        //     method: '',
        //     url: ``,
        // })
        // .then(response => {
        //     alert('수집 시작을 합니다.');
        //     console.log('수집 완료: ', response);
        
        //     // 나가기
        //     document.body.removeChild(popup); 
        // })
        // .catch(error => {
        //     alert('오류가 발생했습니다.');
        //     console.log('에러');
        //     console.error(error); // 오류 로그
        // });
    };
    buttonContainer.appendChild(startButton);

    // '나가기' 버튼
    var exitButton = document.createElement('button');
    exitButton.textContent = '나가기';
    exitButton.style.fontFamily='scd';  // 글꼴 설정
    exitButton.onclick = function() {
        document.body.removeChild(popup);
    };
    buttonContainer.appendChild(exitButton);

    // 버튼 컨테이너를 팝업에 추가
    popup.appendChild(buttonContainer);

    // 팝업을 body에 추가
    document.body.appendChild(popup);
}

// 모달 창 '크롤러 설정' - '수집 현황'을 click 했을 떄 호출되는 함수
function collectStatus(chatRoomList) {
    var popup = document.createElement('div');
    popup.style.width = '400px';
    popup.style.height = 'auto'; // 높이 자동 조절
    popup.style.backgroundColor = 'white';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.border = '1px solid black';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = 1000;
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.justifyContent = 'space-around';


    // 첫 번째 드롭다운 설정
    var firstDropdownText = document.createElement('h4');
    firstDropdownText.textContent = '수집된 대상 설정';
    popup.appendChild(firstDropdownText);

    var firstDropdown = document.createElement('select');
    firstDropdown.style.width = '80%';
    firstDropdown.style.height = '25px';
    firstDropdown.style.border = '1px solid #000000';
    firstDropdown.style.fontFamily='scd';  // 글꼴 설정
    
    if (chatRoomList.length === 0) { // 채팅방이 없으면 수집하는 alert 문구를 띄우고 더이상 진행하지 못하게 한다.
        alert("채팅방을 만들어야 수집할 수 있습니다.");
        return;
    }

    chatRoomList.forEach(chatRoom => {  // 드롭다운 메뉴마다 채팅방의 target_object와 title을 저장했다.
        var option = document.createElement('option');
        option.value = chatRoom.target_object;
        option.title = chatRoom.title;
        option.textContent = chatRoom.target_object + ' | ' + chatRoom.title;
        firstDropdown.appendChild(option);
    });

    popup.appendChild(firstDropdown);



    // 두 번째 드롭다운 설정
    var secondDropdownText = document.createElement('h4');
    secondDropdownText.textContent = '데이터 선택';
    popup.appendChild(secondDropdownText);

    var secondDropdown = document.createElement('select');
    secondDropdown.style.width = '80%';
    secondDropdown.style.border = '1px solid #000000';
    secondDropdown.style.fontFamily='scd';  // 글꼴 설정
    
    popup.appendChild(secondDropdown);


    // 처음에 첫 번쨰 드롭다운 텍스트에 따라 두 번쨰 드롭다운도 자동적으로 불러올 수 있게끔 함수 호출
    updateSecondDropdown(firstDropdown.options[firstDropdown.selectedIndex].value,
                         firstDropdown.options[firstDropdown.selectedIndex].title,
                         secondDropdown);

    // 첫 번째 드롭다운의 선택 변경 이벤트 처리 (즉 Listener로 생각하면 된다.)
    firstDropdown.onchange = function() {
        var selectedOption = firstDropdown.options[firstDropdown.selectedIndex]; // 현재 선택된 옵션
        console.log('target_object: ', selectedOption.value); // 선택된 옵션의 값
        console.log('title : ', selectedOption.title); // 선택된 옵션의 title 속성

        updateSecondDropdown(selectedOption.value,    // 첫 번쨰 드롭다운 텍스트에 따라 두 번쨰 드롭다운도 자동적으로 불러올 수 있게 함수 호출 
                             selectedOption.title, 
                             secondDropdown);
    };


    // '조회 결과' 표시 영역 
    var resultTitle = document.createElement('h4');
    resultTitle.textContent = '조회 결과';
    resultTitle.style.display = 'none';
    resultTitle.style.marginTop = '20px';
    resultTitle.style.fontFamily='scd';  // 글꼴 설정
    popup.appendChild(resultTitle);

    var resultContainer = document.createElement('div');
    resultContainer.style.display = 'none';
    resultContainer.style.marginTop = '5px';
    resultContainer.style.border = '1px solid #000000';
    resultContainer.style.padding = '10px';
    resultContainer.style.wordWrap = 'break-word'; // 긴 텍스트가 넘칠 때 자동으로 줄바꿈
    resultContainer.style.fontFamily='scd';  // 글꼴 설정
    popup.appendChild(resultContainer);



    // '조회' 버튼과 '나가기' 버튼을 담는 컨테이너 설정
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.style.width = '100%';
    buttonContainer.style.marginTop = '20px';

    // '조회' 버튼
    var queryButton = document.createElement('button');
    queryButton.textContent = '조회';
    queryButton.style.background = '#FFFFFF';
    queryButton.style.color = '#000000';
    queryButton.style.padding = '10px 20px';
    queryButton.style.border = '1px solid black';
    queryButton.style.cursor = 'pointer';
    queryButton.style.fontFamily='scd';  // 글꼴 설정
    queryButton.onmouseover = function() {
        this.style.backgroundColor = '#454997'; // 호버 시 배경 색상 변경
        this.style.color = '#FFFFFF'; // 호버 시 텍스트 색상 변경
    };
    queryButton.onmouseout = function() {
        this.style.backgroundColor = '#FFFFFF'; // 마우스 아웃 시 원래 배경 색상으로 변경
        this.style.color = '#000000'; // 마우스 아웃 시 원래 텍스트 색상으로 변경
    };
    queryButton.onclick = function() {  // '조회' 버튼을 click 했을 떄 

        // 1. '조회' 버튼을 클릭했을 떄  첫 번쨰 드롭다운 메뉴와 두 번쨰 드롭다운 메뉴와 관련된
        //                              필요한 정보들이 잘 넘어가는지 확인 
        console.log('1번쨰 드롭다운 target_object : ', firstDropdown.options[firstDropdown.selectedIndex].value);
        console.log('1번쨰 드롭다운 title : ', firstDropdown.options[firstDropdown.selectedIndex].title);
        console.log('2번쨰 드롭다운 target_object : ',  secondDropdown.options[secondDropdown.selectedIndex].value);
        console.log('2번쨰 드롭다운 title : ',  secondDropdown.options[secondDropdown.selectedIndex].title);


        // 2. axios로 AI측과 백엔드 연동  -> 조회 결과 데이터를 가져온다.


 
        // 3. 조회 결과 데이터를 화면에 보여준다.

            // resultTitle.style.display = 'block';
            // resultContainer.style.display = 'block';
        
            // resultContainer.textContent = '여기에 조회 결과를 표시합니다. dasdsad asdsadsadsadsadsadsdsdsadadsadsadsadsadsadsaddsadsadsdsadsadsadsasdsadasdsadsadsadsdsadsadsadsadasdsadsadsadsadsadsadsadasdsadsadsadasdsadsadsadsadsadsasadsadasdsadsadasdasdsadad';
    };
    buttonContainer.appendChild(queryButton);

    // '나가기' 버튼
    var exitButton = document.createElement('button');
    exitButton.textContent = '나가기';
    exitButton.style.background = '#FFFFFF';
    exitButton.style.color = '#000000';
    exitButton.style.padding = '10px 20px';
    exitButton.style.border = '1px solid black';
    exitButton.style.cursor = 'pointer';
    exitButton.style.marginLeft = '10px';
    exitButton.style.fontFamily='scd';  // 글꼴 설정
    exitButton.onmouseover = function() {
        this.style.backgroundColor = '#454997'; // 호버 시 배경 색상 변경
        this.style.color = '#FFFFFF'; // 호버 시 텍스트 색상 변경
    };
    exitButton.onmouseout = function() {
        this.style.backgroundColor = '#FFFFFF'; // 마우스 아웃 시 원래 배경 색상으로 변경
        this.style.color = '#000000'; // 마우스 아웃 시 원래 텍스트 색상으로 변경
    };
    exitButton.onclick = function() { // '나가기' 버튼을 click 했을 떄 
        document.body.removeChild(popup); // 나가기
    };
    buttonContainer.appendChild(exitButton);

    // 버튼 컨테이너를 팝업에 추가
    popup.appendChild(buttonContainer);

    // 팝업을 body에 추가
    document.body.appendChild(popup);
}

// 첫 번쨰 드롭다운 선택된 값에 따라 두 번쨰 드롭다운 텍스트를 보여주는 함수
function updateSecondDropdown(target_object, title, secondDropdown) {
    // 1. axios로 AI측과 연동하여 데이터를 받아온다.


    // 2. 두 번째 드롭다운의 기존 내용을 초기화
    secondDropdown.innerHTML = '';

    // 3. AI 측에 받아온 데이터를 바탕으로 두 번째 드롭다운에 옵션을 다시 생성한다.
    var option = document.createElement('option');
    option.value = target_object;
    option.title = title;
    option.textContent = title;
    secondDropdown.appendChild(option);
}

// 모달 창 '크롤러 설정' - '크롤러 템플릿 설정'을 click 했을 떄 호출되는 함수
function crawlerTemplateSetting() {
    // AI 측으로부터 크롤러 템플릿 설정 정보를 가져온다.
    const templateLoad_URL=`http://localhost:8002/load_template/${user_id}/llama/crawl`;
    axios({
        method: 'get',
        url: templateLoad_URL,
    })
    .then(response => {
        console.log('템플릿 로드 완료 :', response);

        // 보여주기 
        var popup = document.createElement('div');
        popup.style.width = '800px';
        popup.style.height = '600px';
        popup.style.backgroundColor = 'white';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.border = '1px solid black';
        popup.style.padding = '20px';
        popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = 1000;
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'space-between';

        // '회사 정보 설정' 텍스트
        var companyInfoText = document.createElement('h4');
        companyInfoText.textContent = '회사 정보 설정';
        popup.appendChild(companyInfoText);

        // 회사 정보 입력칸
        var companyInfoInput = document.createElement('textarea');
        companyInfoInput.type = 'text';
        companyInfoInput.value = response.data.company_info=='' ? response.data.company_info_default : response.data.company_info;   // response 받아와서 company_info가 빈값이면 company_info_default 값으로 대치한다. (삼항 연산자를 통해서)
        companyInfoInput.style.width = '100%';
        companyInfoInput.style.height = '120px';
        companyInfoInput.style.resize = 'none'; // 사용자가 크기를 조절하는 것을 방지
        companyInfoInput.style.fontFamily = 'scd'; // 글꼴 설정
        popup.appendChild(companyInfoInput);

        // '타켓 정보 설정' 텍스트
        var targetInfoText = document.createElement('h4');
        targetInfoText.textContent = '타켓 정보 설정';
        popup.appendChild(targetInfoText);

        // 타켓 정보 입력칸
        var targetInfoInput = document.createElement('textarea');
        targetInfoInput.type = 'text';
        targetInfoInput.value = response.data.product_info=='' ? response.data.product_info_default : response.data.product_info;   // response 받아와서 product_info가 빈값이면 product_info_default 값으로 대치한다. (삼항 연산자를 통해서)
        targetInfoInput.style.width = '100%';
        targetInfoInput.style.height = '240px';
        targetInfoInput.style.resize = 'none'; // 사용자가 크기를 조절하는 것을 방지
        targetInfoInput.style.fontFamily = 'scd'; // 글꼴 설정
        popup.appendChild(targetInfoInput);

        // 버튼 컨테이너
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.width = '100%';
        buttonContainer.style.marginTop = '10px';

        // '초기화' 버튼 
        var resetButton = document.createElement('button');
        resetButton.textContent = '초기화';
        resetButton.style.marginRight = '10px';
        resetButton.style.fontFamily='scd';  // 글꼴 설정
        resetButton.onclick = function() {
            // 입력란의 값을 기본값으로 재설정합니다.
            companyInfoInput.value = response.data.company_info_default;
            targetInfoInput.value = response.data.product_info_default;
        };
        buttonContainer.appendChild(resetButton);

        // '적용' 버튼
        var applyButton = document.createElement('button');
        applyButton.textContent = '적용';
        applyButton.style.marginRight = '10px';
        applyButton.style.fontFamily='scd';  // 글꼴 설정
        applyButton.onclick = function() {
            // AI 측에 크롤러 템플릿을 적용한다.
            const templateEdit_URL=`http://localhost:8002/edit_template/${user_id}/llama/crawl`;
            axios({
                method: 'post',
                url: templateEdit_URL,
                data : {
                    'template_config' : {
                        'company_info' : companyInfoInput.value,
                        'product_info' : targetInfoInput.value,
                    }
                }
            })
            .then(response => {
                alert('크롤러 템플릿 적용이 완료되었습니다.');
                console.log('템플릿 적용 완료 : ', response);
            
                // 나가기
                document.body.removeChild(popup); 
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); // 오류 로그
            });
        };
        buttonContainer.appendChild(applyButton);

        // '나가기' 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.fontFamily='scd';  // 글꼴 설정
        exitButton.onclick = function() {
            document.body.removeChild(popup);
        };
        buttonContainer.appendChild(exitButton);

        // 버튼 컨테이너를 팝업에 추가
        popup.appendChild(buttonContainer);

        // 팝업을 body에 추가
        document.body.appendChild(popup);   
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); // 오류 내용
    });
}

// 모달 창에서 '프롬프트 설정'을 click 했을 떄 호출되는 함수
function handlePromptClick(){
    // AI 측에서 정보를 가져온다.
    axios({
        method: 'get',
        url: `http://localhost:8002/load_template/${user_id}/chatgpt/conversation`,
    }).then(response => {
        console.log('성공 : ', response);

        var popup1_content = document.querySelector(".popup1-content");
        popup1_content.style.display = 'none'; // '크롤러 설정' 콘텐츠는 display None

        var popup3_content = document.querySelector(".popup3-content");
        popup3_content.style.display = 'none'; // '리포트 설정' 콘텐츠는 display None

        var popup4_content = document.querySelector(".popup4-content");
        popup4_content.style.display = 'none'; // '자주 쓰는 문구' 콘텐츠는 display None

        var popup5_content = document.querySelector(".popup5-content");
        popup5_content.style.display = 'none';    // '모델 설정' 콘텐츠는 display None

        var popup2_content = document.querySelector(".popup2-content");
        popup2_content.innerHTML=''; // 다시 빈 내용으로 설정한다.
        popup2_content.style.display = 'block'; // 팝업 내용을 표시합니다.

        // '프롬프트 설정' 텍스트
        var promptNameText = document.createElement('h4');
        promptNameText.textContent = '프롬프트 설정';
        promptNameText.style.marginLeft='75px';
        popup2_content.appendChild(promptNameText);

        // '프롬프트 설정' 입력 칸 
        var promptNameInput = document.createElement('textarea');
        promptNameInput.type = 'text';
        promptNameInput.value = response.data.system =='' ? response.data.system_default : response.data.system;   // response 받아와서 company_info가 빈값이면 company_info_default 값으로 대치한다. (삼항 연산자를 통해서)
        promptNameInput.style.width = '80%';
        promptNameInput.style.height = '200px';
        
        promptNameInput.style.margin = '0 auto'; // 가운데 정렬
        promptNameInput.style.display = 'block'; // 블록 레벨 요소로 만들기
        promptNameInput.style.resize='none';
        promptNameInput.style.fontFamily = 'scd'; // 글꼴 설정

        popup2_content.appendChild(promptNameInput);

        // Divider 선
        var divider = document.createElement('hr');
        divider.style.width = '110%'; // 너비 설정
        divider.style.border = '1px solid #ccc'; // 선의 스타일 설정, 예: 회색, 1px 두께
        divider.style.margin = '20px 20px'; // 위아래 마진 설정

        popup2_content.appendChild(divider);
        
        // 'condense 설정' 텍스트
        var condenseNameText = document.createElement('h4');
        condenseNameText.textContent = '출력 프롬프트 설정';
        condenseNameText.style.marginLeft='75px';
        popup2_content.appendChild(condenseNameText);

        // 'condense 설정' 입력 칸 
        var condenseNameInput = document.createElement('textarea');
        condenseNameInput.type = 'text';
        condenseNameInput.value = response.data.condense=='' ? response.data.condense_default : response.data.condense;   // response 받아와서 company_info가 빈값이면 company_info_default 값으로 대치한다. (삼항 연산자를 통해서)
        condenseNameInput.style.width = '80%';
        condenseNameInput.style.height = '200px';
        
        condenseNameInput.style.margin = '0 auto'; // 가운데 정렬
        condenseNameInput.style.display = 'block'; // 블록 레벨 요소로 만들기
        condenseNameInput.style.resize='none';
        condenseNameInput.style.fontFamily = 'scd'; // 글꼴 설정

        popup2_content.appendChild(condenseNameInput);

        // Divider 선
        var divider = document.createElement('hr');
        divider.style.width = '110%'; // 너비 설정
        divider.style.border = '1px solid #ccc'; // 선의 스타일 설정, 예: 회색, 1px 두께
        divider.style.margin = '20px 20px'; // 위아래 마진 설정

        popup2_content.appendChild(divider);

        // ###################################
        // 'Document 데이터 설정' 텍스트
        var metaDataNameText = document.createElement('h4');
        metaDataNameText.textContent = 'Document 데이터 설정';
        metaDataNameText.style.marginLeft='75px';
        popup2_content.appendChild(metaDataNameText);

        // 'Document 데이터 설정' 입력 칸
        var metaDataNameInput = document.createElement('textarea');
        metaDataNameInput.type = 'text';
        metaDataNameInput.value = response.data.document=='' ? response.data.document_default : response.data.document;   // response 받아와서 company_info가 빈값이면 company_info_default 값으로 대치한다. (삼항 연산자를 통해서)
        metaDataNameInput.style.width = '80%';
        metaDataNameInput.style.height = '200px';
        
        metaDataNameInput.style.margin = '0 auto'; // 가운데 정렬
        metaDataNameInput.style.display = 'block'; // 블록 레벨 요소로 만들기
        metaDataNameInput.style.resize='none';
        metaDataNameInput.style.fontFamily = 'scd'; // 글꼴 설정
        
        popup2_content.appendChild(metaDataNameInput);

        // 버튼 컨테이너 및 버튼들
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.marginTop = '20px';

        // '초기화' 버튼 
        var resetButton = document.createElement('button');
        resetButton.textContent = '초기화';
        resetButton.style.marginRight = '10px';
        resetButton.style.fontFamily='scd';  // 글꼴 설정
        resetButton.onclick = function() {
            // 입력란의 값을 기본값으로 재설정합니다.
            promptNameInput.value = response.data.system_default;
            condenseNameInput.value= response.data.condense_default
            metaDataNameInput.value =  response.data.document_default;           
        };
        buttonContainer.appendChild(resetButton);

        // '적용' 버튼
        var applyButton = document.createElement('button');
        applyButton.textContent = '적용';
        applyButton.style.marginRight = '10px';
        applyButton.style.fontFamily='scd';  // 글꼴 설정
        applyButton.onclick = function() {
            console.log('적용 버튼 클릭');

            // AI 측에 프롬프트 설정을 적용한다.
            axios({
                method: 'post',
                url: `http://localhost:8002/edit_template/${user_id}/chatgpt/conversation`,
                data : {
                    'template_config' : {
                        'system' : promptNameInput.value,
                        'condense': condenseNameInput.value,
                        'document' : metaDataNameInput.value,
                    }
                }
            })
            .then(response => {
                console.log('성공 : ', response);

                // 나가기 
                popup2_content.style.display = 'none';
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); // 오류 처리
            });
        };
        buttonContainer.appendChild(applyButton);

        // '나가기' 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.fontFamily='scd';  // 글꼴 설정
        exitButton.onclick = function() {
            popup2_content.style.display = 'none';
        };
        buttonContainer.appendChild(exitButton);

        // 버튼 컨테이너를 팝업에 추가
        popup2_content.appendChild(buttonContainer);

    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); // 오류 내용
    });
}

// 모달 창에서 '리포트 설정'을 click 했을 떄 호출되는 함수
function handleReportClick(){
    axios({
        method: 'get',
        url: `http://localhost:8002/load_template/${user_id}/chatgpt/report`,
    })
    .then(response => {
        console.log('리포트 설정 완료 :', response);

        var popup1_content = document.querySelector(".popup1-content");
        popup1_content.style.display = 'none'; // '크롤러 설정' 콘텐츠는 display None

        var popup2_content = document.querySelector(".popup2-content");
        popup2_content.style.display = 'none'; // '리포트 설정' 콘텐츠는 display None

        var popup4_content = document.querySelector(".popup4-content");
        popup4_content.style.display = 'none'; // '자주 쓰는 문구' 콘텐츠는 display None

        var popup5_content = document.querySelector(".popup5-content");
        popup5_content.style.display = 'none';    // '모델 설정' 콘텐츠는 display None

        var popup3_content = document.querySelector(".popup3-content");
        popup3_content.innerHTML=''; // 다시 빈 내용으로 설정한다.
        popup3_content.style.display = 'block'; // 팝업 내용을 표시합니다.

        // '리포트 템플릿' 텍스트
        var templateText = document.createElement('h4');
        templateText.textContent = '리포트 템플릿';
        templateText.style.marginLeft = '60px';

        popup3_content.appendChild(templateText);

        // '리포트 템플릿' TextArea
        var templateTextArea = document.createElement('textarea');
        templateTextArea.value = response.data.prompt=='' ? response.data.prompt_default : response.data.prompt;   // response 받아와서 company_info가 빈값이면 company_info_default 값으로 대치한다. (삼항 연산자를 통해서)
        templateTextArea.style.width = '80%';
        templateTextArea.style.height = '300px';
        templateTextArea.style.marginLeft = '60px';
        templateTextArea.style.resize = 'none'; // 크기 조정 비활성화
        templateTextArea.style.fontFamily = 'scd'; // 글꼴 설정

        popup3_content.appendChild(templateTextArea);

        // 구분선
        var divider = document.createElement('hr');
        divider.style.width = '110%'; // 너비 설정
        divider.style.border = '1px solid #ccc'; // 선의 스타일 설정, 예: 회색, 1px 두께
        divider.style.margin = '20px 20px'; // 위아래 마진 설정

        popup3_content.appendChild(divider);

        // 'Document 템플릿'
        var DocumentText = document.createElement('h4');
        DocumentText.textContent = 'Document 템플릿';
        DocumentText.style.marginLeft = '60px';
        popup3_content.appendChild(DocumentText);

        // 'Document 템플릿 TextArea'
        var DocumentTextArea = document.createElement('textarea');
        DocumentTextArea.value = response.data.document=='' ? response.data.document_default : response.data.document;   
        DocumentTextArea.style.width = '80%';
        DocumentTextArea.style.height = '150px';
        DocumentTextArea.style.marginLeft = '60px';
        DocumentTextArea.style.resize = 'none'; // 크기 조정 비활성화
        DocumentTextArea.style.fontFamily = 'scd'; // 글꼴 설정
        popup3_content.appendChild(DocumentTextArea);

        // 템플릿 저장 버튼 컨테이너
        var saveButtonContainer = document.createElement('div');
        saveButtonContainer.style.width = '100%'; // 컨테이너의 너비를 100%로 설정
        saveButtonContainer.style.display = 'flex';
        saveButtonContainer.style.justifyContent = 'flex-end'; // 모든 버튼을 오른쪽으로 정렬
        saveButtonContainer.style.marginTop = '10px';
        
        // 초기화 버튼
        var resetButton = document.createElement('button');
        resetButton.textContent = '초기화';
        resetButton.style.marginRight = '10px'; // 오른쪽 마진 적용
        resetButton.style.fontFamily='scd';  // 글꼴 설정
        resetButton.onclick = function() {
            templateTextArea.value = response.data.prompt_default;
            DocumentTextArea.value = response.data.document_default;
        };
        saveButtonContainer.appendChild(resetButton);

        // 템플릿 저장 버튼
        var saveTemplateButton = document.createElement('button');
        saveTemplateButton.textContent = '템플릿 저장';
        saveTemplateButton.style.marginRight = '10px'; // 오른쪽 마진 적용
        saveTemplateButton.style.fontFamily='scd';  // 글꼴 설정
        saveTemplateButton.onclick = function() {
            // AI 측에 템플릿 저장 설정을 적용한다.
            axios({
                method: 'post',
                url: `http://localhost:8002/edit_template/${user_id}/chatgpt/report`,
                data : {
                    'template_config' : {
                        'prompt' : templateTextArea.value,
                        'document' : DocumentTextArea.value,
                    }
                }
            })
            .then(response => {
                alert('리포트 설정이 완료되었습니다.');  // alert
                popup3_content.style.display = 'none'; // 나가기 
            })
            .catch(error => {
                alert('오류가 발생했습니다.');
                console.log('에러');
                console.error(error); // 오류 처리
            });
        };
        saveButtonContainer.appendChild(saveTemplateButton);

        // 나가기 버튼
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.marginRight = '10px'; // 오른쪽 마진 적용
        exitButton.style.fontFamily='scd';  // 글꼴 설정
        exitButton.onclick = function() {
            // 나가기 버튼 클릭 시 팝업을 닫습니다.
            popup3_content.style.display = 'none';
            console.log('나가기 버튼 클릭');
        };
        saveButtonContainer.appendChild(exitButton);

        // 템플릿 저장 버튼 컨테이너를 팝업에 추가
        popup3_content.appendChild(saveButtonContainer);

        // Divider 선
        var divider = document.createElement('hr');
        divider.style.width = '110%'; // 너비 설정
        divider.style.border = '1px solid #ccc'; // 선의 스타일 설정, 예: 회색, 1px 두께
        divider.style.margin = '20px 20px'; // 위아래 마진 설정
        popup3_content.appendChild(divider);

        // 레포트 만들기 버튼 컨테이너
        var createButtonContainer = document.createElement('div');
        createButtonContainer.style.display = 'flex';
        createButtonContainer.style.justifyContent = 'flex-end';
        createButtonContainer.style.marginTop = '10px';

        // 레포트 만들기 버튼
        var createReportButton = document.createElement('button');
        createReportButton.textContent = '레포트 만들기';
        createReportButton.style.fontFamily='scd';  // 글꼴 설정
        createReportButton.onclick = function() {
            console.log('레포트 만들기 버튼 클릭');

            // 1. AI측과 '레포트 만들기' 기능을 가지고 소통한다.


            // 2. 로컬 컴퓨터에 실제 pdf 파일을 다운로드 받을 수 있도록 한다. (Blob 객체를 활용)


            // 3. 나가기 


        };
        createButtonContainer.appendChild(createReportButton);
        popup3_content.appendChild(createButtonContainer);
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.log('에러');
        console.error(error); // 오류 내용
    }); 
}

// 모달 창에서 '자주 쓰는 문구'을 click 했을 떄 호출되는 함수
function handleUseClick(){
    var popup1_content = document.querySelector(".popup1-content");
    popup1_content.style.display = 'none'; // '크롤러 설정' 콘텐츠는 display None

    var popup2_content = document.querySelector(".popup2-content");
    popup2_content.style.display = 'none'; // '프롬프트 설정' 콘텐츠는 display None

    var popup3_content = document.querySelector(".popup3-content");
    popup3_content.style.display = 'none'; // '리포트 설정' 콘텐츠는 display None

    var popup5_content = document.querySelector(".popup5-content");
    popup5_content.style.display = 'none';    // '모델 설정' 콘텐츠는 display None

    var popup4_content = document.querySelector(".popup4-content");
    popup4_content.innerHTML=''; // 다시 빈 내용으로 설정한다.
    popup4_content.style.display = 'block'; // 팝업 내용을 표시합니다.

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

// 모달 창에서 '모델 설정'을 click 했을 떄 호출되는 함수
function handleModelClick() {
    // AI측으로부터 자신의 모델 설정이 현재 어떠한지에 대한 정보를 가져온다.
    axios({
        method: 'get',
        url: '', // 백엔드 URL
    })
    .then(response => {
        // 기존 팝업 내용 숨기기
        var popup1_content = document.querySelector(".popup1-content");
        popup1_content.style.display = 'none';

        var popup2_content = document.querySelector(".popup2-content");
        popup2_content.style.display = 'none';

        var popup3_content = document.querySelector(".popup3-content");
        popup3_content.style.display = 'none';

        var popup4_content = document.querySelector(".popup4-content");
        popup4_content.style.display = 'none';

        // 모델 설정 팝업 내용 설정
        var popup5_content = document.querySelector(".popup5-content");
        popup5_content.innerHTML = '';
        popup5_content.style.display = 'block';
        popup5_content.style.padding = '20px';

        // 모델 섹션 생성
        const models = ['ChatGPT 3.5', 'ChatGPT 4'];
        models.forEach(modelName => {
            var section = document.createElement('div');
            section.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border: 1px solid black; padding: 10px;';

            var modelText = document.createElement('span');
            modelText.textContent = modelName;
            section.appendChild(modelText);

            // ex) 예를 들어 내가 'ChatGPT 3.5'로 설정되어 있으면 'ChatGPT 4'를 선택할 수 있는 Button을 마련한다.  
            if (modelName =='ChatGPT 4') {
                var modelButton = document.createElement('button');
                modelButton.textContent = '선택';
                modelButton.style.fontFamily='scd'; // 글꼴 설정
                // modelButton.style.cssText = 'background-color: white; color: black; border: 1px solid black; cursor: default;';
                modelButton.onmouseover = function() {
                    this.style.backgroundColor = '#454997'; // 호버 시 배경 색상 변경
                    this.style.color = '#FFFFFF'; // 호버 시 텍스트 색상 변경
                };
                modelButton.onmouseout = function() { 
                    this.style.backgroundColor = '#FFFFFF'; // 마우스 아웃 시 원래 배경 색상으로 변경
                    this.style.color = '#000000'; // 마우스 아웃 시 원래 텍스트 색상으로 변경
                };
                modelButton.onclick = function() { // '선택' 버튼을 click 했을 떄 
                    console.log('선택 버튼 click');


                    // Axios를 이용하여 AI 측과 연동


                }
                section.appendChild(modelButton);
            }

            popup5_content.appendChild(section);
        });

        // 현재 사용 중인 모델 표시
        var currentModelText = document.createElement('p');
        currentModelText.textContent = `현재 사용모델: 안양역`;
        currentModelText.style.marginTop = '20px'; // 마진 상단 추가
        currentModelText.style.fontSize = '14px'; // 폰트 사이즈 줄이기
        popup5_content.appendChild(currentModelText);

        // '나가기' 버튼을 포함하는 컨테이너
        var exitButtonContainer = document.createElement('div');
        exitButtonContainer.style.cssText = 'display: flex; justify-content: flex-end;'; // 오른쪽 정렬을 위한 스타일

        // '나가기' 버튼 추가
        var exitButton = document.createElement('button');
        exitButton.textContent = '나가기';
        exitButton.style.fontFamily='scd';
        // exitButton.style.cssText = 'background-color: white; color: black; border: 1px solid black; cursor: pointer; margin-top: 20px;';
        exitButton.onmouseover = function() { 
            this.style.backgroundColor = '#454997'; // 호버 시 배경 색상 변경
            this.style.color = '#FFFFFF'; // 호버 시 텍스트 색상 변경
        };
        exitButton.onmouseout = function() { 
            this.style.backgroundColor = '#FFFFFF'; // 마우스 아웃 시 원래 배경 색상으로 변경
            this.style.color = '#000000'; // 마우스 아웃 시 원래 텍스트 색상으로 변경
        };
        exitButton.onclick = function() { // '나가기' 버튼을 click 했을 떄
            popup5_content.style.display = 'none'; // 나가기
        };

        // 컨테이너에 '나가기' 버튼 추가
        exitButtonContainer.appendChild(exitButton);

        // 팝업에 컨테이너 추가
        popup5_content.appendChild(exitButtonContainer);
    })
    .catch(error => {
        alert('오류가 발생했습니다.');
        console.error(error);
    });
}

// 모달 창에서 자주 쓰는 문구를 목록으로 보여주는 함수
function renderFrequentMessages(messageList){
    const container = document.querySelector('.popup4-content'); // 문구를 표시할 컨테이너 선택
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
                  
            <p style="margin: 0px 10px 0px 0px; width: 300px; font-family: 'scd';">${message.template_name}</p>
 
            <textarea style="width:60%; text-align: left; font-family: 'scd'; resize: none;" 
                      placeholder='자주 쓰는 문구에 대한 Text를 불러와야 합니다.'
                      disabled>
                        ${message.template_content}
            </textarea>
            

            <button type="button"
                    style="background-color: #ccccff; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 160px; text-align: center;  font-family: 'scd';"
                    onclick="editFrequentMessage('${message.template_id}')">수정</button>

            <button type="button" 
                    style="background-color: #ffcccc; color: black; padding: 5px 10px; border: none; border-radius: 5px; margin-left: 10px; width: 160px; text-align: center;  font-family: 'scd';"
                    onclick="deleteFrequentMessage('${message.template_id}')">삭제</button>

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
    addButton.textContent = '추가';
    addButton.style.fontFamily='scd'; // 글꼴 설정
    addButton.onclick = function() {
        addFrequentMessage(); // "추가하기" 버튼 클릭 시 호출될 함수
    };

    const reflectButton = document.createElement('span');
    reflectButton.className = 'reflect';
    reflectButton.textContent = '반영';
    reflectButton.style.fontFamily='scd'; // 글꼴 설정
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