import { markMessageAsRead, markMessageAsUnread, archiveMessage } from '../service/messageService.js';

let isSortedDescending = true; // Default sort order for inbox/outbox.

// Exporting the static constants from HTML elements
export const inboxButton = document.getElementById('inboxButton');
export const outboxButton = document.getElementById('outboxButton');
export const messageList = document.getElementById('messageList');
export const deleteButton = document.getElementById('deleteButton');
export const toggleReadButton = document.getElementById('toggleReadButton');
export const sortByDateTime = document.getElementById('sortByDateTime');

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
    const token = localStorage.getItem('access-token');

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
        const listItem = createMessageListItem(message, origin);
        messageList.appendChild(listItem);
    });
}

/**
 * Creates a list item for a message.
 * @param {Object} message - The message object.
 * @param {string} origin - The origin of the message ('inbox' or 'outbox').
 * @returns {HTMLElement} - The list item element.
 */
function createMessageListItem(message, origin) {
    const listItem = document.createElement('li');
    listItem.classList.add('messageItem', message.read ? 'read' : 'unread');

    const checkbox = createCheckbox(message.messageId);
    listItem.prepend(checkbox);

    const messageLink = createMessageLink(message, origin);
    listItem.appendChild(messageLink);

    const dateTimeElement = createDateTimeElement(message.dateTime);
    listItem.appendChild(dateTimeElement);

    messageLink.addEventListener('click', () => markAsRead(message.messageId, listItem));

    return listItem;
}

/**
 * Creates a checkbox input element.
 * @param {string} messageId - The ID of the message.
 * @returns {HTMLElement} - The checkbox input element.
 */
function createCheckbox(messageId) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = messageId;
    return checkbox;
}

/**
 * Creates a link element for a message.
 * @param {Object} message - The message object.
 * @param {string} origin - The origin of the message ('inbox' or 'outbox').
 * @returns {HTMLElement} - The link element.
 */
function createMessageLink(message, origin) {
    const messageLink = document.createElement('a');
    messageLink.href = `/messageDetails/messageDetails.html?messageId=${message.messageId}&origin=${origin}`;
    messageLink.target = '_blank';
    messageLink.style.textDecoration = 'none';

    const subjectElement = document.createElement('h3');
    subjectElement.classList.add('messageSubject');
    subjectElement.textContent = message.subject;

    const detailsElement = document.createElement('div');
    detailsElement.classList.add('messageDetails');

    messageLink.appendChild(subjectElement);
    messageLink.appendChild(detailsElement);

    return messageLink;
}

/**
 * Creates a date/time element for a message.
 * @param {string} dateTime - The date/time string of the message.
 * @returns {HTMLElement} - The date/time span element.
 */
function createDateTimeElement(dateTime) {
    const dateTimeElement = document.createElement('span');
    dateTimeElement.classList.add('messageDate');
    dateTimeElement.textContent = new Intl.DateTimeFormat('en-GB', timeOptions).format(new Date(dateTime));
    return dateTimeElement;
}

/**
 * Marks a message as read.
 * @param {string} messageId - The ID of the message.
 * @param {HTMLElement} listItem - The list item element.
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
 * Marks a message as unread.
 * @param {string} messageId - The ID of the message.
 * @param {HTMLElement} listItem - The list item element.
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
toggleReadButton.addEventListener('click', handleToggleReadUnread);

function handleToggleReadUnread() {
    const selectedMessages = getSelectedMessages();

    if (selectedMessages.length === 0) {
        alert('Geen bericht geselecteerd');
        return;
    }

    const hasUnread = selectedMessages.some(isMessageUnread);

    const action = hasUnread ? 'markeren als gelezen' : 'markeren als ongelezen';

    confirmAction(action, selectedMessages.length)
        .then(result => {
            if (result.isConfirmed) {
                processToggleReadUnread(selectedMessages, hasUnread);
            } else {
                console.log("User canceled the action");
            }
        });
}

/**
 * Retrieves the selected messages.
 * @returns {Array} - An array of selected checkbox elements.
 */
function getSelectedMessages() {
    return Array.from(messageList.querySelectorAll('input[type="checkbox"]:checked'));
}

/**
 * Checks if a message is unread.
 * @param {HTMLElement} checkbox - The checkbox element.
 * @returns {boolean} - True if the message is unread, false otherwise.
 */
function isMessageUnread(checkbox) {
    const listItem = checkbox.closest('li');
    return listItem.classList.contains('unread');
}

/**
 * Displays a confirmation dialog.
 * @param {string} actionText - The action to confirm.
 * @param {number} messageCount - The number of messages affected.
 * @returns {Promise} - A promise that resolves to the user's choice.
 */
function confirmAction(actionText, messageCount) {
    return Swal.fire({
        title: 'Weet je het zeker?',
        text: `Weet je zeker dat je ${messageCount} bericht(en) wilt ${actionText}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ja, doe het!',
        cancelButtonText: 'Nee, annuleren',
    });
}

/**
 * Processes toggling messages as read or unread.
 * @param {Array} selectedMessages - An array of selected checkbox elements.
 * @param {boolean} hasUnread - Indicates if any selected messages are unread.
 */
function processToggleReadUnread(selectedMessages, hasUnread) {
    selectedMessages.forEach(checkbox => {
        const messageId = checkbox.value;
        const listItem = checkbox.closest('li');
        if (hasUnread) {
            markAsRead(messageId, listItem);
        } else {
            markAsUnread(messageId, listItem);
        }
    });
}

/**
 * Handles deletion of selected messages.
 */
deleteButton.addEventListener('click', handleDeleteMessages);

function handleDeleteMessages() {
    const selectedMessageIds = getSelectedMessages().map(checkbox => checkbox.value);

    if (selectedMessageIds.length === 0) {
        alert('Geen bericht geselecteerd');
        return;
    }

    confirmAction('verwijderen', selectedMessageIds.length)
        .then(result => {
            if (result.isConfirmed) {
                processDeleteMessages(selectedMessageIds);
            } else {
                console.log("User canceled the action");
            }
        });
}

/**
 * Processes deletion of messages.
 * @param {Array} selectedMessageIds - An array of message IDs to delete.
 */
function processDeleteMessages(selectedMessageIds) {
    const token = localStorage.getItem('access-token');
    const apiEndpoint = inboxButton.classList.contains('selected')
        ? '/api/messages/archiveReceiver/'
        : '/api/messages/archiveSender/';

    selectedMessageIds.forEach(messageId => {
        archiveMessage(apiEndpoint, messageId, token)
            .then(response => {
                if (response.ok) {
                    removeMessageFromList(messageId);
                } else {
                    console.error(`Error archiving message with ID ${messageId}`);
                }
            })
            .catch(error => {
                console.error(`Error archiving message with ID ${messageId}:`, error);
            });
    });
}

/**
 * Removes a message from the message list.
 * @param {string} messageId - The ID of the message to remove.
 */
function removeMessageFromList(messageId) {
    const messageItem = messageList.querySelector(`input[value="${messageId}"]`).closest('li');
    if (messageItem) {
        messageItem.remove();
    }
}

/**
 * Handles sorting messages by date/time.
 */
sortByDateTime.addEventListener('click', () => {
    isSortedDescending = !isSortedDescending;
    fetchMessages(`/api/messages/receiver_get`);
});
