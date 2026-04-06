# 1.BASE IMAGE
FROM node:20

# 2.working directory
WORKDIR /server

# 3.dependencies suulgah
COPY package*.json ./
RUN npm install

# 4. source COPY

COPY . .

# 5. port NEMEH
EXPOSE 3000

# 6. START COMMAND 
CMD ["npm", "start"]