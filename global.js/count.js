// Function to start the countdown
function startCountdown(hours, minutes) {
    let targetTime = localStorage.getItem('targetTime');

    if (!targetTime) {
        // Calculate the target time in milliseconds
        targetTime = new Date().getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
        localStorage.setItem('targetTime', targetTime);
    }

    // Update the countdown every second
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        // Time calculations for hours, minutes, and seconds
        const hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="countdown"
        document.getElementById("countdown").innerHTML = hoursLeft + "(Jam)" +
            minutesLeft + "(Menit)" + secondsLeft + "";

         // If the countdown is over, display "EXPIRED" and clear the interval
         if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "PRESENSI DI TUTUP";

            // Hide the main content and show the hidden content
            document.getElementById("main-content").style.display = "none";
            document.getElementById("hidden-content").style.display = "block";

            // Store display status in localStorage
            localStorage.setItem('contentDisplayed', 'hidden');

            // Clear the target time from localStorage
            localStorage.removeItem('targetTime');
        }
    }, 1000);
}

// Check localStorage for display status
window.onload = () => {
    if (localStorage.getItem('contentDisplayed') === 'hidden') {
        document.getElementById("main-content").style.display = "none";
        document.getElementById("hidden-content").style.display = "block";
    } else {
        document.getElementById("main-content").style.display = "block";
        startCountdown(0, 1); // Example: 1 hour for testing
    }
};