window.addEventListener('load',function (){




    updateDateTime();
    setInterval(updateDateTime, 1000);

})


function updateDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    document.getElementById('currentDate').textContent = date;
    document.getElementById('currentTime').textContent = time;
}

