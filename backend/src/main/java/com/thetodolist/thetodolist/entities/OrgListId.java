package com.thetodolist.thetodolist.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class OrgListId implements Serializable {
    private static final long serialVersionUID = 226622944591619775L;
    @Column(name = "org_id", nullable = false)
    private Long orgId;

    @Column(name = "list_id", nullable = false)
    private Long listId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrgListId entity = (OrgListId) o;
        return Objects.equals(this.listId, entity.listId) &&
                Objects.equals(this.orgId, entity.orgId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(listId, orgId);
    }

}