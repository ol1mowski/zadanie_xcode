package com.taskxcode.task_xcode.dto;

import jakarta.validation.constraints.NotBlank;

public class CurrencyRequest {

    @NotBlank
    private String currency;

    @NotBlank
    private String name;

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}