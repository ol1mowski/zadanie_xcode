package com.taskxcode.task_xcode.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.taskxcode.task_xcode.exception.CurrencyNotFoundException;

@Component
public class NbpClient {

    private final RestTemplate restTemplate;

    public NbpClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double getAverageRateForCode(String currencyCode) {
        String url = "http://api.nbp.pl/api/exchangerates/tables/A?format=json";
        ResponseEntity<NbpTable[]> response = restTemplate.getForEntity(url, NbpTable[].class);
        NbpTable[] tables = response.getBody();
        if (tables == null || tables.length == 0) {
            throw new CurrencyNotFoundException(currencyCode);
        }
        String codeUpper = currencyCode.toUpperCase();
        for (NbpTable table : tables) {
            for (NbpRate rate : table.rates) {
                if (codeUpper.equalsIgnoreCase(rate.code)) {
                    return rate.mid;
                }
            }
        }
        throw new CurrencyNotFoundException(currencyCode);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NbpTable {
        public String table;
        public String no;
        public String effectiveDate;
        public List<NbpRate> rates;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NbpRate {
        public String currency;
        @JsonProperty("code")
        public String code;
        @JsonProperty("mid")
        public double mid;
    }
}


