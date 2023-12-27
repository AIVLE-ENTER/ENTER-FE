$.ajax({
    url: '/board/',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        console.log('-------------------------json')
        console.log(data)
        data.forEach(function(board) {
            $('boardList').append('<li><strong>' + board.title + '</strong>: ' + board.content + '</li>');
        });
    },
    error: function(error) {
        console.log(error);
    }
});

function redirectToDetailPage(postId) {
    window.location.href = '/inquiryDetail_test.html?id=' + postId;
}
