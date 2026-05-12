package com.autominutes.attendee;

import com.autominutes.common.NotFoundException;
import com.autominutes.meeting.MeetingRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings/{meetingId}/attendees")
public class AttendeeController {

    private final AttendeeRepository attendeeRepository;
    private final MeetingRepository  meetingRepository;

    public AttendeeController(AttendeeRepository attendeeRepository, MeetingRepository meetingRepository) {
        this.attendeeRepository = attendeeRepository;
        this.meetingRepository  = meetingRepository;
    }

    public record AttendeeRequest(
            @NotBlank @Size(max = 200) String name,
            String email,
            String role
    ) {}

    public record AttendeeResponse(Long id, String name, String email, String role) {}

    @GetMapping
    public List<AttendeeResponse> list(@PathVariable Long meetingId) {
        if (!meetingRepository.existsById(meetingId))
            throw new NotFoundException("Meeting not found");
        return attendeeRepository.findByMeetingId(meetingId)
                .stream().map(this::toResponse).toList();
    }

    @PostMapping
    public AttendeeResponse create(@PathVariable Long meetingId,
                                   @Valid @RequestBody AttendeeRequest req) {
        var meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new NotFoundException("Meeting not found"));
        var a = new Attendee();
        a.setName(req.name());
        a.setEmail(req.email());
        a.setRole(req.role());
        a.setMeeting(meeting);
        return toResponse(attendeeRepository.save(a));
    }

    @PutMapping("/{attendeeId}")
    public AttendeeResponse update(@PathVariable Long meetingId,
                                   @PathVariable Long attendeeId,
                                   @Valid @RequestBody AttendeeRequest req) {
        var a = attendeeRepository.findById(attendeeId)
                .filter(x -> x.getMeeting().getId().equals(meetingId))
                .orElseThrow(() -> new NotFoundException("Attendee not found"));
        a.setName(req.name());
        a.setEmail(req.email());
        a.setRole(req.role());
        return toResponse(attendeeRepository.save(a));
    }

    @DeleteMapping("/{attendeeId}")
    public void delete(@PathVariable Long meetingId, @PathVariable Long attendeeId) {
        var a = attendeeRepository.findById(attendeeId)
                .filter(x -> x.getMeeting().getId().equals(meetingId))
                .orElseThrow(() -> new NotFoundException("Attendee not found"));
        attendeeRepository.delete(a);
    }

    private AttendeeResponse toResponse(Attendee a) {
        return new AttendeeResponse(a.getId(), a.getName(), a.getEmail(), a.getRole());
    }
}