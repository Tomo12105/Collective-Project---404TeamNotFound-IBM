package com.autominutes.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class TaskDtos {
    private TaskDtos() {}

    public record CreateTaskRequest(
            @NotBlank @Size(max = 1000) String description,
            String status,
            String deadline,
            Long assigneeUserId
    ) {}

    public record UpdateTaskRequest(
            @NotBlank @Size(max = 1000) String description,
            String status,
            String deadline,
            Long assigneeUserId
    ) {}

    public record UpdateTaskStatusRequest(
            @NotBlank String status
    ) {}

    public record TaskResponse(
            Long id,
            String description,
            String status,
            String deadline,
            Long meetingId,
            Assignee assignee
    ) {}

    public record Assignee(
            Long id,
            String username
    ) {}
}
