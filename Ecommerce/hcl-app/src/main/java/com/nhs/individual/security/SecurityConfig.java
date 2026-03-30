package com.nhs.individual.security;

import com.nhs.individual.secure.IUserDetail;
import com.nhs.individual.security.Filter.JwtFilter;
import com.nhs.individual.security.Oauth2.Oauth2Service;
import com.nhs.individual.security.Oauth2.Oauth2SuccessHandler;
import com.nhs.individual.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
@Configuration
public class SecurityConfig {

    @Autowired
    private AccountService service;
    
    @Autowired
    private JwtFilter jwtFilter;
    
    @Autowired
    @Lazy
    private Oauth2Service oauth2Service;
    
    @Autowired
    @Lazy
    private Oauth2SuccessHandler oauth2SuccessHandler;

    @Bean
    public LogoutHandler logoutHandler() {
        return new LogoutHandlerCustomize();
    }

    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() {
        return new LogoutSuccessHandlerCustomize();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                // Add JWT filter BEFORE authentication checks
                // This ensures JWT tokens are processed and SecurityContext is set before Spring Security checks auth
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(req -> {
                    // ======================== CRITICAL ========================
                    // IMPORTANT: OPTIONS requests MUST be allowed for CORS preflight
                    // OPTIONS is sent by browser before actual request to check CORS
                    req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    
                    // ======================== PUBLIC ENDPOINTS (No Authentication) ========================
                    
                    // OAuth2 endpoints (required for OAuth flow redirects)
                    req.requestMatchers("/oauth2/**").permitAll();
                    
                    // File uploads (static content)
                    req.requestMatchers("/uploads/**").permitAll();
                    
                    // Authentication endpoints (login, register, refresh token)
                    req.requestMatchers("/login/**").permitAll()
                       .requestMatchers("/api/auth/login").permitAll()
                       .requestMatchers("/auth/**").permitAll()
                       .requestMatchers("/register").permitAll()
                       .requestMatchers("/refresh").permitAll()
                       .requestMatchers("/logout").permitAll()
                       .requestMatchers("/api/v1/auth/logout").permitAll();
                    
                    // Error and health check endpoints
                    req.requestMatchers("/error", "/error/**").permitAll()
                       .requestMatchers("/actuator/**").permitAll()
                       .requestMatchers("/health").permitAll();
                    
                    // API Documentation
                    req.requestMatchers("/swagger-ui/**").permitAll()
                       .requestMatchers("/v3/api-docs/**").permitAll()
                       .requestMatchers("/swagger-resources/**").permitAll()
                       .requestMatchers("/webjars/**").permitAll();
                    
                    // Test endpoints
                    req.requestMatchers("/test/**").permitAll();
                    
                    // ======================== PUBLIC READ APIs (No Auth Required) ========================
                    // CRITICAL: These are the data-fetching endpoints that frontend calls
                    
                    // Categories - public read access (GET only)
                    req.requestMatchers(HttpMethod.GET, "/api/v1/category").permitAll()
                       .requestMatchers(HttpMethod.GET, "/api/v1/category/**").permitAll();
                    
                    // Products - public read access (GET only)
                    req.requestMatchers(HttpMethod.GET, "/api/v1/product").permitAll()
                       .requestMatchers(HttpMethod.GET, "/api/v1/product/**").permitAll()
                       .requestMatchers(HttpMethod.GET, "/api/v2/product").permitAll()
                       .requestMatchers(HttpMethod.GET, "/api/v2/product/**").permitAll();
                    
                    // Comments - public read access (GET only)
                    req.requestMatchers(HttpMethod.GET, "/api/v1/comment").permitAll()
                       .requestMatchers(HttpMethod.GET, "/api/v1/comment/**").permitAll();
                    
                    // Stock - public read access (GET only, POST requires auth)
                    req.requestMatchers(HttpMethod.GET, "/api/v1/stock").permitAll()
                       .requestMatchers(HttpMethod.GET, "/api/v1/stock/**").permitAll();
                    
                    // ======================== PROTECTED ENDPOINTS (Authentication Required) ========================
                    
                    // User-specific endpoints require authentication
                    req.requestMatchers("/api/v1/user/**").authenticated()
                       .requestMatchers("/api/v1/auth/user").authenticated()
                       .requestMatchers("/api/v1/auth/account").authenticated();
                    
                    // Order endpoints require authentication
                    req.requestMatchers("/api/v1/order/**").authenticated()
                       .requestMatchers("/api/v1/orders/**").authenticated()
                       .requestMatchers("/api/v1/order-management/**").authenticated()
                       .requestMatchers("/api/v1/purchase/**").authenticated();
                    
                    // Cart endpoints require authentication
                    req.requestMatchers("/api/v1/cart/**").authenticated();
                    
                    // Payment endpoints require authentication
                    req.requestMatchers("/api/v1/payment/**").authenticated();
                    
                    // Statistics endpoints require authentication
                    req.requestMatchers("/api/v1/statistic/**").authenticated()
                       .requestMatchers("/admin/**").authenticated();
                    
                    // Write operations (POST, PUT, DELETE) for products/categories require authentication
                    req.requestMatchers(HttpMethod.POST, "/api/v1/product").authenticated()
                       .requestMatchers(HttpMethod.PUT, "/api/v1/product/**").authenticated()
                       .requestMatchers(HttpMethod.DELETE, "/api/v1/product/**").authenticated()
                       .requestMatchers(HttpMethod.POST, "/api/v1/category").authenticated()
                       .requestMatchers(HttpMethod.PUT, "/api/v1/category/**").authenticated()
                       .requestMatchers(HttpMethod.DELETE, "/api/v1/category/**").authenticated();
                    
                    // All other requests require authentication
                    req.anyRequest().authenticated();
                })
                .exceptionHandling(ex -> {
                    ex.authenticationEntryPoint(new RestAuthenticationEntryPoint());
                    ex.accessDeniedHandler(new RestAccessDeniedHandler());
                })
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .addLogoutHandler(logoutHandler())
                        .logoutSuccessHandler(logoutSuccessHandler())
                        .permitAll()
                        .clearAuthentication(true)
                        .invalidateHttpSession(false) // STATELESS - no session to invalidate
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/oauth2/authorization/google")
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oauth2Service))
                        .successHandler(oauth2SuccessHandler))
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> service.findByUsername(username)
                .map(IUserDetail::new)
                .orElseThrow(() -> new UsernameNotFoundException(username + " Not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        final DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // DEVELOPMENT: Allow localhost for local testing
        configuration.addAllowedOrigin("http://localhost:3000");      
        configuration.addAllowedOrigin("http://localhost:8085");      
        configuration.addAllowedOrigin("http://127.0.0.1:3000");
        
        // PRODUCTION: Allow Vercel domains (both preview and production)
        // Exact production domain
        configuration.addAllowedOrigin("https://llm-ecomerce.vercel.app");
        configuration.addAllowedOrigin("https://hcl-ecommerce-fe.vercel.app");
        
        // Wildcard pattern for all Vercel preview deployments
        configuration.addAllowedOriginPattern("https://.*\\.vercel\\.app");
        
        // Allow custom domains if deployed elsewhere
        // configuration.addAllowedOrigin("https://yourdomain.com");
        
        // CRITICAL: Methods must include OPTIONS for CORS preflight
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // Allow all headers in requests (including Authorization)
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour
        
        // Allow credentials (cookies, Authorization headers)
        configuration.setAllowCredentials(true);
        
        // Allow private network access (for localhost development)
        configuration.setAllowPrivateNetwork(true);
        
        // Expose these headers in responses so frontend can read them
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
