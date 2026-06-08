package ma.enset.elghouali.zakariae.exam_jee.web;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;
    private JwtEncoder jwtEncoder;

    @PostMapping("/login")
    public Map<String, String> login(String username, String password) {
        // 1. Authentifier l'utilisateur
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // 2. Récupérer les rôles (scope)
        Instant instant = Instant.now();
        String scope = authenticate.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.joining(" "));

        // 3. Préparer le contenu du Token (Payload)
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(instant)
                .expiresAt(instant.plus(30, ChronoUnit.MINUTES))
                .subject(username)
                .claim("scope", scope)
                .build();

        // 4. Générer et signer le Token
        String jwt = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();

        // 5. Retourner le Token au format JSON
        return Map.of("access-token", jwt);
    }
}
