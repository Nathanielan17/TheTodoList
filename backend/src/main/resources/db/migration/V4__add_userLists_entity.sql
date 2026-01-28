create table userLists
(
    id     bigint auto_increment
        primary key,
    name   varchar(250) not null,
    userID bigint       not null,
    listID bigint       not null,
    constraint userLists_lists_id_fk
        foreign key (listID) references lists (id)
            on delete cascade,
    constraint userLists_users_id_fk
        foreign key (userID) references users (id)
            on delete cascade
);