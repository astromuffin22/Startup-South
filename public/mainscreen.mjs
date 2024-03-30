// Assign DOM els
const usernameHeader = document.querySelector('.username');
const yourUsernameSpan = document.querySelector('.users-pet');
const petsContainer = document.querySelector('.pets');
const mainScreenImages = document.querySelectorAll('.main-screen .picture-box img');
const popup = document.getElementById('popup');
const popupImages = document.querySelectorAll('#popup .picture-box img');
const indicator = document.getElementById('indicator');
const closePopupButton = document.getElementById('closePopupButton');
const counterSpan = document.getElementById('count');

// App info
let totalCasesOpened = 1437;
let isUserSpin = false;
let userLatestPet = null;
let scoresData = [];
const petDatabase = [
    { name: 'Yellow Teddy Bear', chance: 0.90 },
    { name: 'Cool Teddy Bear', chance: 0.08 },
    { name: 'Dragon', chance: 0.02 }
];

// Auth
const storedToken = localStorage.getItem('token');
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

if (!storedToken) {
    document.querySelector("main").classList.add("unauthenticated");
} else {
    fetch('api/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: storedToken,
    })
    .then(response => response.json().then(data => ({
        data:data,
        isOk:response.ok
    })))
    .then(info => {
        if (!info.isOk) {
            alert(info.data.message);
        } else {
            initPage(info.data.user.name);
        }
    })
    .catch(error => console.error('Error:', error));
}

function initPage(username) {
    socket.onopen = function () {
        console.log('WebSocket connection established');
    };
    
    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };
    
    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        if (message.type === 'updateScoreboard') {
            scoresData = message.scores;
            updateNotificationList(scoresData);
        } else if (message.type === 'updateCounter') {
            totalCasesOpened = message.totalCasesOpened;
            counterSpan.textContent = `: ${totalCasesOpened}`;
        }
    };

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

    if (usernameHeader) {
        console.log(username);
        usernameHeader.textContent = username;
    }
    if (yourUsernameSpan) {
        yourUsernameSpan.textContent = `${username} - Red Dragon - 2%`;
    }
    simulateOtherPlayersOpenings();
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
        addPlayerToScoreboard(username, pulledPet.name, chance);

        // Send the spin data over WebSocket connection
        const spinData = { type: 'spin', user: username, pet: pulledPet.name, chance };
        socket.send(JSON.stringify(spinData));
    } catch (error) {
        console.error('Error in simulateSpin:', error);
    }
}

function addPlayerToScoreboard(playerName, pet, chance) {
    const message = {
        type: 'addScore',
        data: { playerName, pet, chance }
    };
    socket.send(JSON.stringify(message));
}

function updateNotificationList(scores) {
    const notificationList = document.querySelector('.notification');
    notificationList.innerHTML = '';

    scores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.classList.add('player-name');
        listItem.textContent = `${score.playerName} pulled ${score.pet} - ${score.chance * 100}%`;
        notificationList.appendChild(listItem);
    });
}

function updateCounter() {
    totalCasesOpened++;
    counterSpan.textContent = `: ${totalCasesOpened}`;

    // Send the updated counter value over WebSocket connection
    const counterData = { type: 'counter', totalCasesOpened };
    socket.send(JSON.stringify(counterData));
}

function updateIndicator(index) {
    indicator.textContent = index + 1;
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
        petsContainer.innerHTML = `<span class="users-pet">${username} - ${userLatestPet} - ${(chance * 100)}%</span>`;
    }
}
