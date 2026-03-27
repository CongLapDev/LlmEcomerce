package com.nhs.individual.repository;

import com.nhs.individual.domain.User;
import io.micrometer.common.lang.NonNull;
import io.micrometer.common.lang.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    @Query(value = "select * from user where id in (select user_id from account  where id=?1) ",nativeQuery = true)
    User findByAccount_id(int accountId);
    @NonNull
    Page<User> findAll(@Nullable Specification<User> specification, @NonNull Pageable pageable);
    @Query(value = "select * from user where (email=?1 or phone_number=?2) and ?1 is not null and ?2 is not null and trim(?1)<>'' and trim(?2)<>''",nativeQuery = true)
    Optional<User> findAllByEmailOrPhoneNumber(String email, String phoneNumber);

    @Query(value = "select * from user where id<>?1 and (email=?2 or phone_number=?3) and ?2 is not null and ?3 is not null and trim(?2)<>'' and trim(?3)<>''",nativeQuery = true)
    Optional<User> findAllByEmailOrPhoneNumber(Integer userId,String email, String phoneNumber);

    @Query(value = """
            SELECT COUNT(*)
            FROM `user` u
            WHERE u.created_at >= :fromDate
              AND u.created_at < :toDate
            """, nativeQuery = true)
    Long countRegisteredUsersBetween(
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate
    );

        @Query(value = """
                        SELECT u.id AS userId,
                                   u.created_at AS createdAt,
                                   u.firstname AS firstName,
                                   u.lastname AS lastName
                        FROM `user` u
                        WHERE u.created_at IS NOT NULL
                          AND u.created_at >= '2000-01-01'
                        ORDER BY u.created_at DESC, u.id DESC
                        LIMIT :limit
                        """, nativeQuery = true)
        java.util.List<RecentUserActivityProjection> findRecentUserActivities(@Param("limit") Integer limit);

    @Query(value = """
            SELECT u.id AS userId,
                   u.firstname AS firstName,
                   u.lastname AS lastName,
                   u.email AS email
            FROM `user` u
            WHERE LOWER(CONCAT(COALESCE(u.firstname, ''), ' ', COALESCE(u.lastname, ''))) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(COALESCE(u.email, '')) LIKE LOWER(CONCAT('%', :query, '%'))
            ORDER BY u.id DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<GlobalSearchUserProjection> searchUsersForAdmin(
            @Param("query") String query,
            @Param("limit") Integer limit
    );

        interface RecentUserActivityProjection {
                Integer getUserId();

                java.sql.Timestamp getCreatedAt();

                String getFirstName();

                String getLastName();
        }

        interface GlobalSearchUserProjection {
                Integer getUserId();

                String getFirstName();

                String getLastName();

                String getEmail();
        }
}
