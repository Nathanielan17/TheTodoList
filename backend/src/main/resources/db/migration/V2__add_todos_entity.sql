create table todos
(
    id        bigint auto_increment
        primary key,
    task      varchar(300)       null,
    completed BOOL default FALSE not null,
    user_id   bigint             not null,
    constraint todos_users_id_fk
        foreign key (user_id) references users (id)
);
