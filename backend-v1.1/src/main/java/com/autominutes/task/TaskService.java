package com.autominutes.task;

import com.autominutes.common.NotFoundException;
import com.autominutes.meeting.Meeting;
import com.autominutes.meeting.MeetingRepository;
import com.autominutes.task.dto.TaskDtos;
import com.autominutes.user.User;
import com.autominutes.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Locale;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, MeetingRepository meetingRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Task create(Long meetingId, TaskDtos.CreateTaskRequest req) {
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(() -> new NotFoundException("Meeting not found"));

        Task t = new Task();
        t.setMeeting(meeting);
        t.setDescription(req.description());
        t.setStatus(parseStatusOrDefault(req.status(), TaskStatus.PENDING));
        t.setDeadline(parseDeadline(req.deadline()));
        t.setAssignee(resolveAssignee(req.assigneeUserId()));
        return taskRepository.save(t);
    }

    @Transactional(readOnly = true)
    public Task get(Long taskId) {
        return taskRepository.findByIdWithMeetingAndAssignee(taskId).orElseThrow(() -> new NotFoundException("Task not found"));
    }

    @Transactional
    public Task update(Long taskId, TaskDtos.UpdateTaskRequest req) {
        Task t = get(taskId);
        t.setDescription(req.description());
        t.setStatus(parseStatusOrDefault(req.status(), t.getStatus()));
        t.setDeadline(parseDeadline(req.deadline()));
        t.setAssignee(resolveAssignee(req.assigneeUserId()));
        return taskRepository.save(t);
    }

    @Transactional
    public Task updateStatus(Long taskId, TaskDtos.UpdateTaskStatusRequest req) {
        Task t = get(taskId);
        t.setStatus(parseStatusOrThrow(req.status()));
        return taskRepository.save(t);
    }

    @Transactional
    public void delete(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new NotFoundException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    private TaskStatus parseStatusOrThrow(String status) {
        try {
            return TaskStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status. Use PENDING, IN_PROGRESS, COMPLETED");
        }
    }

    private TaskStatus parseStatusOrDefault(String status, TaskStatus def) {
        if (status == null || status.isBlank()) return def;
        return parseStatusOrThrow(status);
    }

    private LocalDate parseDeadline(String deadline) {
        if (deadline == null || deadline.isBlank()) return null;
        try {
            return LocalDate.parse(deadline);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid deadline. Use ISO date: YYYY-MM-DD");
        }
    }

    private User resolveAssignee(Long assigneeUserId) {
        if (assigneeUserId == null) return null;
        return userRepository.findById(assigneeUserId)
                .orElseThrow(() -> new NotFoundException("Assignee user not found"));
    }
}
