package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.UserRepository;
import com.rajesh.realestatecrm.util.PhoneUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AgentOwnerPasswordSync {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public void syncAgentOwnerPasswords() {
        List<User> users = userRepository.findByRoleIn(List.of("AGENT", "OWNER"));

        for (User user : users) {
            String normalizedPhone = PhoneUtil.normalizeIndianMobileOrNull(user.getPhone());
            if (normalizedPhone == null) {
                continue;
            }

            if (!isEncodedPhonePassword(user, normalizedPhone)) {
                user.setPassword(passwordEncoder.encode(normalizedPhone));
                userRepository.save(user);
            }
        }
    }

    private boolean isEncodedPhonePassword(User user, String normalizedPhone) {
        if (user.getPassword() == null) {
            return false;
        }
        try {
            return passwordEncoder.matches(normalizedPhone, user.getPassword());
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
