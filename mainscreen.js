document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    let notificationList;
    let totalCasesOpened = 1437;

    if (storedUser) {
        const usernameHeader = document.querySelector('.username');
        const yourUsernameSpan = document.querySelector('.users-pet');
        notificationList = document.querySelector('.notification');

        const mainScreenImages = document.querySelectorAll('.main-screen .picture-box img');
        const popup = document.getElementById('popup');
        const popupImages = document.querySelectorAll('#popup .picture-box img');
        const indicator = document.getElementById('indicator');
        const closePopupButton = document.getElementById('closePopupButton');
        const counterSpan = document.getElementById('count');

        if (usernameHeader) {
            usernameHeader.textContent = storedUser.name;
        }

        if (yourUsernameSpan) {
            yourUsernameSpan.textContent = `${storedUser.name} - Red Dragon - 0.001%`;
        }

        function openPopup() {
            popup.style.display = 'block';
        }

        function closePopup() {
            popup.style.display = 'none';
        }

        function addPlayerToScoreboard(playerName, pet) {
            const newNotification = document.createElement('li');
            newNotification.className = 'player-name';
            newNotification.textContent = `${playerName} pulled ${pet}`;
            notificationList.appendChild(newNotification);
        
            // Increment the counter immediately
            updateCounter();
        }

        function updateCounter() {
            totalCasesOpened++;
            counterSpan.textContent = `: ${totalCasesOpened}`;
        }

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

        function updateIndicator(index) {
            indicator.textContent = index + 1;
        }

        function simulateSpin() {
            openPopup();

            const spinningInterval = 500;
            let currentImageIndex = Math.floor(Math.random() * popupImages.length);

            const spinIntervalId = setInterval(() => {
                popupImages.forEach((img, index) => {
                    img.style.display = index === currentImageIndex ? 'block' : 'none';
                });

                updateIndicator(currentImageIndex);

                currentImageIndex = (currentImageIndex + 1) % popupImages.length;
            }, spinningInterval);

            setTimeout(() => {
                clearInterval(spinIntervalId);
                addPlayerToScoreboard(storedUser.name, 'New Pet - 0.001%');
                updateCounter();
            }, 5000);
        }

        mainScreenImages.forEach((image) => {
            image.addEventListener('click', () => {
                simulateSpin();
            });
        });

        closePopupButton.addEventListener('click', () => {
            closePopup();
        });
    }
});
