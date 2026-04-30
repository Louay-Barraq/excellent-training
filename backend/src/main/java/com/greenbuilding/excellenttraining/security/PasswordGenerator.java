package com.greenbuilding.excellenttraining.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate a BCrypt hash for a given plaintext password.
 *
 * Usage (from the backend/ directory):
 *
 *   ./mvnw compile exec:java \
 *     -Dexec.mainClass="com.greenbuilding.excellenttraining.security.PasswordGenerator" \
 *     -Dexec.args="yourPassword"
 *
 * If no argument is provided, defaults to "admin123".
 */
public class PasswordGenerator {
    public static void main(String[] args) {
        String password = (args.length > 0) ? args[0] : "admin123";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        System.out.println("Password : " + password);
        System.out.println("BCrypt   : " + hash);
    }
}