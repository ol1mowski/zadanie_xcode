package com.taskxcode.task_xcode.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskxcode.task_xcode.dto.CurrencyRequest;
import com.taskxcode.task_xcode.dto.CurrencyResponse;
import com.taskxcode.task_xcode.service.CurrencyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/currencies")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @PostMapping("/get-current-currency-value-command")
    public ResponseEntity<CurrencyResponse> getCurrentCurrency(@Valid @RequestBody CurrencyRequest request) {
        CurrencyResponse response = currencyService.getCurrentValue(request);
        return ResponseEntity.ok(response);
    }
}


