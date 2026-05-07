package com.autominutes.meeting;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    @Query("select m from Meeting m join fetch m.uploadedBy")
    List<Meeting> findAllWithUploadedBy();

    @Query("select m from Meeting m join fetch m.uploadedBy where m.id = :id")
    Optional<Meeting> findByIdWithUploadedBy(Long id);
}
