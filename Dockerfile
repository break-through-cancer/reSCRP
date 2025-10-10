FROM node:22-alpine

# Install R and R-dev
RUN apk upgrade --update && \
    apk add --no-cache R R-dev && \
    apk add --no-cache make gcc g++ python3 && \
    apk add --no-cache openssl-dev curl-dev && \
    apk add --no-cache fontconfig ttf-dejavu ttf-liberation

ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8

# Install R packages with dependencies
RUN R -e "install.packages(c('sys', 'askpass', 'openssl', 'ggplot2', 'dplyr', 'readr', 'tidyr', 'pheatmap', 'base64', 'jsonlite'), repos = 'http://cran.rstudio.com/', dependencies = TRUE)"

WORKDIR /scrp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
