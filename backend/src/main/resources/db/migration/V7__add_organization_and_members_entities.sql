create table organization
(
    id   bigint auto_increment
        primary key,
    name varchar(255) not null
);

create table organization_members
(
    org_id  bigint not null,
    user_id bigint not null,
    constraint organization_members_pk
        primary key (user_id, org_id),
    constraint organization_members_organization_id_fk
        foreign key (org_id) references organization (id),
    constraint organization_members_users_id_fk
        foreign key (user_id) references users (id)
);