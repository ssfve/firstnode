rm ./nodejs.nohup.out
pkill node
nohup npm start >nodejs.nohup.out 2>&1 &
tail -f -n 50 nodejs.nohup.out
