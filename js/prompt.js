
// chat 기록 가져오는 함수
function fetchChatHistory() {
    fetch('/get_chat_history/')
        .then(response => response.json())
        .then(data => {
            const chatList = document.getElementById('side-chat-list');
            data.search_chat.forEach(searchTerm => {
                const listItem = document.createElement('li');
                listItem.classList.add('side-navbar-link')
                listItem.textContent = searchTerm;
                chatList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching search history', error)
        })
}

// chat 만드는 함수
function createChat(chatName) {
    const newChat = {
        name: chatName,
        id: Date.now()  // 임시 id값
    };

    renderChats();
}

function renderChats() {
    const chatsDiv = document.getElementById('chatRooms')
}

