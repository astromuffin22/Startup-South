document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if(!storedUser){
        document.querySelector("main").classList.add("unauthenticated")
        return
    }

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
    let scoresData = [];

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

    function addPlayerToScoreboard(playerName, pet, chance) {
        fetch('/api/addScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerName, pet, chance }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            if (data && Array.isArray(data.scores)) {
                scoresData = data.scores;
                updateNotificationList(scoresData);
            } else {
                console.log('Invalid scores data:', data);
            }
        })
        .catch(error => {
            console.error('Error adding score:', error);
        });
    }
    
    function updateNotificationList(scores) {
        const notificationList = document.querySelector('.notification');
        notificationList.innerHTML = '';
    
        scores.forEach(score => {
            const listItem = document.createElement('li');
            listItem.classList.add('player-name');
            listItem.textContent = `${score.playerName} pulled ${score.pet} - ${score.chance*100}%`;
            notificationList.appendChild(listItem);
        });
    }

    function updateCounter() {
        totalCasesOpened++;
        counterSpan.textContent = `: ${totalCasesOpened}`;
    }

    function updateIndicator(index) {
        indicator.textContent = index + 1;
    }

    async function simulateSpin() {
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
    
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
            clearInterval(spinIntervalId);
            const pulledPet = getRandomPetFromImage(`picture-${currentImageIndex + 1}`);
            userLatestPet = pulledPet.name;
            displayMostRecentPet();
            updateCounter();
            const chance = petDatabase.find(p => p.name === userLatestPet)?.chance || 0;
            addPlayerToScoreboard(storedUser.name, pulledPet.name, chance);
        } catch (error) {
            console.error('Error in simulateSpin:', error);
        }
    }
    

    async function simulateOtherPlayersOpenings() {
        const players = [
            { name: 'Bob', pet: 'Yellow Teddy Bear', chance: 0.1 },
            { name: 'Lenicha_likes_you', pet: 'Lame Teddy Bear', chance: 0.9 },
            { name: 'Your_not_cool', pet: 'Cool Teddy Bear', chance: 0.5 },
            { name: 'Bob', pet: 'Yellow Teddy Bear', chance: 0.1 },
            { name: 'Lenicha_likes_you', pet: 'Lame Teddy Bear', chance: 0.9 },
            { name: 'Your_not_cool', pet: 'Cool Teddy Bear', chance: 0.5 },
            { name: 'Bob', pet: 'Yellow Teddy Bear', chance: 0.1 },
            { name: 'Lenicha_likes_you', pet: 'Lame Teddy Bear', chance: 0.9 },
            { name: 'Your_not_cool', pet: 'Cool Teddy Bear', chance: 0.5 },
        ];

        await Promise.all(players.map(async (player, index) => {
            await new Promise(resolve => setTimeout(resolve, index * 1000));
            addPlayerToScoreboard(player.name, player.pet, player.chance);
            updateCounter();
        }));
    }

    function getRandomPetFromImage(imageId) {
        const petName = document.getElementById(imageId).dataset.pet;
        return petDatabase.find(p => p.name === petName) || { name: 'Fallback Pet', chance: 0.001 };
    }

    function displayMostRecentPet() {
        if (petsContainer && userLatestPet) {
            const chance = petDatabase.find(p => p.name === userLatestPet)?.chance || 0;
            petsContainer.innerHTML = `<span class="users-pet">${storedUser.name} - ${userLatestPet} - ${(chance * 100)}%</span>`;
        }
    }

    if (mainScreenImages) {
        mainScreenImages.forEach((image) => {
            image.addEventListener('click', () => {
                simulateSpin();
            });
        });
    }

    if (closePopupButton) {
        closePopupButton.addEventListener('click', () => {
            closePopup();
        });
    }

    if (storedUser) {
        if (usernameHeader) {
            usernameHeader.textContent = storedUser.name;
        }
        if (yourUsernameSpan) {
            yourUsernameSpan.textContent = `${storedUser.name} - Red Dragon - 2%`;
        }
        simulateOtherPlayersOpenings();
    }
});
