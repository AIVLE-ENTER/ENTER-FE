var contentNumber = 1;

tempUrl = 'http://127.0.0.1:8000/board/'
axios.get(tempUrl)
.then((response) => {
    console.log('success');
    var board_list = response.data['post_list'];
    
    console.log(Object.keys(board_list).length)
    totalBoardCount = document.querySelector('.aside');
    totalBoardCount.append('▷ 총 ' + Object.keys(board_list).length + '개의 게시물이 있습니다.');

    
    board_list.forEach((content) => {     
        htmlItem = document.createElement('tbody');
        htmlItem.onclick = function() {
            redirectToDetailPage(content.board_id);
        }
        htmlItem.innerHTML = `<td>${contentNumber++}</td>
                                <td>${content.question_type_title}</td>
                                <td>${content.question_title}</td>
                                <td>${content.user_name}</td>
                                <td>${content.question_datetime.substr(0, 10)}</td>
                                <td>${15}</td>`
        document.getElementById('boardList').appendChild(htmlItem);
        
    });
})
.catch((error) => {
    console.log(`error: ${error}`);
})

function redirectToDetailPage(postId) {    
    window.location.href = '/inquiryDetail.html?id=' + postId;
}



