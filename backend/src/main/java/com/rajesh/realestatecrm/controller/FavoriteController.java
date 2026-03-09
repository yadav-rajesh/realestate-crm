package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.FavoriteRequest;
import com.rajesh.realestatecrm.model.Favorite;
import com.rajesh.realestatecrm.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin
public class FavoriteController {

    private final FavoriteService service;

    @PostMapping
    public Favorite add(@RequestBody FavoriteRequest request, Authentication authentication){
        return service.saveForUser(authentication.getName(), request.getPropertyId());
    }

    @GetMapping
    public List<Favorite> get(Authentication authentication){
        return service.getByUser(authentication.getName());
    }
}
