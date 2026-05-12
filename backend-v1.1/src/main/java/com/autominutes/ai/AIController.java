package com.autominutes.ai;

import com.autominutes.common.NotFoundException;
import com.autominutes.meeting.MeetingRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meetings/{meetingId}")
public class AIController {

    private final AIResultRepository aiResultRepository;
    private final MeetingRepository  meetingRepository;

    public AIController(AIResultRepository aiResultRepository, MeetingRepository meetingRepository) {
        this.aiResultRepository = aiResultRepository;
        this.meetingRepository  = meetingRepository;
    }

    public record AIResultResponse(
            String summary, String detailedNotes,
            String decisions, String followUpNotes,
            String processingStatus
    ) {}

    @GetMapping("/results")
    public AIResultResponse getResults(@PathVariable Long meetingId) {
        var result = aiResultRepository.findByMeetingId(meetingId)
                .orElseThrow(() -> new NotFoundException("No AI results yet"));
        return toResponse(result);
    }

    @PostMapping("/process")
    public AIResultResponse process(@PathVariable Long meetingId) {
        var meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new NotFoundException("Meeting not found"));

        // ── STUB: replace this block with real AI call ──────────────────────
        var result = aiResultRepository.findByMeetingId(meetingId)
                .orElseGet(() -> { var r = new AIResult(); r.setMeeting(meeting); return r; });

        result.setSummary("(Stub) Summary of: " + meeting.getTitle());
        result.setDetailedNotes("(Stub) Key discussion points extracted from transcript.");
        result.setDecisions("(Stub) No decisions recorded.");
        result.setFollowUpNotes("(Stub) No follow-up notes.");
        // ────────────────────────────────────────────────────────────────────

        return toResponse(aiResultRepository.save(result));
    }

    private AIResultResponse toResponse(AIResult r) {
        return new AIResultResponse(
                r.getSummary(), r.getDetailedNotes(),
                r.getDecisions(), r.getFollowUpNotes(), "COMPLETED"
        );
    }
}