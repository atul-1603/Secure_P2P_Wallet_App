package com.wallet.app.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wallet.app.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

        @Query("""
                SELECT u FROM User u
                WHERE u.status = 'ACTIVE'
                    AND (
                        LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
                        OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
                        OR LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
                    )
                ORDER BY u.fullName ASC, u.email ASC
                """)
        List<User> searchActiveUsers(@Param("query") String query, Pageable pageable);
}
