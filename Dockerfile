FROM node:4.4
MAINTAINER Sreeprakash Neelakantan <sree@schogini.com>
EXPOSE 8080
COPY server.js .
CMD node server.js
# docker build -t schogini/node-hello1:v5 .
# docker login
# docker push schogini/node-hello1:v5
# 
# docker run -d -P --name <sree> schogini/node-hello1:v5
# docker ps | grep <sree>
# curl localhost:<port>
# docker rm -f <container-id>

# kubectl -n <namespace> run node-test --image=docker.io/<docker-user>/hello-node:v5 --port 8080
# kubectl -n <namespace> expose deploy node-test --type="LoadBalancer" --port=80 --target-port=8080
