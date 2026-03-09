package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.model.PropertyImage;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin
public class PropertyController {

    private final PropertyService service;
    private final PropertyRepository repository;

    @PostMapping
    public Property create(@RequestBody Property property){
        return service.save(property);
    }

    @GetMapping
    public Page<Property> getAll(
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="6") int size){

        Pageable pageable = PageRequest.of(page,size);

        return service.getAll(pageable);
    }

    @GetMapping("/{id}")
    public Property getById(@PathVariable Long id){
        return service.getById(id);
    }

    @GetMapping("/search")
    public Page<Property> search(
            @RequestParam String location,
            @RequestParam(defaultValue="0") int page){

        return repository.findByLocationContainingIgnoreCase(
                location,
                PageRequest.of(page,6)
        );
    }

    @PutMapping("/{id}")
    public Property update(@PathVariable Long id,@RequestBody Property property){
        return service.update(id,property);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

    @PostMapping("/upload/{id}")
    public Property upload(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws Exception{

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String filename = System.currentTimeMillis() + "_" + originalFilename;

        Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads")
                .toAbsolutePath()
                .normalize();
        Files.createDirectories(uploadPath);

        Path destination = uploadPath.resolve(filename);
        file.transferTo(destination.toFile());

        Property property = service.getById(id);

        if (property.getImages() == null) {
            property.setImages(new ArrayList<>());
        }
        PropertyImage image = new PropertyImage();
        image.setImageUrl(filename);
        image.setProperty(property);
        property.getImages().add(image);

        return repository.save(property);
    }

}
