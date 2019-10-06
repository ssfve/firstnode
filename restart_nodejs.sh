rm ./nodejs.nohup.out
pkill node
sleep 1
nohup npm start >nodejs.nohup.out 2>&1 &
