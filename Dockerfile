FROM ubuntu:22.04


ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update && \
    apt-get install -y locales && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8

ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8

# Install Node.js 22, R, and build dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y r-base r-base-dev && \
    apt-get install -y make gcc g++ python3 && \
    apt-get install -y libssl-dev libcurl4-openssl-dev && \
    apt-get install -y fontconfig fonts-dejavu fonts-liberation && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configure R to use binary packages from Posit Package Manager
# Set CRAN repository to P3M which serves pre-compiled binaries for Ubuntu
RUN echo "options(repos = c(CRAN = 'https://packagemanager.posit.co/cran/__linux__/jammy/latest'))" >> /etc/R/Rprofile.site && \
    echo "options(HTTPUserAgent = sprintf('R/%s R (%s)', getRversion(), paste(getRversion(), R.version\$platform, R.version\$arch, R.version\$os)))" >> /etc/R/Rprofile.site

# Set environment variable to prefer binary packages
ENV R_COMPILE_AND_INSTALL_PACKAGES=never

# Install R packages - will use pre-compiled binaries from P3M
RUN R -e "install.packages(c('ggplot2', 'dplyr', 'readr', 'tidyr', 'pheatmap', 'RColorBrewer', 'base64', 'jsonlite'), dependencies = TRUE)"

WORKDIR /scrp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
