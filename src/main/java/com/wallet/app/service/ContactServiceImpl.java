package com.wallet.app.service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wallet.app.dto.ContactResponse;
import com.wallet.app.dto.ContactUpsertRequest;
import com.wallet.app.entity.Contact;
import com.wallet.app.entity.User;
import com.wallet.app.repository.ContactRepository;
import com.wallet.app.repository.UserRepository;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactServiceImpl(ContactRepository contactRepository, UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ContactResponse addContact(String username, ContactUpsertRequest request) {
        User owner = getUserByUsername(username);
        String normalizedEmail = normalizeEmail(request.contactEmail());
        String normalizedName = normalizeName(request.contactName());

        validateContactTarget(owner, normalizedEmail);

        if (contactRepository.existsByUserIdAndContactEmail(owner.getId(), normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "contact already exists");
        }

        Contact contact = new Contact();
        contact.setUserId(owner.getId());
        contact.setContactName(normalizedName);
        contact.setContactEmail(normalizedEmail);

        Contact saved = contactRepository.save(Objects.requireNonNull(contact));
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ContactResponse updateContact(String username, UUID contactId, ContactUpsertRequest request) {
        User owner = getUserByUsername(username);
        Contact contact = contactRepository.findByIdAndUserId(contactId, owner.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "contact not found"));

        String normalizedEmail = normalizeEmail(request.contactEmail());
        String normalizedName = normalizeName(request.contactName());

        validateContactTarget(owner, normalizedEmail);

        if (!contact.getContactEmail().equalsIgnoreCase(normalizedEmail)
            && contactRepository.existsByUserIdAndContactEmail(owner.getId(), normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "contact already exists");
        }

        contact.setContactName(normalizedName);
        contact.setContactEmail(normalizedEmail);

        Contact saved = contactRepository.save(Objects.requireNonNull(contact));
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteContact(String username, UUID contactId) {
        User owner = getUserByUsername(username);
        Contact contact = contactRepository.findByIdAndUserId(contactId, owner.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "contact not found"));

        contactRepository.delete(Objects.requireNonNull(contact));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> getContacts(String username, String query) {
        User owner = getUserByUsername(username);

        List<Contact> contacts;
        if (query == null || query.isBlank()) {
            contacts = contactRepository.findByUserIdOrderByCreatedAtDesc(owner.getId());
        } else {
            contacts = contactRepository.searchByUserId(owner.getId(), query.trim());
        }

        return contacts.stream().map(this::toResponse).toList();
    }

    private void validateContactTarget(User owner, String contactEmail) {
        if (owner.getEmail().equalsIgnoreCase(contactEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot add your own account as contact");
        }

        userRepository.findByEmail(contactEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "contact email is not registered"));
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeName(String name) {
        String normalized = name.trim();
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "contact name cannot be blank");
        }
        return normalized;
    }

    private ContactResponse toResponse(Contact contact) {
        return new ContactResponse(
            contact.getId(),
            contact.getContactName(),
            contact.getContactEmail(),
            contact.getCreatedAt()
        );
    }
}