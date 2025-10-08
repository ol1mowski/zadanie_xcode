package com.taskxcode.task_xcode.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskxcode.task_xcode.dto.CurrencyQueryLogResponse;
import com.taskxcode.task_xcode.dto.CurrencyRequest;
import com.taskxcode.task_xcode.dto.CurrencyResponse;
import com.taskxcode.task_xcode.service.CurrencyService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/currencies")
public class CurrencyController {

    private static final Logger log = LoggerFactory.getLogger(CurrencyController.class);

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @PostMapping("/get-current-currency-value-command")
    public ResponseEntity<CurrencyResponse> getCurrentCurrency(@Valid @RequestBody CurrencyRequest request) {
        log.info("Received currency request for: {}", request.getCurrency());
        CurrencyResponse response = currencyService.getCurrentValue(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests")
    public ResponseEntity<Page<CurrencyQueryLogResponse>> getAllRequests(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        log.info("Received request to fetch all currency queries");
        return ResponseEntity.ok(currencyService.getAllRequests(pageable));
    }
}