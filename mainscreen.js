document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the name from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser) {
        // Display the username in the header
        const usernameHeader = document.querySelector('.username');
        if (usernameHeader) {
            usernameHeader.textContent = storedUser.name;
        }

        // Display the username in the "Your Username" span
        const yourUsernameSpan = document.querySelector('.users-pet');
        if (yourUsernameSpan) {
            yourUsernameSpan.textContent = `${storedUser.name} - Red Dragon - 0.001%`;
        }

        // Display the username in the notification list
        const notificationList = document.querySelector('.notification');
        if (notificationList) {
            const newNotification = document.createElement('li');
            newNotification.className = 'player-name';
            newNotification.textContent = `${storedUser.name} pulled Red Dragon - 0.001%`;
            notificationList.appendChild(newNotification);
        }
    }
});
