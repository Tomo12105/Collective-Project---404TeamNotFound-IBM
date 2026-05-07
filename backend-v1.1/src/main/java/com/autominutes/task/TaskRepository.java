package com.autominutes.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByMeetingId(Long meetingId);

    @Query("select t from Task t left join fetch t.assignee where t.meeting.id = :meetingId")
    List<Task> findByMeetingIdWithAssignee(Long meetingId);

    @Query("select t from Task t join fetch t.meeting left join fetch t.assignee where t.id = :id")
    Optional<Task> findByIdWithMeetingAndAssignee(Long id);
}
