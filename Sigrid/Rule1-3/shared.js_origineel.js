import {markMessageAsRead, markMessageAsUnread, archiveMessage} from '../service/messageService.js';

let isSortedDescending = true; // Default sort order

// Exporting the static constants from HTML elements
export const inboxButton = document.getElementById('inboxButton');
export const outboxButton = document.getElementById('outboxButton');
export const messageList = document.getElementById('messageList');
export const deleteButton = document.getElementById('deleteButton');
export const toggleReadButton = document.getElementById('toggleReadButton');
export const sortByDateTime = document.getElementById('sortByDateTime'); // Reference to the Date/Time sorting element

// Created to use EU time/date formatting instead of default US when converting.
const timeOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};

/**
 * Generalized function to fetch and display messages.
 * @param {string} apiEndpoint - The API endpoint to fetch messages from.
 */
export function fetchMessages(apiEndpoint) {
    const token = localStorage.getItem('access-token'); // Fetch token from local storage

    fetch(apiEndpoint, {
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(messages => {
            renderMessages(messages);
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
}

/**
 * Renders messages into the message list.
 * @param {Array} messages - Array of message objects to render.
 */
function renderMessages(messages) {
    const origin = inboxButton.classList.contains('selected') ? 'inbox' : 'outbox';

    messages.sort((a, b) => {
        return isSortedDescending
            ? new Date(b.dateTime) - new Date(a.dateTime)
            : new Date(a.dateTime) - new Date(b.dateTime);
    });

    messageList.innerHTML = '';
    messages.forEach(message => {
        const listItem = document.createElement('li');
        listItem.classList.add('messageItem', message.read ? 'read' : 'unread');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = message.messageId;
        listItem.prepend(checkbox);

        const messageLink = document.createElement('a');
        messageLink.href = `/messageDetails/messageDetails.html?messageId=${message.messageId}&origin=${origin}`;
        messageLink.target = '_blank';
        messageLink.style.textDecoration = 'none';

        const subjectElement = document.createElement('h3');
        subjectElement.classList.add('messageSubject');
        subjectElement.textContent = message.subject;

        // DEVELOPING HERE FOR DATE IN INBOX:
        const dateTimeElement = document.createElement('span');
        dateTimeElement.classList.add('messageDate');
        dateTimeElement.textContent = new Intl.DateTimeFormat('en-GB', timeOptions).format(new Date(message.dateTime))

        const detailsElement = document.createElement('div');
        detailsElement.classList.add('messageDetails');

        messageLink.appendChild(subjectElement);
        messageLink.appendChild(detailsElement);

        listItem.appendChild(messageLink);

        listItem.appendChild(dateTimeElement)

        messageLink.addEventListener('click', () => markAsRead(message.messageId, listItem));

        messageList.appendChild(listItem);
    });
}

/**
 * Marks a message as read by calling the markMessageAsRead function from messageService.
 * @param {string} messageId - The ID of the message to mark as read.
 * @param {HTMLElement} listItem - The list item element representing the message.
 */
function markAsRead(messageId, listItem) {
    const token = localStorage.getItem('access-token');
    markMessageAsRead(messageId, token)
        .then(response => {
            if (response.ok) {
                listItem.classList.remove('unread');
                listItem.classList.add('read');
            } else {
                console.error('Error in marking message as READ');
            }
        })
        .catch(error => {
            console.error('Error marking message as read:', error);
        });
}

/**
 * Marks a message as unread by calling the markMessageAsUnread function from messageService.
 * @param {string} messageId - The ID of the message to mark as unread.
 * @param {HTMLElement} listItem - The list item element representing the message.
 */
function markAsUnread(messageId, listItem) {
    const token = localStorage.getItem('access-token');
    markMessageAsUnread(messageId, token)
        .then(response => {
            if (response.ok) {
                listItem.classList.remove('read');
                listItem.classList.add('unread');
            } else {
                console.error('Error in marking message as UNREAD');
            }
        })
        .catch(error => {
            console.error('Error marking message as unread:', error);
        });
}

/**
 * Handles the toggle functionality of marking messages as read/unread.
 */
toggleReadButton.addEventListener('click', () => {
    const selectedMessages = Array.from(messageList.querySelectorAll('input[type="checkbox"]:checked'));

    if (selectedMessages.length === 0) {
        alert('Geen bericht geselecteerd');
        return;
    }

    // Check if any selected message is unread
    const hasUnread = selectedMessages.some(checkbox => {
        const listItem = checkbox.closest('li');
        return listItem.classList.contains('unread');
    });

    const action = hasUnread ? 'markeren als gelezen' : 'markeren als ongelezen';
    Swal.fire({
        title: 'Weet je het zeker?',
        text: `Weet je zeker dat je ${selectedMessages.length} bericht(en) wilt ${action}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ja, doe het!',
        cancelButtonText: 'Nee, annuleren',
    }).then((result) => {
        if (result.isConfirmed) {
            // Continue with your action
            console.log("User confirmed the action");
        } else {
            // User clicked cancel
            console.log("User canceled the action");
            return;
        }
    });

    selectedMessages.forEach(checkbox => {
        const messageId = checkbox.value;
        const listItem = checkbox.closest('li');
        if (hasUnread) {
            markAsRead(messageId, listItem);
        } else {
            markAsUnread(messageId, listItem);
        }
    });
});

/**
 * Handles deletion of selected messages.
 * Determines the correct API endpoint and sends a request for each selected message.
 */
deleteButton.addEventListener('click', () => {
    const selectedMessageIds = Array.from(messageList.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    if (selectedMessageIds.length === 0) {
        alert('Geen bericht geselecteerd');
        return;
    }
    if (!confirm(`Weet je zeker dat je bericht(en) ${selectedMessageIds.length} wilt verwijderen?`)) {
        return;
    }

    const token = localStorage.getItem('access-token');  // Fetch token
    const apiEndpoint = inboxButton.classList.contains('selected')
        ? '/api/messages/archiveReceiver/'
        : '/api/messages/archiveSender/';

    selectedMessageIds.forEach(messageId => {
        archiveMessage(apiEndpoint, messageId, token)
            .then(response => {
                if (response.ok) {
                    messageList.querySelector(`input[value="${messageId}"]`).closest('li').remove();
                } else {
                    console.error(`Error archiving message with ID ${messageId}`);
                }
            })
            .catch(error => {
                console.error(`Error archiving message with ID ${messageId}:`, error);
            });
    });
});

sortByDateTime.addEventListener('click', () => {
    isSortedDescending = !isSortedDescending;
    fetchMessages(`/api/messages/receiver_get`);
})