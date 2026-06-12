# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
# Crucial: clean ensures maven doesn't use old cached builds
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Explicitly mapping Railway variables to Java System properties
ENTRYPOINT ["java", "-jar", "app.jar"]