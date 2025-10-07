package com.taskxcode.task_xcode.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskxcode.task_xcode.entity.QueryLog;

public interface QueryLogRepository extends JpaRepository<QueryLog, Long> {
}