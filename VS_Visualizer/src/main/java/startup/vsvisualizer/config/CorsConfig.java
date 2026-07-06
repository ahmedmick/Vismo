package startup.vsvisualizer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Matches all API endpoints
                        .allowedOrigins("https://visualizer-frontend-production-9da8.up.railway.app", "http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Explicitly include OPTIONS!
                        .allowedHeaders("*") // Allows headers like Content-Type, Authorization, etc.
                        .allowCredentials(true)
                        .maxAge(3600); // Caches the preflight response for 1 hour to reduce extra requests
            }
        };
    }
}
