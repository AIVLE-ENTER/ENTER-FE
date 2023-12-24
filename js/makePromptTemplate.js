// '추가하기' 버튼이 click 될 떄 호출되는 함수
function addTemplate() {
    // 새로운 프롬프트 템플릿 생성
    var newPrompt = document.createElement("div");
    newPrompt.className = 'promptTemplate';
    newPrompt.style.display = 'flex';
    newPrompt.style.alignItems = 'center';

    // 문구 추가
    var p = document.createElement("p");
    p.style.margin = "0 10px 0 0";
    p.style.width = "100px";
    p.textContent = "문구";
    newPrompt.appendChild(p);

    // 입력창 추가
    var input = document.createElement("input");
    input.type = 'text';
    input.placeholder = '템플릿 문구에 대한 Text를 불러와야 합니다.';
    newPrompt.appendChild(input);

    // 간격을 위한 빈 div 태그 추가
    var spacerDiv = document.createElement("div");
    spacerDiv.style.marginLeft = "20px";
    newPrompt.appendChild(spacerDiv);

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

    // 전체 템플릿을 allPromptTemplate에 추가
    var container = document.querySelector(".allPromptTemplate");
    container.appendChild(newPrompt);
}

// '삭제하기' 버튼이 click 될 떄 호출되는 함수
function deleteTemplate(button) {
    // 버튼이 속한 promptTemplate 요소를 삭제
    button.parentElement.remove();
}


// '반영하기' 버튼이 click 될 떄 호출되는 함수
function reflect(){

}