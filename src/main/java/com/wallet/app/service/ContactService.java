package com.wallet.app.service;

import java.util.List;
import java.util.UUID;

import com.wallet.app.dto.ContactResponse;
import com.wallet.app.dto.ContactUpsertRequest;

public interface ContactService {

    ContactResponse addContact(String username, ContactUpsertRequest request);

    ContactResponse updateContact(String username, UUID contactId, ContactUpsertRequest request);

    void deleteContact(String username, UUID contactId);

    List<ContactResponse> getContacts(String username, String query);
}