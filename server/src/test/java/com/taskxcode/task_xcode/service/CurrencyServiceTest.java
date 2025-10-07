package com.taskxcode.task_xcode.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.taskxcode.task_xcode.dto.CurrencyRequest;
import com.taskxcode.task_xcode.dto.CurrencyResponse;
import com.taskxcode.task_xcode.entity.QueryLog;
import com.taskxcode.task_xcode.exception.CurrencyNotFoundException;
import com.taskxcode.task_xcode.repository.QueryLogRepository;

@ExtendWith(MockitoExtension.class)
class CurrencyServiceTest {

    @Mock
    private NbpClient nbpClient;

    @Mock
    private QueryLogRepository queryLogRepository;

    @InjectMocks
    private CurrencyService currencyService;

    @Test
    @DisplayName("Zwraca kurs i zapisuje log w repozytorium")
    void returnsRateAndSavesLog() {
        when(nbpClient.getAverageRateForCode("EUR")).thenReturn(4.5d);

        CurrencyRequest req = new CurrencyRequest();
        req.setCurrency("EUR");
        req.setName("Jan Nowak");

        CurrencyResponse resp = currencyService.getCurrentValue(req);

        assertNotNull(resp);
        assertEquals(4.5d, resp.getValue(), 0.0001);

        ArgumentCaptor<QueryLog> captor = ArgumentCaptor.forClass(QueryLog.class);
        verify(queryLogRepository).save(captor.capture());
        QueryLog saved = captor.getValue();
        assertEquals("EUR", saved.getCurrencyCode());
        assertEquals("Jan Nowak", saved.getRequesterName());
        assertEquals(4.5d, saved.getValue(), 0.0001);
        assertNotNull(saved.getCreatedAt());
    }

    @Test
    @DisplayName("Propaguje CurrencyNotFoundException z klienta NBP")
    void propagatesNotFound() {
        when(nbpClient.getAverageRateForCode("XXX")).thenThrow(new CurrencyNotFoundException("XXX"));

        CurrencyRequest req = new CurrencyRequest();
        req.setCurrency("XXX");
        req.setName("Jan Nowak");

        CurrencyNotFoundException ex = assertThrows(CurrencyNotFoundException.class, () -> currencyService.getCurrentValue(req));
        assertNotNull(ex.getMessage());
        verify(queryLogRepository, never()).save(any());
    }
}


