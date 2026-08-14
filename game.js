// ====================
// ダンジョン設定
// ====================

const width = 15;
const height = 11;

// # = 壁
// . = 床
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
// ダンジョンを表示
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
            }
            else {
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

    // 壁なら移動できない
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
            movePlayer(0, -1);
            break;

        case "ArrowDown":
        case "s":
            movePlayer(0, 1);
            break;

        case "ArrowLeft":
        case "a":
            movePlayer(-1, 0);
            break;

        case "ArrowRight":
        case "d":
            movePlayer(1, 0);
            break;
    }

});

// ====================
// ゲーム開始
// ====================

drawDungeon();
