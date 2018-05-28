FROM node:8
RUN mkdir -p /code
COPY . /code
WORKDIR /code
RUN npm install
CMD node test.js