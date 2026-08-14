// ====================
// ダンジョン設定
// ====================

const width = 15;
const height = 11;

const map = [
    "###############",
    "#.............#",
    "#.#####.#####.#",
    "#.#.........#.#",
    "#.#.#######.#.#",
    "#.#...@.....#.#",
    "#.#.#######.#.#",
    "#.#.........#.#",
    "#.#####.#####.#",
    "#.............#",
    "###############"
];

// ====================
// プレイヤー
// ====================

let player = {
    x: 6,
    y: 5,
    hp: 100,
    maxHp: 100,
    level: 1
};

// ====================
// ダンジョン表示
// ====================

function drawDungeon() {

    const dungeon = document.getElementById("dungeon");

    dungeon.innerHTML = "";

    for (let y = 0; y < height; y++) {

        for (let x = 0; x < width; x++) {

            const cell = document.createElement("div");

            cell.classList.add("cell");

            if (map[y][x] === "#") {
                cell.classList.add("wall");
                cell.textContent = "■";
            } else {
                cell.textContent = "・";
            }

            // プレイヤー
            if (player.x === x && player.y === y) {
                cell.classList.add("player");
                cell.textContent = "▲";
            }

            dungeon.appendChild(cell);
        }
    }

    document.getElementById("hp").textContent = player.hp;
    document.getElementById("level").textContent = player.level;
}

// ====================
// プレイヤー移動
// ====================

function movePlayer(dx, dy) {

    const newX = player.x + dx;
    const newY = player.y + dy;

    // 壁なら移動しない
    if (map[newY][newX] === "#") {

        document.getElementById("message").textContent =
            "壁にぶつかった。";

        return;
    }

    player.x = newX;
    player.y = newY;

    document.getElementById("message").textContent =
        "ダンジョンを探索中……";

    drawDungeon();
}

// ====================
// キーボード操作
// ====================

document.addEventListener("keydown", function(event) {

    switch (event.key) {

        case "ArrowUp":
        case "w":
        case "W":
            movePlayer(0, -1);
            break;

        case "ArrowDown":
        case "s":
        case "S":
            movePlayer(0, 1);
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            movePlayer(-1, 0);
            break;

        case "ArrowRight":
        case "d":
        case "D":
            movePlayer(1, 0);
            break;
    }

});

// ====================
// スマホ操作
// ====================

document.getElementById("up").addEventListener("click", function() {
    movePlayer(0, -1);
});

document.getElementById("down").addEventListener("click", function() {
    movePlayer(0, 1);
});

document.getElementById("left").addEventListener("click", function() {
    movePlayer(-1, 0);
});

document.getElementById("right").addEventListener("click", function() {
    movePlayer(1, 0);
});

// ====================
// ゲーム開始
// ====================

drawDungeon();
