package com.projectworkspace.api.repository;

import com.projectworkspace.api.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("select distinct p from Project p left join fetch p.members where p.id = :id")
    Optional<Project> findDetailedById(@Param("id") Long id);

    @Query("select distinct p from Project p left join fetch p.members order by p.createdAt desc")
    List<Project> findAllDetailed();

    @Query("select distinct p from Project p join p.members m where m.id = :memberId order by p.createdAt desc")
    List<Project> findAssignedProjects(@Param("memberId") Long memberId);
}
