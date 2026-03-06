package com.rajesh.realestatecrm.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.service.PropertyService;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin
public class PropertyController {

    private final PropertyService service;

    private final String uploadDir = "uploads/";

    // ================= CREATE PROPERTY (NORMAL JSON API) =================
    @PostMapping
    public Property create(@RequestBody Property property) {
        return service.save(property);
    }

    // ================= CREATE PROPERTY WITH IMAGE =================
    @PostMapping("/upload/{id}")
    public Property uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        Property property = service.getById(id);

        String uploadDir = System.getProperty("user.dir") + "/uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        File uploadFile = new File(uploadDir + fileName);
        file.transferTo(uploadFile);

        property.setImage(fileName);

        return service.save(property);
    }

    // ================= GET ALL WITH PAGINATION + SORT =================
    @GetMapping
    public Page<Property> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return service.getAll(pageable);
    }

    // ================= SEARCH =================
    @GetMapping("/search")
    public Page<Property> searchProperties(
            @RequestParam String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return service.searchByLocation(location, pageable);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public Property update(
            @PathVariable Long id,
            @RequestBody Property property
    ) {
        return service.update(id, property);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}