package com.autominutes.ai;

import com.autominutes.meeting.Meeting;
import jakarta.persistence.*;

@Entity
@Table(name = "ai_results")
public class AIResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meeting_id", nullable = false, unique = true)
    private Meeting meeting;

    @Column(columnDefinition = "text")
    private String summary;

    @Column(columnDefinition = "text")
    private String detailedNotes;

    @Column(columnDefinition = "text")
    private String decisions;

    @Column(columnDefinition = "text")
    private String followUpNotes;

    public Long getId()                    { return id; }
    public Meeting getMeeting()            { return meeting; }
    public void setMeeting(Meeting m)      { this.meeting = m; }
    public String getSummary()             { return summary; }
    public void setSummary(String s)       { this.summary = s; }
    public String getDetailedNotes()       { return detailedNotes; }
    public void setDetailedNotes(String s) { this.detailedNotes = s; }
    public String getDecisions()           { return decisions; }
    public void setDecisions(String s)     { this.decisions = s; }
    public String getFollowUpNotes()       { return followUpNotes; }
    public void setFollowUpNotes(String s) { this.followUpNotes = s; }
}