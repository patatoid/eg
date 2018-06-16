IP=${1:-'192.168.0.3'}
echo "propagating IP $IP"
scp -r ~/escape-game/*.js pi@$IP:./escape-game
scp -r ~/escape-game/views/*.js pi@$IP:./escape-game/views/
scp -r ~/escape-game/views/*.html pi@$IP:./escape-game/views/
scp -r ~/escape-game/views/*.css pi@$IP:./escape-game/views/
echo "stopping service IP $IP"
ssh pi@192.168.0.3 "sudo systemctl stop eg"
sleep 1
echo "starting service IP $IP"
ssh pi@192.168.0.3 "sudo systemctl start eg"
