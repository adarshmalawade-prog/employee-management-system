FROM jenkins/jenkins:lts

USER root

# Install prerequisites, Docker CLI, and NodeSource Node.js 20.x LTS
RUN apt-get update \
    && apt-get install -y ca-certificates curl gnupg \
    && install -m 0755 -d /etc/apt/keyrings \
    # 1. Docker CLI setup
    && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc \
    && chmod a+r /etc/apt/keyrings/docker.asc \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
       $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
       > /etc/apt/sources.list.d/docker.list \
    # 2. NodeSource Node.js 20.x LTS repository setup
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
       > /etc/apt/sources.list.d/nodesource.list \
    # 3. Install Docker CLI, Docker Compose plugin, and Node.js (with npm)
    && apt-get update \
    && apt-get install -y docker-ce-cli docker-compose-plugin nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Switch back to the non-root jenkins user
USER jenkins
