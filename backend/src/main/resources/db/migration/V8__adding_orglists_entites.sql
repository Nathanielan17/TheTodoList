create table org_lists
(
    org_id  bigint       not null,
    list_id bigint       not null,
    name    varchar(255) not null,
    constraint org_lists_pk
        primary key (org_id, list_id),
    constraint org_lists_organization_id_fk
        foreign key (org_id) references organization (id),
    constraint org_lists_tasklists_id_fk
        foreign key (list_id) references tasklists (id)
);