package com.makeitmatch.makeitmatch.business.domain;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * @author Mack Bakkum
 * @project Make IT Match
 * @created 09/08/2024 - 10:30
 */

public class Message {

    private int messageId;
    private User sender;
    private User receiver;
    private LocalDateTime dateTime;
    private String subject;
    private String messageContent;
    private int threadId;
    private boolean isRead;
    private boolean archivedBySender;
    private boolean archivedByReceiver;

    // Temporary fields, utlizied for displaying the name correctly in the messageDetails page
    private String senderFullName;
    private String senderCompanyName;
    private String receiverFullName;
    private String receiverCompanyName;

    public Message(int messageId, User sender, User receiver, LocalDateTime dateTime, String subject, String messageContent, int threadId, boolean isRead, boolean archivedBySender, boolean archivedByReceiver) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.dateTime = dateTime;
        this.subject = subject;
        this.messageContent = messageContent;
        this.threadId = threadId;
        this.isRead = isRead;
        this.archivedBySender = archivedBySender;
        this.archivedByReceiver = archivedByReceiver;
    }

    public Message() {
        this(0, null, null, LocalDateTime.now(), "default", "ignore", 0, false, false, false);
    }

    @Override
    public String toString() {
        return "Message toString:\n ID: " + messageId + ",\n Sender: " + (sender != null ? sender.getUsername() : "null") +
                ",\n Receiver: " + (receiver != null ? receiver.getUsername() : "null") +
                ",\n DateTime: " + dateTime + ",\n Subject: " + subject + ",\n MessageContent: " + messageContent +
                ",\n Thread: " + threadId + ",\n IsRead: " + isRead + ",\n ArchivedBySender: " + archivedBySender +
                ",\n ArchivedByReceiver: " + archivedByReceiver;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        Message message = (Message) obj;

        if (messageId != message.messageId) return false;
        return Objects.equals(sender, message.sender) &&
                Objects.equals(receiver, message.receiver) &&
                threadId == message.threadId &&
                isRead == message.isRead
                && archivedBySender == message.archivedBySender
                && archivedByReceiver == message.archivedByReceiver;
    }

    @Override
    public int hashCode() {
        int result = messageId;
        result = 31 * result + (sender != null ? sender.hashCode() : 0);
        result = 31 * result + (receiver != null ? receiver.hashCode() : 0);
        result = 31 * result + (subject != null ? subject.hashCode() : 0);
        result = 31 * result + threadId;
        result = 31 * result + (isRead ? 1: 0);
        result = 31 * result + (archivedBySender ? 2: 0);
        result = 31 * result + (archivedByReceiver ? 3: 0);
        return result;
    }

    // Getters & Setters

    /*
    * Some of the Setters say say it has no usage, but it's needed otherwise when passing a JSON in Postman
    * it passed the default 'Ignore' value to the database rather than the String in the JSON.
     */
    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent){
        this.messageContent = messageContent;
    }

    public int getThreadId() {
        return threadId;
    }

    public void setThreadId(int threadId) {
        this.threadId = threadId;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        this.isRead = read;
    }

    public String getSenderFullName() {
        return senderFullName;
    }

    public void setSenderFullName(String senderFullName) {
        this.senderFullName = senderFullName;
    }

    public String getSenderCompanyName() {
        return senderCompanyName;
    }

    public void setSenderCompanyName(String senderCompanyName) {
        this.senderCompanyName = senderCompanyName;
    }

    public String getReceiverFullName() {
        return receiverFullName;
    }

    public void setReceiverFullName(String receiverFullName) {
        this.receiverFullName = receiverFullName;
    }

    public String getReceiverCompanyName() {
        return receiverCompanyName;
    }

    public void setReceiverCompanyName(String receiverCompanyName) {
        this.receiverCompanyName = receiverCompanyName;
    }

    public boolean isArchivedBySender() {
        return archivedBySender;
    }

    public void setArchivedBySender(boolean archivedBySender) {
        this.archivedBySender = archivedBySender;
    }

    public boolean isArchivedByReceiver() {
        return archivedByReceiver;
    }

    public void setArchivedByReceiver(boolean archivedByReceiver) {
        this.archivedByReceiver = archivedByReceiver;
    }
}
