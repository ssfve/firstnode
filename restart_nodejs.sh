rm ./nodejs.nohup.out
pkill node
nohup npm start >nodejs.nohup.out 2>&1 &
<<<<<<< HEAD
=======
tail -f -n 50 nodejs.nohup.out
>>>>>>> c8db78941a1d189956406a8277473371439ea410
