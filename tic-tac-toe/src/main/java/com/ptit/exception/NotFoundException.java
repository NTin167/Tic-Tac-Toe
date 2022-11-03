package com.ptit.exception;

public class NotFoundException extends Exception{
    private String message;

    public NotFoundException(String message) {
        this.message = message;
    }

    @Override
    //commit
    public String getMessage() {
        return message;
    }
}
