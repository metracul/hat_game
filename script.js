// Инициализация переменных
let players = [];
let currentIndex = 0;
let timer = null;
let timeLeft = 30;

// Функция для создания полей ввода игроков
const setupPlayers = () => {
    const numPlayers = document.getElementById("numPlayers").value;
    const playersInputDiv = document.getElementById("playersInput");
    playersInputDiv.innerHTML = "";

    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Имя игрока ${i + 1}`;
        input.id = `playerName${i}`;
        playersInputDiv.appendChild(input);
        playersInputDiv.appendChild(document.createElement("br"));
    }

    const startButton = document.createElement("button");
    startButton.textContent = "Начать игру";
    startButton.onclick = startGame;
    playersInputDiv.appendChild(startButton);
};

// Функция для запуска игры
const startGame = () => {
    const numPlayers = document.getElementById("numPlayers").value;
    players = [];

    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById(`playerName${i}`).value || `Игрок ${i + 1}`;
        players.push({ name, score: 0 });
    }

    document.getElementById("setup").style.display = "none";
    document.getElementById("gameInterface").style.display = "block";
    renderPlayerList();
    updatePlayerInfo();
};

// Обновление информации об игроке
const updatePlayerInfo = () => {
    document.getElementById("player").textContent = `Игрок: ${players[currentIndex].name}`;
    document.getElementById("score").textContent = `Очки: ${players[currentIndex].score}`;
};

// Добавление очков текущему и следующему игроку
const addPoint = () => {
    players[currentIndex].score += 1;
    const nextIndex = (currentIndex + 1) % players.length;
    players[nextIndex].score += 1;
    updatePlayerInfo();
    renderPlayerList();
};

// Вычитание очков у текущего игрока
const subtractPoint = () => {
    players[currentIndex].score -= 1;
    updatePlayerInfo();
    renderPlayerList();
};

// Переход к следующему игроку
const nextPlayer = () => {
    currentIndex = (currentIndex + 1) % players.length;
    updatePlayerInfo();
};

// Переход к предыдущему игроку
const prevPlayer = () => {
    currentIndex = (currentIndex - 1 + players.length) % players.length;
    updatePlayerInfo();
};

// Функция для запуска таймера
const startTimer = () => {
    if (timer) clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timer").textContent = `Осталось времени: ${timeLeft} секунд`;
    timer = setInterval(updateTimer, 1000);
};

// Функция для рестарта таймера
const restartTimer = () => {
    if (timer) clearInterval(timer);
    timeLeft = 30;
    document.getElementById("timer").textContent = `Осталось времени: ${timeLeft} секунд`;
    timer = setInterval(updateTimer, 1000);
};

// Обновление таймера
const updateTimer = () => {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById("timer").textContent = `Осталось времени: ${timeLeft} секунд`;
    } else {
        clearInterval(timer);
        document.getElementById("timer").textContent = "Время вышло!";
        alert("30 секунд истекли!");
    }
};

// Отображение списка игроков и настройка перетаскивания
const renderPlayerList = () => {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = "";

    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${player.name}: ${player.score} очков`;
        li.setAttribute("data-index", index);
        playerList.appendChild(li);
    });

    // Настраиваем Sortable с поддержкой сенсорных событий
    Sortable.create(playerList, {
        animation: 150,
        touchStartThreshold: 4, // Порог для сенсорных экранов
        onEnd: evt => {
            const [removed] = players.splice(evt.oldIndex, 1);
            players.splice(evt.newIndex, 0, removed);
            currentIndex = evt.newIndex;
            updatePlayerInfo();
        }
    });
};
