#! /bin/bash
    sudo apt-get update -y 
    wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
    sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
    sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common -y
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add - 
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sudo apt update -y
    cd /home/ubuntu/
    curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
    sudo apt-get update && sudo apt-get install yarn -y
    sudo apt -y install nodejs
    cd /home/ubuntu/omni-meet-api/
    npm install
    sudo npm install nodemon -g
    npm i @babel/cli @babel/core @babel/node @babel/preset-env --save-dev
    source .env.local
    nohup npm start 2>/dev/null 1>/dev/null&
