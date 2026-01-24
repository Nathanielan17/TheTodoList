package com.thetodolist.thetodolist.config;

import lombok.AllArgsConstructor;
import org.springframework.boot.autoconfigure.session.DefaultCookieSerializerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

//@Configuration
@AllArgsConstructor
public class CookieConfig {
    private final JwtConfig jwtConfig;

//    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookiePath("/auth/boii");
//        serializer.setSameSite("Lax");
        serializer.setCookieMaxAge(jwtConfig.getRefreshTokenExpiration());
//        serializer.setUseHttpOnlyCookie(true);
        return serializer;
    }
}
