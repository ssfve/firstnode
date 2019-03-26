while true; do
    {
	netstat -antp|grep 3000|grep -v grep
	if [ $? -ne 0 ]
	then
	echo "npm not running restarting..."
	bash restart_nodejs.sh
	else
	echo "running....."
	fi
    } 
    sleep 5
done
