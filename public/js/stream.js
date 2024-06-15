let totalPostsVisible = 0;

$(document).ready( async () => {
    await fetchMessages(true)
});

$(document).on('click', '#seeMoreMessagesButton', async () => {
    await fetchMessages()
})

$('.className').text(classObject.className);

$('.classOwnerName').text(classObject.owners[0].firstName + ' ' + classObject.owners[0].lastName);

$('.classCode').text(classObject.classId);

$("#stream").addClass("selectedTabsDiv");

$(document).on('keydown', '#announcementText', async (event) => {
    if(event.which === 13 && !event.shiftKey) {
        await sendMessage()
        return false;
    }
})

$(document).on('click', '#sendMessageButton', async () => {
    await sendMessage()
})

async function fetchMessages(initial = false) {
    let classId = classObject._id
    await $.get(`/api/messages/${classId}/${totalPostsVisible}/5`, (data, status, xhr) => {
        if (xhr.status === 0) {
            return alert("Please connect to the Internet and try again!")
        }
        if (xhr.status !== 200) {
            return alert("Something went wrong, try reloading the page!")
        }
        let html = generateMessagesHtml(data)
        initial ? $('.messages').html(html) : $('.messages').prepend(html)
    })
}
// Update sendMessage function
async function sendMessage() {
    let content = $('#announcementText').val().trim();
    let classId = classObject._id;
    let file = $('#fileInput')[0].files[0]; // Access the uploaded file

    if (content === '') return;

    let formData = new FormData();
    formData.append('content', content);
    formData.append('classId', classId);
    formData.append('file', file);

    try {
        const response = await fetch('/api/messages/message', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            $('#announcementText').val('');
            let html = generateMessagesHtml([data]);
            $('.messages').append(html);
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

async function sendMessages() {
    let content = $('#announcementText').val().trim()
    let classId = classObject._id;
    if (content === '') return;

    await $.post('/api/messages', { content, classId })
    .then(function(data) {
        $('#announcementText').val('');
        let html = generateMessagesHtml([data])
        $('.messages').append(html)
    });
}

function generateMessagesHtmls (messages) {
    let html = ""
    messages.reverse().forEach(message => {
        
        let name = message.sender.firstName + " " + message.sender.lastName
        var timestamp = timeDifference(new Date(), new Date(message.createdAt))
        let isOwnerMessage = message.isOwner ? `style="background-color: var(--bgByOwner);"` : ""

        html += `<div class="messageContainer" ${isOwnerMessage}>
                    <div class="profileContainer">
                        <img src="${message.sender.profilePic}" alt="Profile Picture">
                    </div>
                    <div class="message">
                        <p class="senderName">
                            <span class="standardTextEllipses whiteSpaceBreakSpace">${name}</span>
                            <span>&nbsp; ⌚ &nbsp;</span>
                            <span class="standardTextEllipses whiteSpaceBreakSpace">${timestamp}</span>
                        </p>
                        <p class="messageText">
                            <span class="standardTextEllipses whiteSpaceBreakSpace">${message.content}</span>
                        </p>
                    </div>
                </div>`
    })
    totalPostsVisible += messages.length
    return html
}

function generateMessagesHtml(messages) {
    let html = "";
    messages.reverse().forEach(message => {
        let name = message.sender.firstName + " " + message.sender.lastName;
        var timestamp = timeDifference(new Date(), new Date(message.createdAt));
        let isOwnerMessage = message.isOwner ? `style="background-color: var(--bgByOwner);"` : "";
        
        html += `<div class="messageContainer" ${isOwnerMessage}>
                    <div class="profileContainer">
                        <img src="${message.sender.profilePic}" alt="Profile Picture">
                    </div>
                    <div class="message">
                        <p class="senderName">
                            <span class="standardTextEllipses whiteSpaceBreakSpace">${name}</span>
                            <span>&nbsp; ⌚ &nbsp;</span>
                            <span class="standardTextEllipses whiteSpaceBreakSpace">${timestamp}</span>
                        </p>
                        <p class="messageText">
                            <span class="standardTextEllipses whiteSpaceBreakSpace">${message.content}</span>
                        </p>
                        <div class="attachments">`;

        // if (message.attachments && message.attachments.length > 0) {
        //     message.attachments.forEach(attachment => {
        //      //   html += `<a href="${attachment}" target="_blank" rel="noopener noreferrer">Attachment</a><br>`;
        //      html += `<img src="${attachment}" alt="Attachment Image"><br>`;
        //     });
        // }
        if (message.attachments && message.attachments.length > 0) {
            message.attachments.forEach(attachment => {
                // Assuming 'attachment' contains URLs served by your server
              //  html += `<img src="${attachment}" alt="Attachment Image"><br>`;
              // Assuming 'attachment' contains the URL from the database
                html += `<a href="${attachment}" target="_blank" rel="noopener noreferrer">Attachment</a><br>`;

            });
        }

        html += `       </div>
                    </div>
                </div>`;
    });
    totalPostsVisible += messages.length;
    return html;
}
