package com.taskxcode.task_xcode.mapper;

import org.springframework.stereotype.Component;

import com.taskxcode.task_xcode.dto.CurrencyQueryLogResponse;
import com.taskxcode.task_xcode.entity.QueryLog;

@Component
public class CurrencyMapper {

    public CurrencyQueryLogResponse toDto(QueryLog entity) {
        if (entity == null) {
            return null;
        }
        
        CurrencyQueryLogResponse dto = new CurrencyQueryLogResponse();
        dto.setCurrency(entity.getCurrencyCode());
        dto.setName(entity.getRequesterName());
        dto.setDate(entity.getCreatedAt());
        dto.setValue(entity.getValue());
        
        return dto;
    }
}
