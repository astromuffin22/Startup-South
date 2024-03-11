document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const usernameHeader = document.querySelector('.username');
    const yourUsernameSpan = document.querySelector('.users-pet');
    const petsContainer = document.querySelector('.pets');

    const mainScreenImages = document.querySelectorAll('.main-screen .picture-box img');
    const popup = document.getElementById('popup');
    const popupImages = document.querySelectorAll('#popup .picture-box img');
    const indicator = document.getElementById('indicator');
    const closePopupButton = document.getElementById('closePopupButton');
    const counterSpan = document.getElementById('count');

    let totalCasesOpened = 1437;
    let isUserSpin = false;
    let userLatestPet = null;

    const petDatabase = [
        { name: 'Yellow Teddy Bear', chance: 0.90 },
        { name: 'Cool Teddy Bear', chance: 0.08 },
        { name: 'Dragon', chance: 0.02 }
    ];

    function openPopup() {
        popup.style.display = 'block';
    }

    function closePopup() {
        if (isUserSpin) {
            popup.style.display = 'none';
            isUserSpin = false;
        }
    }

    function addPlayerToScoreboard(playerName, pet) {
        fetch('/api/addScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName, pet }),
        });
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

            userLatestPet = pulledPet.name;

            displayMostRecentPet();

            updateCounter();

            addPlayerToScoreboard(storedUser.name, pulledPet.name);
        }, 5000);
    }

    function simulateOtherPlayersOpenings() {
        const players = [
            { name: 'Bob', pet: 'Yellow Teddy Bear - 0.90%' },
            { name: 'Lenicha_likes_you', pet: 'Lame Teddy Bear - 15%' },
            { name: 'Your_not_cool', pet: 'Cool Teddy Bear - 5%' },
            { name: 'Bob', pet: 'Yellow Teddy Bear - 0.01%' },
            { name: 'Lenicha_likes_you', pet: 'Lame Teddy Bear - 13%' },
            { name: 'Your_not_cool', pet: 'Cool Teddy Bear - 2%' },
            { name: 'Bob', pet: 'Yellow Teddy Bear - 0.12%' },
            { name: 'Lenicha_likes_you', pet: 'Lame Teddy Bear - 1%' },
            { name: 'Your_not_cool', pet: 'Cool Teddy Bear - 9%' },
        ];

        players.forEach((player, index) => {
            setTimeout(() => {
                addPlayerToScoreboard(player.name, player.pet);
            }, index * 1000);
        });
    }

    function getRandomPetFromImage(imageId) {
        const petName = document.getElementById(imageId).dataset.pet;

        return petDatabase.find(p => p.name === petName) || { name: 'Fallback Pet', chance: 0.001 };
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

    if (storedUser) {
        if (usernameHeader) {
            usernameHeader.textContent = storedUser.name;
        }

        if (yourUsernameSpan) {
            yourUsernameSpan.textContent = `${storedUser.name} - Red Dragon - 0.001%`;
        }

        simulateOtherPlayersOpenings();
    }
});
