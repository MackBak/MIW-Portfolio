public class Message {

    private final int messageId;
    private final User sender;
    private final User receiver;
    private final LocalDateTime dateTime;
    private final String subject;
    private final String messageContent;
    private final int threadId;
    private final boolean isRead;
    private final boolean archivedBySender;
    private final boolean archivedByReceiver;

    private Message(Builder builder) {
        this.messageId = builder.messageId;
        this.sender = builder.sender;
        this.receiver = builder.receiver;
        this.dateTime = builder.dateTime;
        this.subject = builder.subject;
        this.messageContent = builder.messageContent;
        this.threadId = builder.threadId;
        this.isRead = builder.isRead;
        this.archivedBySender = builder.archivedBySender;
        this.archivedByReceiver = builder.archivedByReceiver;
    }

    public static class Builder {
        private int messageId;
        private User sender;
        private User receiver;
        private LocalDateTime dateTime = LocalDateTime.now();
        private String subject = "";
        private String messageContent = "";
        private int threadId;
        private boolean isRead;
        private boolean archivedBySender;
        private boolean archivedByReceiver;

        public Builder messageId(int messageId) {
            this.messageId = messageId;
            return this;
        }

        public Builder sender(User sender) {
            this.sender = sender;
            return this;
        }

        public Builder receiver(User receiver) {
            this.receiver = receiver;
            return this;
        }

        public Builder dateTime(LocalDateTime dateTime) {
            this.dateTime = dateTime;
            return this;
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public Builder messageContent(String messageContent) {
            this.messageContent = messageContent;
            return this;
        }

        public Builder threadId(int threadId) {
            this.threadId = threadId;
            return this;
        }

        public Builder isRead(boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        public Builder archivedBySender(boolean archivedBySender) {
            this.archivedBySender = archivedBySender;
            return this;
        }

        public Builder archivedByReceiver(boolean archivedByReceiver) {
            this.archivedByReceiver = archivedByReceiver;
            return this;
        }

        public Message build() {
            return new Message(this);
        }
    }


    public int getMessageId() {
        return messageId;
    }

    public User getSender() {
        return sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public int getThreadId() {
        return threadId;
    }

    public boolean isRead() {
        return isRead;
    }

    public boolean isArchivedBySender() {
        return archivedBySender;
    }

    public boolean isArchivedByReceiver() {
        return archivedByReceiver;
    }
}