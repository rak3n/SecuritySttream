const TimeConver = (start, end)=>{
    /**
     * Converts string times into a bool to know should tracking be active or not....
     */
    try {
        var startTimeInMin = (parseInt(start.split(':')[0]) * 60) + parseInt(start.split(':')[1]);
        var endTimeInMin = (parseInt(end.split(':')[0]) * 60) + parseInt(end.split(':')[1]);
        if (startTimeInMin > endTimeInMin){
            endTimeInMin += 1440;
        }
        var date = new Date();
        var currentTimeInMin = date.getHours() * 60 + date.getMinutes();

        console.log(currentTimeInMin, startTimeInMin, endTimeInMin);

        if (currentTimeInMin >= startTimeInMin && currentTimeInMin <= endTimeInMin)
        {
            //Tracking of Motion is true;;;;;;
            return true;
        }
        else
        {
            //Tracking of Motion is False;;;;;;;
            return false;
        }
    }
    catch (err){
        console.log(err);
        // Id there is an error, motion tracking is offf;;;;;;;
        return false;
    }
};

export default TimeConver;
