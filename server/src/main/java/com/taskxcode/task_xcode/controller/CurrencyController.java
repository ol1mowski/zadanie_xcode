package com.taskxcode.task_xcode.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
import com.taskxcode.task_xcode.dto.ErrorResponse;
import com.taskxcode.task_xcode.service.CurrencyService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/currencies")
@Tag(name = "Currency", description = "Currency exchange rate operations")
public class CurrencyController {

    private static final Logger log = LoggerFactory.getLogger(CurrencyController.class);

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }


    @Operation(
        summary = "Get current currency exchange rate",
        description = "Fetches the current exchange rate for a specified currency from NBP API and logs the query"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved currency rate",
            content = @Content(schema = @Schema(implementation = CurrencyResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Currency not found",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "503",
            description = "External API unavailable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    @PostMapping("/get-current-currency-value-command")
    public ResponseEntity<CurrencyResponse> getCurrentCurrency(
            @Parameter(description = "Currency request with currency code and requester name", required = true)
            @Valid @RequestBody CurrencyRequest request) {
        log.info("Received currency request for: {} by: {}", request.getCurrency(), request.getName());
        CurrencyResponse response = currencyService.getCurrentValue(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @Operation(
        summary = "Get all currency query logs",
        description = "Retrieves a paginated list of all currency query logs with sorting and filtering options"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved query logs",
            content = @Content(schema = @Schema(implementation = Page.class))
        )
    })
    @GetMapping("/requests")
    public ResponseEntity<Page<CurrencyQueryLogResponse>> getAllRequests(
            @Parameter(description = "Pagination parameters (page, size, sort)", required = false)
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Received request to fetch all currency queries - page: {}, size: {}", 
                 pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(currencyService.getAllRequests(pageable));
    }
}