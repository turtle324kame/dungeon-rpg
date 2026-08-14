// ========================================
// MONSTER DUNGEON RPG
// 一人称ダンジョンシステム
// ========================================

// --------------------
// ダンジョン
// --------------------
//
// # = 壁
// . = 通路
// S = 開始地点
//

const map = [
    "###############",
    "#.............#",
    "#.#####.#####.#",
    "#.#.........#.#",
    "#.#.#######.#.#",
    "#.#.....S...#.#",
    "#.#.#######.#.#",
    "#.#.........#.#",
    "#.#####.#####.#",
    "#.............#",
    "###############"
];

const mapWidth = map[0].length;
const mapHeight = map.length;

// --------------------
// プレイヤー
// --------------------

const player = {
    x: 8,
    y: 5,

    // 0 = 北
    // 1 = 東
    // 2 = 南
    // 3 = 西
    direction: 0,

    hp: 100,
    maxHp: 100,
    level: 1
};

// --------------------
// Canvas
// --------------------

const canvas = document.getElementById("dungeonCanvas");
const ctx = canvas.getContext("2d");

// Canvasサイズ
function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    drawDungeon();
}

window.addEventListener("resize", resizeCanvas);

// --------------------
// 壁判定
// --------------------

function isWall(x, y) {

    if (x < 0 ||
        x >= mapWidth ||
        y < 0 ||
        y >= mapHeight) {

        return true;
    }

    return map[y][x] === "#";
}

// --------------------
// 前方の座標
// --------------------

function getForwardPosition() {

    let x = player.x;
    let y = player.y;

    switch (player.direction) {

        case 0:
            y--;
            break;

        case 1:
            x++;
            break;

        case 2:
            y++;
            break;

        case 3:
            x--;
            break;
    }

    return { x, y };
}

// --------------------
// 前進
// --------------------

function moveForward() {

    const next = getForwardPosition();

    if (isWall(next.x, next.y)) {

        showMessage("壁にぶつかった。");

        return;
    }

    player.x = next.x;
    player.y = next.y;

    showMessage("前へ進んだ。");

    drawDungeon();
}

// --------------------
// 後退
// --------------------

function moveBack() {

    const oldDirection = player.direction;

    player.direction =
        (player.direction + 2) % 4;

    moveForward();

    player.direction = oldDirection;

    drawDungeon();
}

// --------------------
// 左を向く
// --------------------

function turnLeft() {

    player.direction =
        (player.direction + 3) % 4;

    showMessage("左を向いた。");

    drawDungeon();
}

// --------------------
// 右を向く
// --------------------

function turnRight() {

    player.direction =
        (player.direction + 1) % 4;

    showMessage("右を向いた。");

    drawDungeon();
}

// ========================================
// 一人称ダンジョン描画
// ========================================

function drawDungeon() {

    const w = canvas.width;
    const h = canvas.height;

    // 背景
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    // 天井
    ctx.fillStyle = "#111";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w * 0.72, h * 0.38);
    ctx.lineTo(w * 0.28, h * 0.38);
    ctx.closePath();

    ctx.fill();

    // 床
    ctx.fillStyle = "#181818";

    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w * 0.72, h * 0.62);
    ctx.lineTo(w * 0.28, h * 0.62);
    ctx.closePath();

    ctx.fill();

    // 奥行き
    drawDepth(1, w, h);

    updateStatus();
}

// ========================================
// 奥行き描画
// ========================================

function drawDepth(depth, w, h) {

    const pos = getPositionAtDepth(depth);

    if (isWall(pos.x, pos.y)) {

        drawWall(depth, w, h);

        return;
    }

    // さらに奥を見る
    if (depth < 6) {

        drawDepth(depth + 1, w, h);
    }
}

// ----------------------------------------
// 深さに応じた座標
// ----------------------------------------

function getPositionAtDepth(depth) {

    let x = player.x;
    let y = player.y;

    switch (player.direction) {

        case 0:
            y -= depth;
            break;

        case 1:
            x += depth;
            break;

        case 2:
            y += depth;
            break;

        case 3:
            x -= depth;
            break;
    }

    return { x, y };
}

// ----------------------------------------
// 壁を描画
// ----------------------------------------

function drawWall(depth, w, h) {

    const scale = 1 / Math.pow(1.55, depth - 1);

    const wallWidth = w * 0.9 * scale;
    const wallHeight = h * 0.75 * scale;

    const centerX = w / 2;
    const centerY = h / 2;

    const left =
        centerX - wallWidth / 2;

    const right =
        centerX + wallWidth / 2;

    const top =
        centerY - wallHeight / 2;

    const bottom =
        centerY + wallHeight / 2;

    ctx.fillStyle = "#292929";

    ctx.fillRect(
        left,
        top,
        wallWidth,
        wallHeight
    );

    ctx.strokeStyle = "#666";
    ctx.lineWidth = Math.max(1, 3 * scale);

    ctx.strokeRect(
        left,
        top,
        wallWidth,
        wallHeight
    );
}

// ========================================
// ステータス
// ========================================

function updateStatus() {

    document.getElementById("hp").textContent =
        player.hp;

    document.getElementById("level").textContent =
        player.level;
}

// ========================================
// メッセージ
// ========================================

function showMessage(text) {

    document.getElementById("message")
        .textContent = text;
}

// ========================================
// ボタン
// ========================================

document
    .getElementById("forward")
    .addEventListener("click", moveForward);

document
    .getElementById("back")
    .addEventListener("click", moveBack);

document
    .getElementById("turnLeft")
    .addEventListener("click", turnLeft);

document
    .getElementById("turnRight")
    .addEventListener("click", turnRight);

// ========================================
// キーボード
// ========================================

document.addEventListener("keydown", function(event) {

    switch (event.key) {

        case "ArrowUp":
        case "w":
        case "W":
            moveForward();
            break;

        case "ArrowDown":
        case "s":
        case "S":
            moveBack();
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            turnLeft();
            break;

        case "ArrowRight":
        case "d":
        case "D":
            turnRight();
            break;
    }
});

// ========================================
// ゲーム開始
// ========================================

resizeCanvas();

showMessage(
    "地下迷宮B1F。探索を開始します。"
);
