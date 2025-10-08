package com.taskxcode.task_xcode.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.OffsetDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskxcode.task_xcode.dto.CurrencyQueryLogResponse;
import com.taskxcode.task_xcode.dto.CurrencyRequest;
import com.taskxcode.task_xcode.dto.CurrencyResponse;
import com.taskxcode.task_xcode.entity.QueryLog;
import com.taskxcode.task_xcode.mapper.CurrencyMapper;
import com.taskxcode.task_xcode.repository.QueryLogRepository;

@Service
public class CurrencyService {

    private static final Logger log = LoggerFactory.getLogger(CurrencyService.class);

    private final NbpClient nbpClient;
    private final QueryLogRepository queryLogRepository;
    private final CurrencyMapper currencyMapper;
    private final Clock clock;

    public CurrencyService(NbpClient nbpClient, QueryLogRepository queryLogRepository, 
                          CurrencyMapper currencyMapper, Clock clock) {
        this.nbpClient = nbpClient;
        this.queryLogRepository = queryLogRepository;
        this.currencyMapper = currencyMapper;
        this.clock = clock;
    }

    @Transactional
    public CurrencyResponse getCurrentValue(CurrencyRequest request) {
        log.info("Processing currency request for {} by {}", request.getCurrency(), request.getName());
        
        BigDecimal rate = nbpClient.getAverageRateForCode(request.getCurrency());
        
        QueryLog queryLog = createQueryLog(request, rate);
        queryLogRepository.save(queryLog);
        
        log.info("Successfully saved query log for currency {} with rate {}", request.getCurrency(), rate);
        
        return new CurrencyResponse(rate);
    }

    private QueryLog createQueryLog(CurrencyRequest request, BigDecimal rate) {
        QueryLog queryLog = new QueryLog();
        queryLog.setRequesterName(request.getName());
        queryLog.setCurrencyCode(request.getCurrency().toUpperCase());
        queryLog.setValue(rate);
        queryLog.setCreatedAt(OffsetDateTime.now(clock));
        return queryLog;
    }

    @Transactional(readOnly = true)
    public Page<CurrencyQueryLogResponse> getAllRequests(Pageable pageable) {
        log.info("Fetching all currency requests with pagination: page={}, size={}", 
                 pageable.getPageNumber(), pageable.getPageSize());
        
        Page<QueryLog> logs = queryLogRepository.findAll(pageable);
        
        log.info("Found {} total currency requests", logs.getTotalElements());
        
        return logs.map(currencyMapper::toDto);
    }
}


