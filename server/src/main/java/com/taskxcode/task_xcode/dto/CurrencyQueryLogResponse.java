package com.taskxcode.task_xcode.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class CurrencyQueryLogResponse {

    private String currency;
    private String name;
    private OffsetDateTime date;
    private BigDecimal value;

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

    public OffsetDateTime getDate() {
        return date;
    }

    public void setDate(OffsetDateTime date) {
        this.date = date;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}


