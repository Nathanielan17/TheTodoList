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
public class OrganizationMemberId implements Serializable {
    private static final long serialVersionUID = 2846015492768754374L;
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "org_id", nullable = false)
    private Long orgId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrganizationMemberId entity = (OrganizationMemberId) o;
        return Objects.equals(this.userId, entity.userId) &&
                Objects.equals(this.orgId, entity.orgId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, orgId);
    }

}