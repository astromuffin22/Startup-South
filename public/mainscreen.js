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
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add score');
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        updateNotificationList(data.scores);
    })
    .catch(error => {
        console.error('Error adding score:', error);
    });
}

    
    function updateNotificationList(scores) {
        const notificationList = document.querySelector('.notification');
        
        notificationList.innerHTML = '';
    
        if (scores) {
            scores.forEach(score => {
                const listItem = document.createElement('li');
                listItem.classList.add('player-name');
                listItem.textContent = `${score.playerName} pulled ${score.pet}`;
                notificationList.appendChild(listItem);
            });
        }
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

        addPlayerToScoreboard(storedUser.name, pulledPet.name);
    } catch (error) {
        console.error('Error in simulateSpin:', error);
    }
}


async function simulateOtherPlayersOpenings() {
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

    await Promise.all(players.map(async (player, index) => {
        await new Promise(resolve => setTimeout(resolve, index * 1000));
        addPlayerToScoreboard(player.name, player.pet);
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
