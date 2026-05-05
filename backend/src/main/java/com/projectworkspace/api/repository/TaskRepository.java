package com.projectworkspace.api.repository;

import com.projectworkspace.api.entity.Task;
import com.projectworkspace.api.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("select t from Task t join fetch t.project join fetch t.assignedTo order by t.dueDate asc")
    List<Task> findAllDetailed();

    @Query("select t from Task t join fetch t.project join fetch t.assignedTo where t.assignedTo.id = :userId order by t.dueDate asc")
    List<Task> findAssignedTasks(@Param("userId") Long userId);

    long countByStatus(TaskStatus status);

    long countByDueDateBeforeAndStatusNot(LocalDate dueDate, TaskStatus status);

    long countByAssignedToId(Long userId);

    long countByAssignedToIdAndStatus(Long userId, TaskStatus status);

    long countByAssignedToIdAndDueDateBeforeAndStatusNot(Long userId, LocalDate dueDate, TaskStatus status);
}
