package com.taskxcode.task_xcode.service;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.taskxcode.task_xcode.exception.CurrencyNotFoundException;
import com.taskxcode.task_xcode.exception.ExternalApiException;


@Component
public class NbpClient {

    private static final Logger log = LoggerFactory.getLogger(NbpClient.class);

    private final RestTemplate restTemplate;

    @Value("${nbp.api.url}")
    private String nbpApiUrl;

    public NbpClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable(value = "currencyRates", key = "#currencyCode")
    public BigDecimal getAverageRateForCode(String currencyCode) {
        log.info("Fetching currency rate for: {}", currencyCode);
        
        try {
            ResponseEntity<NbpTable[]> response = restTemplate.getForEntity(nbpApiUrl, NbpTable[].class);
            NbpTable[] tables = response.getBody();
            
            if (tables == null || tables.length == 0) {
                log.warn("Empty response from NBP API for currency: {}", currencyCode);
                throw new CurrencyNotFoundException(currencyCode);
            }
            
            String codeUpper = currencyCode.toUpperCase();
            for (NbpTable table : tables) {
                for (NbpRate rate : table.getRates()) {
                    if (codeUpper.equalsIgnoreCase(rate.getCode())) {
                        log.info("Found rate for {}: {}", currencyCode, rate.getMid());
                        return rate.getMid();
                    }
                }
            }
            
            log.warn("Currency not found in NBP API: {}", currencyCode);
            throw new CurrencyNotFoundException(currencyCode);
            
        } catch (RestClientException ex) {
            log.error("Failed to fetch data from NBP API", ex);
            throw new ExternalApiException("Failed to fetch currency data from NBP API", ex);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NbpTable {
        private String table;
        private String no;
        private String effectiveDate;
        private List<NbpRate> rates;

        public String getTable() {
            return table;
        }

        public void setTable(String table) {
            this.table = table;
        }

        public String getNo() {
            return no;
        }

        public void setNo(String no) {
            this.no = no;
        }

        public String getEffectiveDate() {
            return effectiveDate;
        }

        public void setEffectiveDate(String effectiveDate) {
            this.effectiveDate = effectiveDate;
        }

        public List<NbpRate> getRates() {
            return rates;
        }

        public void setRates(List<NbpRate> rates) {
            this.rates = rates;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NbpRate {
        private String currency;
        
        @JsonProperty("code")
        private String code;
        
        @JsonProperty("mid")
        private BigDecimal mid;

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public BigDecimal getMid() {
            return mid;
        }

        public void setMid(BigDecimal mid) {
            this.mid = mid;
        }
    }
}


