rm ./nodejs.nohup.out
pkill node
nohup npm start >nodejs.nohup.out 2>&1 &
