package com.wallet.app.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.app.dto.ContactResponse;
import com.wallet.app.dto.ContactUpsertRequest;
import com.wallet.app.dto.MessageResponse;
import com.wallet.app.service.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/api/contacts", "/contacts"})
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse addContact(@Valid @RequestBody ContactUpsertRequest request,
                                      Authentication authentication) {
        return contactService.addContact(authentication.getName(), request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ContactResponse> getContacts(@RequestParam(value = "query", required = false) String query,
                                             Authentication authentication) {
        return contactService.getContacts(authentication.getName(), query);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ContactResponse updateContact(@PathVariable("id") UUID contactId,
                                         @Valid @RequestBody ContactUpsertRequest request,
                                         Authentication authentication) {
        return contactService.updateContact(authentication.getName(), contactId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MessageResponse deleteContact(@PathVariable("id") UUID contactId,
                                         Authentication authentication) {
        contactService.deleteContact(authentication.getName(), contactId);
        return new MessageResponse("contact deleted successfully");
    }
}