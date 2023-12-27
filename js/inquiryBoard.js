var contentNumber = 1;

tempUrl = 'http://127.0.0.1:8000/board/'
axios.get(tempUrl)
    .then((response) => {
        console.log('success');
        console.log(typeof(response));
        const board_list = response.data['post_list']
        totalContentItem = document.create
        console.log(board_list)

        board_list.forEach((content) => {
            console.log(content)
            
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
    .finally(() => {
        console.log('End.')
    })

function redirectToDetailPage(postId) {    
    window.location.href = '/inquiryDetail.html?id=' + postId;
}



