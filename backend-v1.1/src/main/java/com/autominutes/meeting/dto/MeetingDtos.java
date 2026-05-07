package com.autominutes.meeting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public final class MeetingDtos {
    private MeetingDtos() {}

    public record CreateMeetingRequest(
            @NotBlank @Size(max = 200) String title,
            @NotBlank String transcript
    ) {}

    public record MeetingResponse(
            Long id,
            String title,
            String transcript,
            UploadedBy uploadedBy,
            List<TaskSummary> tasks
    ) {}

    public record MeetingListItem(
            Long id,
            String title,
            UploadedBy uploadedBy
    ) {}

    public record UploadedBy(
            Long id,
            String username
    ) {}

    public record TaskSummary(
            Long id,
            String description,
            String status,
            String deadline,
            Assignee assignee
    ) {}

    public record Assignee(
            Long id,
            String username
    ) {}
}
