package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.model.Favorite;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.FavoriteRepository;
import com.rajesh.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository repository;
    private final UserRepository userRepository;

    public Favorite saveForUser(String username, Long propertyId){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Favorite favorite = new Favorite();
        favorite.setUserId(user.getId());
        favorite.setPropertyId(propertyId);

        return repository.save(favorite);
    }

    public List<Favorite> getByUser(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return repository.findByUserId(user.getId());
    }
}
