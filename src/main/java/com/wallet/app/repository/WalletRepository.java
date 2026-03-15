package com.wallet.app.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wallet.app.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Optional<Wallet> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    @Query(value = "SELECT * FROM wallets WHERE id = :walletId FOR UPDATE", nativeQuery = true)
    Optional<Wallet> findByIdForUpdate(@Param("walletId") UUID walletId);
}
