package com.wallet.app.service;

import com.wallet.app.dto.CreatePaymentOrderRequest;
import com.wallet.app.dto.CreatePaymentOrderResponse;
import com.wallet.app.dto.VerifyPaymentRequest;
import com.wallet.app.dto.VerifyPaymentResponse;

public interface PaymentService {

    CreatePaymentOrderResponse createOrder(String username, CreatePaymentOrderRequest request);

    VerifyPaymentResponse verifyPayment(String username, VerifyPaymentRequest request);
}
