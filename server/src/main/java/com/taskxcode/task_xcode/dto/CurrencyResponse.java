package com.taskxcode.task_xcode.dto;

public class CurrencyResponse {

    private double value;

    public CurrencyResponse() {
    }

    public CurrencyResponse(double value) {
        this.value = value;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}