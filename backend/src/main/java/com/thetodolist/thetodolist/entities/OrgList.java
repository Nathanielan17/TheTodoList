package com.thetodolist.thetodolist.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "org_lists")
public class OrgList {
    @EmbeddedId
    private OrgListId id;

    @MapsId("orgId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization org;

    @MapsId("listId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "list_id", nullable = false)
    private TaskList list;

    @Column(name = "name", nullable = false)
    private String name;

}