package com.taskxcode.task_xcode.service;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.taskxcode.task_xcode.dto.CurrencyRequest;
import com.taskxcode.task_xcode.dto.CurrencyResponse;
import com.taskxcode.task_xcode.entity.QueryLog;
import com.taskxcode.task_xcode.repository.QueryLogRepository;

@Service
public class CurrencyService {

    private final NbpClient nbpClient;
    private final QueryLogRepository queryLogRepository;

    public CurrencyService(NbpClient nbpClient, QueryLogRepository queryLogRepository) {
        this.nbpClient = nbpClient;
        this.queryLogRepository = queryLogRepository;
    }

    public CurrencyResponse getCurrentValue(CurrencyRequest request) {
        double rate = nbpClient.getAverageRateForCode(request.getCurrency());
        QueryLog log = new QueryLog();
        log.setRequesterName(request.getName());
        log.setCurrencyCode(request.getCurrency().toUpperCase());
        log.setValue(rate);
        log.setCreatedAt(OffsetDateTime.now());
        queryLogRepository.save(log);
        return new CurrencyResponse(rate);
    }
}


