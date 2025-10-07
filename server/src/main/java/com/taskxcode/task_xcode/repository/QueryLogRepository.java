package com.taskxcode.task_xcode.currency.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskxcode.task_xcode.currency.entity.QueryLog;

public interface QueryLogRepository extends JpaRepository<QueryLog, Long> {
}


