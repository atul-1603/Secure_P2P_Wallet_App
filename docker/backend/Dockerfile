FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /workspace
COPY pom.xml .
RUN mvn -B -DskipTests dependency:go-offline
COPY src ./src

RUN mvn -B -DskipTests clean package -T 1C

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app \
  && useradd --system --gid app app \
  && mkdir -p /app/uploads \
  && chown -R app:app /app

COPY --from=builder --chown=app:app /workspace/target/*.jar /app/app.jar

EXPOSE 8080

USER app

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
