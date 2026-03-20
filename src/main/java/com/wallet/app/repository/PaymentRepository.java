package com.wallet.app.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wallet.app.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(String orderId);

    Optional<Payment> findByPaymentId(String paymentId);

    @Query(value = "SELECT * FROM payments WHERE order_id = :orderId FOR UPDATE", nativeQuery = true)
    Optional<Payment> findByOrderIdForUpdate(@Param("orderId") String orderId);
}
