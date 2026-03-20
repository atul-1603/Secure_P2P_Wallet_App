package com.wallet.app.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wallet.app.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, UUID> {

    List<Contact> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Contact> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByUserIdAndContactEmail(UUID userId, String contactEmail);

    @Query("""
        SELECT c FROM Contact c
        WHERE c.userId = :userId
          AND (
              LOWER(c.contactName) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', :query, '%'))
          )
        ORDER BY c.createdAt DESC
        """)
    List<Contact> searchByUserId(@Param("userId") UUID userId, @Param("query") String query);
}