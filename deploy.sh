ssh pi@192.168.0.2 << EOF
echo 'from 192.168.0.2'
echo 'stoping service'
sudo service eg stop

echo 'syncing app repository'
cd /home/pi/escape-game
git remote remove pascal
git remote add pascal https://github.com/patatoid/eg.git
git remote remove local
git remote add local /home/pi/escape-game.git
git stash
git reset --hard HEAD^^^^^
git pull --rebase pascal creativity-task

echo 'push to local repository'
git push -f local master

# echo 'pacakging application'
# npm i --production

echo 'building front'
cd ./front.vue
npm i
npm run build

echo 'starting service'
sudo service eg start
EOF

ssh pi@192.168.0.3 << EOF
echo 'from 192.168.0.3'
echo 'stoping service'
sudo service eg stop

echo 'syncing repository'
cd /home/pi/escape-game
git remote remove local
git remote add local ssh://pi@192.168.0.2/home/pi/escape-game.git
git stash
git reset --hard HEAD^^^
git pull --rebase local master

# echo 'packaging application'
# rm -rf ./node_modules
# scp -r pi@192.168.0.2:/home/pi/escape-game/node_modules ./node_modules

echo 'building front'
rm -rf ./front.vue/dist
scp -r pi@192.168.0.2:/home/pi/escape-game/front.vue/dist ./front.vue/dist
sed s/\$\{DEVICE_NAME\}/crea1/ -i ./front.vue/dist/js/app.*.js

echo 'starting service'
sudo service eg start
EOF

ssh pi@192.168.0.4 << EOF
echo 'from 192.168.0.4'
echo 'stoping service'
sudo service eg stop

echo 'syncing repository'
cd /home/pi/escape-game
git remote remove local
git remote add local ssh://pi@192.168.0.2/home/pi/escape-game.git
git stash
git reset --hard HEAD^^^
git pull --rebase local master

# echo 'packaging application'
# rm -rf ./node_modules
# scp -r pi@192.168.0.2:/home/pi/escape-game/node_modules ./node_modules

echo 'building front'
rm -rf ./front.vue/dist
scp -r pi@192.168.0.2:/home/pi/escape-game/front.vue/dist ./front.vue/dist
sed s/\$\{DEVICE_NAME\}/crea2/ -i ./front.vue/dist/js/app.*.js

echo 'starting service'
sudo service eg start
EOF

ssh pi@192.168.0.5 << EOF
echo 'from 192.168.0.5'
echo 'stoping service'
sudo service eg stop

echo 'syncing repository'
cd /home/pi/escape-game
git remote remove local
git remote add local ssh://pi@192.168.0.2/home/pi/escape-game.git
git stash
git reset --hard HEAD^^^
git pull --rebase local master

# echo 'packaging application'
# rm -rf ./node_modules
# scp -r pi@192.168.0.2:/home/pi/escape-game/node_modules ./node_modules

echo 'building front'
rm -rf ./front.vue/dist
scp -r pi@192.168.0.2:/home/pi/escape-game/front.vue/dist ./front.vue/dist
sed s/\$\{DEVICE_NAME\}/crea3/ -i ./front.vue/dist/js/app.*.js

echo 'starting service'
sudo service eg start
EOF

ssh pi@192.168.0.2 << EOF
cd /home/pi/escape-game
echo 'building front'
sed s/\$\{DEVICE_NAME\}/main/ -i ./front.vue/dist/js/app.*.js
EOF

ssh pi@192.168.0.2 << EOF
sudo service eg restart
EOF
ssh pi@192.168.0.3 << EOF
sudo service eg restart
EOF
ssh pi@192.168.0.4 << EOF
sudo service eg restart
EOF
ssh pi@192.168.0.5 << EOF
sudo service eg restart
EOF
ssh pi@192.168.0.6 << EOF
sudo service eg restart
EOF

