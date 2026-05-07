package com.autominutes.meeting;

import com.autominutes.common.CurrentUserService;
import com.autominutes.common.NotFoundException;
import com.autominutes.meeting.dto.MeetingDtos;
import com.autominutes.task.Task;
import com.autominutes.task.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MeetingService {
    private final MeetingRepository meetingRepository;
    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;

    public MeetingService(MeetingRepository meetingRepository, TaskRepository taskRepository, CurrentUserService currentUserService) {
        this.meetingRepository = meetingRepository;
        this.taskRepository = taskRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public Meeting create(MeetingDtos.CreateMeetingRequest req) {
        Meeting m = new Meeting();
        m.setTitle(req.title());
        m.setTranscript(req.transcript());
        m.setUploadedBy(currentUserService.requireUser());
        return meetingRepository.save(m);
    }

    @Transactional(readOnly = true)
    public Meeting get(Long id) {
        return meetingRepository.findByIdWithUploadedBy(id).orElseThrow(() -> new NotFoundException("Meeting not found"));
    }

    @Transactional(readOnly = true)
    public List<Meeting> list() {
        return meetingRepository.findAllWithUploadedBy();
    }

    @Transactional
    public void delete(Long id) {
        if (!meetingRepository.existsById(id)) {
            throw new NotFoundException("Meeting not found");
        }
        meetingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Task> listTasks(Long meetingId) {
        if (!meetingRepository.existsById(meetingId)) {
            throw new NotFoundException("Meeting not found");
        }
        return taskRepository.findByMeetingIdWithAssignee(meetingId);
    }
}
