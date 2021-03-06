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
git pull --rebase pascal master

echo 'push to local repository'
git push local master

echo 'pacakging application'
npm i --production

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
git pull --rebase local master

echo 'packaging application'
rm -rf ./node_modules
scp -r pi@192.168.0.2:/home/pi/escape-game/node_modules ./node_modules

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
git pull --rebase local master

echo 'packaging application'
rm -rf ./node_modules
scp -r pi@192.168.0.2:/home/pi/escape-game/node_modules ./node_modules

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
git pull --rebase local master

echo 'packaging application'
rm -rf ./node_modules
scp -r pi@192.168.0.2:/home/pi/escape-game/node_modules ./node_modules

echo 'starting service'
sudo service eg start
EOF
