package com.autominutes.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AIResultRepository extends JpaRepository<AIResult, Long> {
    Optional<AIResult> findByMeetingId(Long meetingId);
}