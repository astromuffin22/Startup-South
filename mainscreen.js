document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    let notificationList;
    let totalCasesOpened = 1437;
    let isUserSpin = false;
    let userLatestPet = null;

    const petDatabase = [
        { name: 'Yellow Teddy Bear', chance: 0.1 },
        { name: 'Cool Teddy Bear', chance: 0.05 },
        { name: 'Dragon', chance: 0.001 }
    ];

    let pulledPets = [];

    if (storedUser) {
        const usernameHeader = document.querySelector('.username');
        const yourUsernameSpan = document.querySelector('.users-pet');
        notificationList = document.querySelector('.notification');
        const petsContainer = document.querySelector('.pets');

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
            // Only close the popup if it's a user-initiated spin
            if (isUserSpin) {
                popup.style.display = 'none';
                isUserSpin = false; // Reset the flag after user-initiated spin is complete
            }
            // Add additional logic here if needed for non-user spins
        }

        function addPlayerToScoreboard(playerName, pet) {
            const newNotification = document.createElement('li');
            newNotification.className = 'player-name';
            newNotification.textContent = `${playerName} pulled ${pet}`;
            notificationList.appendChild(newNotification);

            updateCounter();

            pulledPets.push(pet);

            if (isUserSpin) {
                userLatestPet = pet;
                displayMostRecentPet();
            }
        }

        function updateCounter() {
            totalCasesOpened++;
            counterSpan.textContent = `: ${totalCasesOpened}`;
        }

        function updateIndicator(index) {
            indicator.textContent = index + 1;
        }

        function simulateSpin() {
            isUserSpin = true;
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

                const pulledPet = getRandomPetFromImage(`picture-${currentImageIndex + 1}`);

                addPlayerToScoreboard(storedUser.name, pulledPet.name);

                // The popup will not close automatically here

                // Close the popup only for user-initiated spin
                // closePopup();

                // isUserSpin = false;
            }, 5000);
        }

        function simulateOtherPlayersOpenings() {
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

        function getRandomPet() {
            const randomNum = Math.random();

            const totalWeight = petDatabase.reduce((sum, pet) => sum + (1 / pet.chance), 0);

            const weightedRandom = randomNum * totalWeight;

            let cumulativeWeight = 0;
            for (const pet of petDatabase) {
                cumulativeWeight += 1 / pet.chance;
                if (weightedRandom <= cumulativeWeight) {
                    return pet;
                }
            }

            return petDatabase[petDatabase.length - 1];
        }

        function getRandomPetFromImage(imageId) {
            const petName = document.getElementById(imageId).dataset.pet;

            const pet = petDatabase.find(p => p.name === petName);

            return pet || { name: 'Fallback Pet', chance: 0.001 };
        }

        function displayMostRecentPet() {
            if (petsContainer && userLatestPet) {
                const chance = petDatabase.find(p => p.name === userLatestPet)?.chance || 0;
                petsContainer.innerHTML = `<span class="users-pet">${storedUser.name} - ${userLatestPet} - ${(chance * 100).toFixed(3)}%</span>`;
            }
        }

        mainScreenImages.forEach((image) => {
            image.addEventListener('click', () => {
                simulateSpin();
            });
        });

        closePopupButton.addEventListener('click', () => {
            closePopup();
        });

        simulateOtherPlayersOpenings();
    }
});
