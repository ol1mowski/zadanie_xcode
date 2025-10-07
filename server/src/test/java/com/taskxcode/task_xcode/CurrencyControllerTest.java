package com.taskxcode.task_xcode;

import java.time.OffsetDateTime;

import static org.hamcrest.Matchers.closeTo;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskxcode.task_xcode.entity.QueryLog;
import com.taskxcode.task_xcode.exception.CurrencyNotFoundException;
import com.taskxcode.task_xcode.repository.QueryLogRepository;
import com.taskxcode.task_xcode.service.NbpClient;

@SpringBootTest
@AutoConfigureMockMvc
class CurrencyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QueryLogRepository queryLogRepository;

    @Autowired
    private NbpClient nbpClient;

    @TestConfiguration
    static class TestConfig {
        @Bean
        NbpClient nbpClient() {
            return Mockito.mock(NbpClient.class);
        }
    }

    @BeforeEach
    void setup() {
        queryLogRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /currencies/get-current-currency-value-command → 200 i zapis do DB")
    void getCurrentCurrency_ok() throws Exception {
        when(nbpClient.getAverageRateForCode("EUR")).thenReturn(4.25d);

        String body = "{" +
                "\"currency\":\"EUR\"," +
                "\"name\":\"Jan Nowak\"" +
                "}";

        mockMvc.perform(post("/currencies/get-current-currency-value-command")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value", is(closeTo(4.25d, 0.0001))));

        var all = queryLogRepository.findAll();
        org.junit.jupiter.api.Assertions.assertEquals(1, all.size());
        QueryLog log = all.get(0);
        org.junit.jupiter.api.Assertions.assertEquals("EUR", log.getCurrencyCode());
        org.junit.jupiter.api.Assertions.assertEquals("Jan Nowak", log.getRequesterName());
        org.junit.jupiter.api.Assertions.assertEquals(4.25d, log.getValue());
        org.junit.jupiter.api.Assertions.assertNotNull(log.getCreatedAt());
    }

    @Test
    @DisplayName("POST /currencies/get-current-currency-value-command → 404 dla nieistniejącej waluty")
    void getCurrentCurrency_notFound() throws Exception {
        when(nbpClient.getAverageRateForCode("XXX")).thenThrow(new CurrencyNotFoundException("XXX"));

        String body = "{" +
                "\"currency\":\"XXX\"," +
                "\"name\":\"Jan Nowak\"" +
                "}";

        mockMvc.perform(post("/currencies/get-current-currency-value-command")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", containsString("Currency not found")));
    }

    @Test
    @DisplayName("GET /currencies/requests → 200 i zwrot listy zapytań")
    void getRequests_ok() throws Exception {
        QueryLog log = new QueryLog();
        log.setRequesterName("Anna Kowalska");
        log.setCurrencyCode("USD");
        log.setValue(3.99d);
        log.setCreatedAt(OffsetDateTime.now());
        queryLogRepository.save(log);

        mockMvc.perform(get("/currencies/requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].currency", notNullValue()))
                .andExpect(jsonPath("$[0].name", notNullValue()))
                .andExpect(jsonPath("$[0].date", notNullValue()))
                .andExpect(jsonPath("$[0].value", notNullValue()));
    }
}


