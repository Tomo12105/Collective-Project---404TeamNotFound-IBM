package com.autominutes.meeting;

import com.autominutes.meeting.dto.MeetingDtos;
import com.autominutes.task.Task;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {
    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping
    public MeetingDtos.MeetingResponse create(@Valid @RequestBody MeetingDtos.CreateMeetingRequest req) {
        Meeting m = meetingService.create(req);
        return toMeetingResponse(m, List.of());
    }

    @GetMapping
    public List<MeetingDtos.MeetingListItem> list() {
        return meetingService.list().stream()
                .map(m -> new MeetingDtos.MeetingListItem(
                        m.getId(),
                        m.getTitle(),
                        new MeetingDtos.UploadedBy(m.getUploadedBy().getId(), m.getUploadedBy().getUsername())
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public MeetingDtos.MeetingResponse get(@PathVariable Long id) {
        Meeting m = meetingService.get(id);
        List<Task> tasks = meetingService.listTasks(id);
        return toMeetingResponse(m, tasks);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        meetingService.delete(id);
    }

    private MeetingDtos.MeetingResponse toMeetingResponse(Meeting m, List<Task> tasks) {
        return new MeetingDtos.MeetingResponse(
                m.getId(),
                m.getTitle(),
                m.getTranscript(),
                new MeetingDtos.UploadedBy(m.getUploadedBy().getId(), m.getUploadedBy().getUsername()),
                tasks.stream()
                        .map(t -> new MeetingDtos.TaskSummary(
                                t.getId(),
                                t.getDescription(),
                                t.getStatus().name(),
                                t.getDeadline() == null ? null : t.getDeadline().toString(),
                                t.getAssignee() == null ? null : new MeetingDtos.Assignee(t.getAssignee().getId(), t.getAssignee().getUsername())
                        ))
                        .toList()
        );
    }
}
