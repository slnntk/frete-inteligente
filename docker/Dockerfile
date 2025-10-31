# Dockerfile para o Backend (Spring Boot)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copiar arquivos de configuração do Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Baixar dependências (cache layer)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação
RUN mvn clean package -DskipTests

# Imagem final
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Variáveis de ambiente
ENV SPRING_PROFILES_ACTIVE=h2

# Executar aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]

