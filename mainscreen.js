document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        const usernameHeader = document.querySelector('.username');
        const yourUsernameSpan = document.querySelector('.users-pet');
        const notificationList = document.querySelector('.notification');

        if (usernameHeader) {
            usernameHeader.textContent = storedUser.name;
        }

        if (yourUsernameSpan) {
            yourUsernameSpan.textContent = `${storedUser.name} - Red Dragon - 0.001%`;
        }

        function addPlayerToScoreboard(playerName, pet) {
            const newNotification = document.createElement('li');
            newNotification.className = 'player-name';
            newNotification.textContent = `${playerName} pulled ${pet}`;
            notificationList.appendChild(newNotification);
        }

        // Simulate adding players to the scoreboard
        setTimeout(function () {
            addPlayerToScoreboard('Bob', 'Yellow Teddy Bear - 0.01%');
        }, 1000);

        setTimeout(function () {
            addPlayerToScoreboard('Lenicha_likes_you', 'Lame Teddy Bear - 15%');
        }, 2000);

        setTimeout(function () {
            addPlayerToScoreboard('Your_not_cool', 'Cool Teddy Bear - 5%');
        }, 3000);

        setTimeout(function () {
            addPlayerToScoreboard('Bob', 'Yellow Teddy Bear - 0.01%');
        }, 4000);

        setTimeout(function () {
            addPlayerToScoreboard('Lenicha_likes_you', 'Lame Teddy Bear - 15%');
        }, 5000);

        setTimeout(function () {
            addPlayerToScoreboard('Your_not_cool', 'Cool Teddy Bear - 5%');
        }, 6000);

        setTimeout(function () {
            addPlayerToScoreboard('Bob', 'Yellow Teddy Bear - 0.01%');
        }, 7000);

        setTimeout(function () {
            addPlayerToScoreboard('Lenicha_likes_you', 'Lame Teddy Bear - 15%');
        }, 8000);

        setTimeout(function () {
            addPlayerToScoreboard('Your_not_cool', 'Cool Teddy Bear - 5%');
        }, 9000);
    }
});
