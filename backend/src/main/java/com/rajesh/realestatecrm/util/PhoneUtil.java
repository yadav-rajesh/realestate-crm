package com.rajesh.realestatecrm.util;

public final class PhoneUtil {

    private PhoneUtil() {
    }

    public static String normalizeIndianMobileRequired(String value, String fieldLabel) {
        String normalized = normalizeIndianMobileOrNull(value);
        if (normalized == null) {
            throw new IllegalArgumentException(fieldLabel + " must be a valid 10-digit mobile number");
        }
        return normalized;
    }

    public static String normalizeIndianMobileOrNull(String value) {
        if (value == null) {
            return null;
        }

        String digits = value.replaceAll("\\D", "");
        if (digits.length() == 12 && digits.startsWith("91")) {
            digits = digits.substring(2);
        }

        if (digits.length() != 10) {
            return null;
        }

        return digits;
    }
}

