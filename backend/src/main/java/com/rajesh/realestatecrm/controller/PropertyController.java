package com.rajesh.realestatecrm.controller;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin
public class PropertyController {

    private final PropertyService service;

    @PostMapping
    public Property create(@Valid @RequestBody Property property) {
        return service.save(property);
    }

    // SEARCH API
    @GetMapping("/search")
    public Page<Property> searchProperties(
            @RequestParam String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return service.searchByLocation(location, pageable);
    }

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

    @GetMapping("/type")
    public Page<Property> filterByType(
            @RequestParam String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return service.filterByType(type, pageable);
    }

    @PutMapping("/{id}")
    public Property update(@PathVariable Long id, @Valid @RequestBody Property property) {
        return service.update(id, property);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
