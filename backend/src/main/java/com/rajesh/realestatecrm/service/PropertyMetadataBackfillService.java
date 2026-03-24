package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class PropertyMetadataBackfillService implements CommandLineRunner {

    private static final Pattern BHK_PATTERN = Pattern.compile("(\\d+)\\s*BHK", Pattern.CASE_INSENSITIVE);
    private static final Pattern AREA_PATTERN = Pattern.compile("(\\d[\\d,]{2,5})\\s*(?:sq\\s*ft|sqft)", Pattern.CASE_INSENSITIVE);

    private final PropertyRepository propertyRepository;

    @Override
    @Transactional
    public void run(String... args) {
        List<Property> properties = propertyRepository.findAll();
        boolean changed = false;

        for (Property property : properties) {
            changed = backfillProperty(property) || changed;
        }

        if (changed) {
            propertyRepository.saveAll(properties);
        }
    }

    private boolean backfillProperty(Property property) {
        boolean changed = false;

        if (property.getBhk() == null) {
            Integer derivedBhk = deriveBhk(property);
            if (derivedBhk != null) {
                property.setBhk(derivedBhk);
                changed = true;
            }
        }

        if (property.getAreaSqft() == null) {
            Integer derivedArea = deriveAreaSqft(property);
            if (derivedArea != null) {
                property.setAreaSqft(derivedArea);
                changed = true;
            }
        }

        List<String> normalizedAmenities = normalizeAmenities(property.getAmenities());
        if (normalizedAmenities.isEmpty()) {
            normalizedAmenities = defaultAmenities(property);
        }

        if (!normalizedAmenities.equals(property.getAmenities())) {
            property.setAmenities(normalizedAmenities);
            changed = true;
        }

        return changed;
    }

    private Integer deriveBhk(Property property) {
        if (isCommercial(property)) {
            return null;
        }

        Matcher matcher = BHK_PATTERN.matcher(getLookupText(property));
        if (matcher.find()) {
            return parseIntSafe(matcher.group(1));
        }

        String type = normalize(property.getType());
        if (type.contains("villa")) {
            return 4;
        }
        if (type.contains("flat") || type.contains("apartment")) {
            return 3;
        }
        if (type.contains("residential") || type.contains("house")) {
            return 3;
        }

        return 2;
    }

    private Integer deriveAreaSqft(Property property) {
        Matcher matcher = AREA_PATTERN.matcher(getLookupText(property));
        if (matcher.find()) {
            return parseIntSafe(matcher.group(1).replace(",", ""));
        }

        if (isCommercial(property)) {
            return 1350;
        }

        Integer bhk = property.getBhk() != null ? property.getBhk() : deriveBhk(property);
        if (bhk == null) {
            return 1250;
        }

        if (bhk <= 1) {
            return 650;
        }
        if (bhk == 2) {
            return 1100;
        }
        if (bhk == 3) {
            return 1550;
        }
        if (bhk == 4) {
            return normalize(property.getType()).contains("villa") ? 3200 : 2400;
        }

        return 3600;
    }

    private List<String> defaultAmenities(Property property) {
        Set<String> amenities = new LinkedHashSet<>();
        amenities.add("24x7 Security");
        amenities.add("Power Backup");
        amenities.add("Parking");
        amenities.add("Water Supply");

        if (isCommercial(property)) {
            amenities.add("High-Speed Internet");
            amenities.add("Visitor Lounge");
            amenities.add("Access Control");
            amenities.add("Reception Lobby");
        } else if (normalize(property.getType()).contains("villa")) {
            amenities.add("Private Garden");
            amenities.add("Covered Parking");
            amenities.add("Clubhouse");
            amenities.add("Landscape View");
        } else {
            amenities.add("Lift Access");
            amenities.add("CCTV");
            amenities.add("Gated Entry");
            amenities.add("Children Play Area");
        }

        return new ArrayList<>(amenities);
    }

    private List<String> normalizeAmenities(List<String> amenities) {
        if (amenities == null || amenities.isEmpty()) {
            return List.of();
        }

        Set<String> normalized = new LinkedHashSet<>();
        for (String amenity : amenities) {
            if (amenity == null) {
                continue;
            }

            String value = amenity.trim();
            if (!value.isEmpty()) {
                normalized.add(value);
            }
        }

        return new ArrayList<>(normalized);
    }

    private boolean isCommercial(Property property) {
        return normalize(property.getType()).contains("commercial");
    }

    private String getLookupText(Property property) {
        return (property.getTitle() == null ? "" : property.getTitle()) + " " +
                (property.getDescription() == null ? "" : property.getDescription());
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private Integer parseIntSafe(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
