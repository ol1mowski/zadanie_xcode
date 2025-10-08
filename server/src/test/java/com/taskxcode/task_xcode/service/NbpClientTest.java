package com.taskxcode.task_xcode.service;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.taskxcode.task_xcode.exception.CurrencyNotFoundException;
import com.taskxcode.task_xcode.exception.ExternalApiException;
import com.taskxcode.task_xcode.service.NbpClient.NbpRate;
import com.taskxcode.task_xcode.service.NbpClient.NbpTable;

@ExtendWith(MockitoExtension.class)
class NbpClientTest {

    @Mock
    private RestTemplate restTemplate;

    private NbpClient nbpClient;

    private static final String TEST_URL = "http://api.nbp.pl/api/exchangerates/tables/A?format=json";

    @BeforeEach
    void setUp() {
        nbpClient = new NbpClient(restTemplate);
        ReflectionTestUtils.setField(nbpClient, "nbpApiUrl", TEST_URL);
    }

    @Test
    @DisplayName("Zwraca kurs dla istniejącej waluty")
    void returnsRateForExistingCurrency() {
        NbpTable table = createTestTable();
        NbpTable[] tables = {table};
        
        when(restTemplate.getForEntity(eq(TEST_URL), eq(NbpTable[].class)))
                .thenReturn(new ResponseEntity<>(tables, HttpStatus.OK));

        BigDecimal rate = nbpClient.getAverageRateForCode("EUR");

        assertNotNull(rate);
        assertEquals(0, new BigDecimal("4.2500").compareTo(rate));
    }

    @Test
    @DisplayName("Rzuca CurrencyNotFoundException dla nieistniejącej waluty")
    void throwsNotFoundForNonExistentCurrency() {
        NbpTable table = createTestTable();
        NbpTable[] tables = {table};
        
        when(restTemplate.getForEntity(eq(TEST_URL), eq(NbpTable[].class)))
                .thenReturn(new ResponseEntity<>(tables, HttpStatus.OK));

        assertThrows(CurrencyNotFoundException.class, 
                    () -> nbpClient.getAverageRateForCode("XXX"));
    }

    @Test
    @DisplayName("Rzuca ExternalApiException gdy API NBP jest niedostępne")
    void throwsExternalApiExceptionWhenNbpUnavailable() {
        when(restTemplate.getForEntity(anyString(), eq(NbpTable[].class)))
                .thenThrow(new RestClientException("Connection timeout"));

        assertThrows(ExternalApiException.class, 
                    () -> nbpClient.getAverageRateForCode("EUR"));
    }

    @Test
    @DisplayName("Rzuca CurrencyNotFoundException gdy odpowiedź jest pusta")
    void throwsNotFoundWhenResponseIsEmpty() {
        NbpTable[] tables = {};
        
        when(restTemplate.getForEntity(eq(TEST_URL), eq(NbpTable[].class)))
                .thenReturn(new ResponseEntity<>(tables, HttpStatus.OK));

        assertThrows(CurrencyNotFoundException.class, 
                    () -> nbpClient.getAverageRateForCode("EUR"));
    }

    @Test
    @DisplayName("Ignoruje wielkość liter w kodzie waluty")
    void caseInsensitiveCurrencyCode() {
        NbpTable table = createTestTable();
        NbpTable[] tables = {table};
        
        when(restTemplate.getForEntity(eq(TEST_URL), eq(NbpTable[].class)))
                .thenReturn(new ResponseEntity<>(tables, HttpStatus.OK));

        BigDecimal rate1 = nbpClient.getAverageRateForCode("EUR");
        BigDecimal rate2 = nbpClient.getAverageRateForCode("eur");
        BigDecimal rate3 = nbpClient.getAverageRateForCode("Eur");

        assertEquals(0, rate1.compareTo(rate2));
        assertEquals(0, rate2.compareTo(rate3));
    }

    private NbpTable createTestTable() {
        NbpTable table = new NbpTable();
        table.setTable("A");
        table.setNo("001/A/NBP/2024");
        table.setEffectiveDate("2024-01-01");
        
        NbpRate eurRate = new NbpRate();
        eurRate.setCurrency("euro");
        eurRate.setCode("EUR");
        eurRate.setMid(new BigDecimal("4.2500"));
        
        NbpRate usdRate = new NbpRate();
        usdRate.setCurrency("dolar amerykański");
        usdRate.setCode("USD");
        usdRate.setMid(new BigDecimal("3.9900"));
        
        table.setRates(List.of(eurRate, usdRate));
        
        return table;
    }
}
