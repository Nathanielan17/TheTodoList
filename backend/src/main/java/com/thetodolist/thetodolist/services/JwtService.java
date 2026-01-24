package com.thetodolist.thetodolist.services;

import com.thetodolist.thetodolist.config.JwtConfig;
import com.thetodolist.thetodolist.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@AllArgsConstructor
@Service
public class JwtService {
    private final JwtConfig jwtConfig;

    public String generateAccessToken(User user) {
        return generateToken(user, jwtConfig.getAccessTokenExpiration());
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, jwtConfig.getRefreshTokenExpiration());
    }

    private String generateToken(User user, long tokenExpiration) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + (tokenExpiration * 1000))) // convert tokenExpiration into milliseconds
                .signWith(jwtConfig.getSecretKey())
                .compact();
    }

    public boolean validateToken(String token){
        try {
            var claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        }
        catch (JwtException e){
            System.out.println(e.getMessage());
            return false;
        }

    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserIdFromToken(String token){
        return Long.valueOf(getClaims(token).getSubject());
    }

    public Cookie generateCookie(String refreshToken){
        var cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());

        return cookie;
    }
}
