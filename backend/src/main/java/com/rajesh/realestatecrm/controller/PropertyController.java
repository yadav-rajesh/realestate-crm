package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.PropertyRequest;
import com.rajesh.realestatecrm.dto.PropertyResponse;
import com.rajesh.realestatecrm.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin
public class PropertyController {

    private final PropertyService service;

    @PostMapping
    public PropertyResponse create(@RequestBody PropertyRequest request){
        return service.save(request);
    }

    @GetMapping
    public Page<PropertyResponse> getAll(
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="6") int size){

        Pageable pageable = PageRequest.of(page,size);

        return service.getAll(pageable);
    }

    @GetMapping("/{id}")
    public PropertyResponse getById(@PathVariable Long id){
        return service.getById(id);
    }

    @GetMapping("/search")
    public Page<PropertyResponse> search(
            @RequestParam String location,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="6") int size){

        return service.searchByLocation(location, PageRequest.of(page,size));
    }

    @PutMapping("/{id}")
    public PropertyResponse update(@PathVariable Long id,@RequestBody PropertyRequest request){
        return service.update(id,request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

    @PostMapping("/upload/{id}")
    public PropertyResponse upload(
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

        return service.addImage(id, filename);
    }

}
