package com.rajesh.realestatecrm.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin
public class PropertyController {

    private final PropertyService service;

    @PostMapping
    public Property create(@RequestBody Property property) {
        return service.save(property);
    }

    @GetMapping
    public List<Property> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public Property update(@PathVariable Long id, @RequestBody Property property) {
        return service.update(id, property);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}