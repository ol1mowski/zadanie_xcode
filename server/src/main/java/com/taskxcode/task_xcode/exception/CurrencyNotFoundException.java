package com.taskxcode.task_xcode.exception;

public class CurrencyNotFoundException extends RuntimeException {
    public CurrencyNotFoundException(String code) {
        super("Currency not found: " + code);
    }
}


