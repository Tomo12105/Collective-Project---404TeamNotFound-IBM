package com.autominutes.task;

import com.autominutes.task.dto.TaskDtos;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/api/meetings/{meetingId}/tasks")
    public TaskDtos.TaskResponse create(@PathVariable Long meetingId, @Valid @RequestBody TaskDtos.CreateTaskRequest req) {
        Task t = taskService.create(meetingId, req);
        return toResponse(t);
    }

    @GetMapping("/api/tasks/{taskId}")
    public TaskDtos.TaskResponse get(@PathVariable Long taskId) {
        return toResponse(taskService.get(taskId));
    }

    @PutMapping("/api/tasks/{taskId}")
    public TaskDtos.TaskResponse update(@PathVariable Long taskId, @Valid @RequestBody TaskDtos.UpdateTaskRequest req) {
        return toResponse(taskService.update(taskId, req));
    }

    @PatchMapping("/api/tasks/{taskId}/status")
    public TaskDtos.TaskResponse updateStatus(@PathVariable Long taskId, @Valid @RequestBody TaskDtos.UpdateTaskStatusRequest req) {
        return toResponse(taskService.updateStatus(taskId, req));
    }

    @DeleteMapping("/api/tasks/{taskId}")
    public void delete(@PathVariable Long taskId) {
        taskService.delete(taskId);
    }

    private TaskDtos.TaskResponse toResponse(Task t) {
        return new TaskDtos.TaskResponse(
                t.getId(),
                t.getDescription(),
                t.getStatus().name(),
                t.getDeadline() == null ? null : t.getDeadline().toString(),
                t.getMeeting().getId(),
                t.getAssignee() == null ? null : new TaskDtos.Assignee(t.getAssignee().getId(), t.getAssignee().getUsername())
        );
    }
}
