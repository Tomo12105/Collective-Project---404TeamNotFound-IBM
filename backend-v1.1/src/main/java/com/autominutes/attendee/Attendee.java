package com.autominutes.attendee;

import com.autominutes.meeting.Meeting;
import jakarta.persistence.*;

@Entity
@Table(name = "attendees")
public class Attendee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 200)
    private String email;

    @Column(length = 100)
    private String role;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    public Long getId()              { return id; }
    public String getName()          { return name; }
    public void setName(String n)    { this.name = n; }
    public String getEmail()         { return email; }
    public void setEmail(String e)   { this.email = e; }
    public String getRole()          { return role; }
    public void setRole(String r)    { this.role = r; }
    public Meeting getMeeting()      { return meeting; }
    public void setMeeting(Meeting m){ this.meeting = m; }
}