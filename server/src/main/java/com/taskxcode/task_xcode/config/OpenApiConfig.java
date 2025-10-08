package com.taskxcode.task_xcode.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI currencyApiOpenAPI() {
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8080");
        localServer.setDescription("Local development server");

        Contact contact = new Contact();
        contact.setName("Currency API Support");
        contact.setEmail("support@example.com");

        Info info = new Info()
                .title("Currency Exchange Rate API")
                .version("1.0.0")
                .description("REST API for fetching current currency exchange rates from NBP (Narodowy Bank Polski) " +
                            "and managing query logs. Provides endpoints for currency conversion and historical data.")
                .contact(contact);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}
