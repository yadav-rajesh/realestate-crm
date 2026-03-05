package com.rajesh.realestatecrm.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
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

//    @GetMapping
//    public List<Property> getAll() {
//        return service.getAll();
//    }
    @GetMapping
    public Page<Property> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return service.getAll(pageable);
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
