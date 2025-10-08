package com.taskxcode.task_xcode.dto;

import java.math.BigDecimal;

public class CurrencyResponse {

    private BigDecimal value;

    public CurrencyResponse() {
    }

    public CurrencyResponse(BigDecimal value) {
        this.value = value;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}