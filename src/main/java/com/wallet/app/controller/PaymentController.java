package com.wallet.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.app.dto.CreatePaymentOrderRequest;
import com.wallet.app.dto.CreatePaymentOrderResponse;
import com.wallet.app.dto.VerifyPaymentRequest;
import com.wallet.app.dto.VerifyPaymentResponse;
import com.wallet.app.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/api/payments", "/payments"})
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.OK)
    public CreatePaymentOrderResponse createOrder(@Valid @RequestBody CreatePaymentOrderRequest request,
                                                  Authentication authentication) {
        return paymentService.createOrder(authentication.getName(), request);
    }

    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.OK)
    public VerifyPaymentResponse verifyPayment(@Valid @RequestBody VerifyPaymentRequest request,
                                               Authentication authentication) {
        return paymentService.verifyPayment(authentication.getName(), request);
    }
}
