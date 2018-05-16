sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install chromium-browser xserver-xorg xinit matchbox-window-manager --yes
sudo echo "allowed_users=anybody" > /etc/X11/Xwrapper.config
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install libasound2-dev --yes
sudo apt-get install git tmux vim --yes
git clone https://bitbucket.org/leosayous21/escape-game.git
cd ./escape-game
npm install
echo "export DEVICE_NAME='elec'" >> ~/.bashrc
echo "export MAIN_SERVER='192.168.0.6'" >> ~/.bashrc

