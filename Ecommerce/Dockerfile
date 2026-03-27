# Stage 1: Build the Maven Project
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /workspace

# Copy the parent pom and all sub-module poms to leverage Docker caching (optional but good practice)
COPY pom.xml .
COPY hcl-api/pom.xml hcl-api/
COPY hcl-payment/pom.xml hcl-payment/
COPY hcl-app/pom.xml hcl-app/

# Copy all source code
COPY . .

# Build the project (skipping tests for faster deployment)
RUN mvn clean package -DskipTests

# Stage 2: Create the final minimal image
FROM openjdk:17-slim
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /workspace/hcl-app/target/*.jar app.jar

EXPOSE 8085

# Use the PORT environment variable provided by Render, fallback to 8085
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=production"]
