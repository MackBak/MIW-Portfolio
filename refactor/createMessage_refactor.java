// NIEUWE SITUATIE NA REFACTOR (MET HELPER METHODES)

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createMessage(
            @RequestHeader("Authorization") String token,
            @RequestBody Message message,
            @RequestParam(value = "receiverUsername", required = false) String receiverUsername)
            throws TokenExpiredException, NoSuchUserException, UnauthorizedAccessException, TokenNotFoundException {

        User sender = authorizationService.authorizeUserByToken(token, "/api/messages/create");
        message.setSender(sender);

        return createResponse(() -> {
            User receiver = messageService.findReceiver(message, receiverUsername);
            if (receiver == null) {
                return errorResponse("Gebruiker met gebruikersnaam " + receiverUsername + " niet gevonden");
            }
            message.setReceiver(receiver);
            boolean isSaved = messageService.saveMessage(message);
            return isSaved ? successResponse("Bericht succesvol verzonden.")
                    : errorResponse("Bericht sturen niet succesvol. Onderwerp of bericht is te lang.");
        });
    }

//HELPER METHODS:
    private ResponseEntity<Map<String, Object>> createResponse(Supplier<Map<String, Object>> responseSupplier) {
        try {
            return ResponseEntity.ok(responseSupplier.get());
        } catch (Exception e) {
            return ResponseEntity.ok(errorResponse("Er is een fout opgetreden " + e.getMessage()));
        }
    }

    private Map<String, Object> successResponse() {
        return createResponseMap(true, "Bericht succesvol verzonden.");
    }

    private Map<String, Object> errorResponse(String message) {
        return createResponseMap(false, message);
    }

    private Map<String, Object> createResponseMap(boolean success, String message) {
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", success);
        responseMap.put("message", message);
        return responseMap;
    }



// OUDE SITUATIE: 1 LANGE METHODE.

    public ResponseEntity<Map<String, Object>> createMessage(
            @RequestHeader("Authorization") String token,
            @RequestBody Message message,
            @RequestParam(value = "receiverUsername", required = false) String receiverUsername)
            throws TokenExpiredException, NoSuchUserException, UnauthorizedAccessException, TokenNotFoundException {

        User sender = authorizationService.authorizeUserByToken(token, "/api/messages/create");
        message.setSender(sender);

        Map<String, Object> responseMap = new HashMap<>();

        try {
            User receiver = messageService.findReceiver(message, receiverUsername);
            if (receiver == null) {
                responseMap.put("success", false);
                responseMap.put("message", "Gebruiker met gebruikersnaam " + receiverUsername + " niet gevonden");
                return ResponseEntity.ok(responseMap);
            }
            message.setReceiver(receiver);
            boolean isSaved = messageService.saveMessage(message);
            if (isSaved) {
                responseMap.put("success", true);
                responseMap.put("message", "Bericht succesvol verzonden.");
            } else {
                responseMap.put("success", false);
                responseMap.put("message", "Bericht sturen niet succesvol. Onderwerp of bericht is te lang.");
            }
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            responseMap.put("success", false);
            responseMap.put("message", "Er is een fout opgetreden " + e.getMessage());
            return ResponseEntity.ok(responseMap);
        }
    }