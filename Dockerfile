FROM node:22-alpine

# Install R and R-dev
RUN apk upgrade --update && \
    apk add --no-cache R R-dev && \
    apk add --no-cache make gcc g++ python3

ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8

# Install R packages
# RUN R -e "install.packages('shiny', repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('ggplot2', 'dplyr', 'readr', 'jsonlite'), repos = 'http://cran.rstudio.com/')"

WORKDIR /scrp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
