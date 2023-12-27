const currentId = window.location.search.substring(4);
console.log(currentId);

tempUrl = 'http://127.0.0.1:8000/board/' + currentId + '/';

axios.get(tempUrl)
.then((response) => {
    console.log('success');
    inquiryData = response.data;
    console.log(inquiryData);

    faqItemType = document.querySelector('.faqItem-type')
    faqItemTitle = document.querySelector('.faqItem-title')
    faqItemWriter = document.querySelector('.faqItem-writer')
    faqItemContent = document.querySelector('.faqItem-content')

    faqItemType.append(inquiryData['question_type_title'])
    faqItemTitle.append(inquiryData['question_title'])
    faqItemWriter.append(inquiryData['user_name'])
    faqItemContent.append(inquiryData['question_content'])

    // board_list.forEach((content) => {
    //     console.log(content)
        
    //     htmlItem = document.createElement('tbody');
    //     htmlItem.onclick = function() {
    //         redirectToDetailPage(content.board_id);
    //     }
    //     htmlItem.innerHTML = `<td>${contentNumber++}</td>
    //                           <td>${content.question_type_title}</td>
    //                           <td>${content.question_title}</td>
    //                           <td>${content.user_name}</td>
    //                           <td>${content.question_datetime.substr(0, 10)}</td>
    //                           <td>${15}</td>`
    //     document.getElementById('boardList').appendChild(htmlItem);
        
    // });
})
.catch((error) => {
    console.log(`error: ${error}`);
})
.finally(() => {
    console.log('End.')
})



