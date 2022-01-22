//Add timestamp to each listitem
export const getTimeStamp = () => {
    let time = new Date();
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let hour = time.getHours();
    let minute = time.getMinutes();

    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    if (hour < 10) {
        hour = '0' + hour
    }

    let created = `${year}-${month}-${day} ${hour}:${minute}h`

    return created;
}

//Day today
export const date = () => {
    var now = new Date();
    var options = { month: "long", weekday: "long", day: "numeric" }
    var newTime = now.toLocaleDateString("en-EN", options)
    let today = newTime
    document.querySelector('.date').textContent = today;
}