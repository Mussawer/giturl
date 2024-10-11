FROM ubuntu:latest
RUN apt-get update && apt-get install -y git unzip zip curl tar wget nodejs npm  bash
WORKDIR /giturl
COPY package*.json ./
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm install
# RUN apk add git
COPY . .
RUN npm run test

# DO NOT CHANGE ANY BELOW CODE
WORKDIR /
# RUN apk update && apk add bash
COPY run_tests.sh ./
RUN chmod +x /run_tests.sh
ENTRYPOINT ["/bin/bash", "-s"]