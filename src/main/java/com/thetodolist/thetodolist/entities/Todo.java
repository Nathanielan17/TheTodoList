package com.thetodolist.thetodolist.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "task", length = 300)
    private String task;

    @ColumnDefault("0")
    @Column(name = "completed")
    private Boolean completed = false;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

}