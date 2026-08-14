// ========================================
// MONSTER DUNGEON RPG
// 一人称ダンジョン探索システム
// 疑似3Dレイキャスティング版
// ========================================


// ========================================
// ダンジョンマップ
// ========================================
//
// # = 壁
// . = 通路
// S = スタート地点
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


// ========================================
// プレイヤー
// ========================================

const player = {

    x: 8,
    y: 5,

    // 0 = 北
    // 1 = 東
    // 2 = 南
    // 3 = 西
    direction: 1,

    hp: 100,
    maxHp: 100,
    level: 1
};


// ========================================
// Canvas
// ========================================

const canvas =
    document.getElementById("dungeonCanvas");

const ctx = canvas.getContext("2d");


// ========================================
// Canvasサイズ調整
// ========================================

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width =
        Math.max(320, Math.floor(rect.width));

    canvas.height =
        Math.max(240, Math.floor(rect.height));

    drawDungeon();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


// ========================================
// 壁判定
// ========================================

function isWall(x, y) {

    if (
        x < 0 ||
        y < 0 ||
        x >= mapWidth ||
        y >= mapHeight
    ) {
        return true;
    }

    return map[y][x] === "#";
}


// ========================================
// 移動方向
// ========================================

function getDirectionVector() {

    switch (player.direction) {

        case 0:
            return { x: 0, y: -1 };

        case 1:
            return { x: 1, y: 0 };

        case 2:
            return { x: 0, y: 1 };

        case 3:
            return { x: -1, y: 0 };
    }

    return { x: 0, y: -1 };
}


// ========================================
// 前進
// ========================================

function moveForward() {

    const dir =
        getDirectionVector();

    const nextX =
        player.x + dir.x;

    const nextY =
        player.y + dir.y;

    if (isWall(nextX, nextY)) {

        showMessage("壁にぶつかった。");

        return;
    }

    player.x = nextX;
    player.y = nextY;

    showMessage("前へ進んだ。");

    drawDungeon();
}


// ========================================
// 後退
// ========================================

function moveBack() {

    const dir =
        getDirectionVector();

    const nextX =
        player.x - dir.x;

    const nextY =
        player.y - dir.y;

    if (isWall(nextX, nextY)) {

        showMessage("壁にぶつかった。");

        return;
    }

    player.x = nextX;
    player.y = nextY;

    showMessage("後ろへ下がった。");

    drawDungeon();
}


// ========================================
// 左を向く
// ========================================

function turnLeft() {

    player.direction =
        (player.direction + 3) % 4;

    showMessage("左を向いた。");

    drawDungeon();
}


// ========================================
// 右を向く
// ========================================

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

    const width =
        canvas.width;

    const height =
        canvas.height;


    // ----------------------------
    // 背景
    // ----------------------------

    // 空
    ctx.fillStyle = "#101010";

    ctx.fillRect(
        0,
        0,
        width,
        height / 2
    );


    // ----------------------------
    // 床
    // ----------------------------

    ctx.fillStyle = "#202020";

    ctx.fillRect(
        0,
        height / 2,
        width,
        height / 2
    );


    // ----------------------------
    // 床の遠近線
    // ----------------------------

    drawFloorLines(
        width,
        height
    );


    // ----------------------------
    // レイキャスティング
    // ----------------------------

    castRays(
        width,
        height
    );


    // ----------------------------
    // 画面枠
    // ----------------------------

    ctx.strokeStyle = "#777";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        1,
        1,
        width - 2,
        height - 2
    );


    updateStatus();
}


// ========================================
// 床の遠近線
// ========================================

function drawFloorLines(width, height) {

    ctx.strokeStyle =
        "rgba(130,130,130,0.18)";

    ctx.lineWidth = 1;


    const horizon =
        height * 0.52;


    // 横方向の線

    for (
        let i = 1;
        i <= 7;
        i++
    ) {

        const t =
            i / 7;

        const y =
            horizon +
            Math.pow(t, 1.7) *
            (height - horizon);

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();
    }


    // 縦方向の線

    for (
        let i = -8;
        i <= 8;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            width / 2,
            horizon
        );

        ctx.lineTo(
            width / 2 + i * width,
            height
        );

        ctx.stroke();
    }
}


// ========================================
// レイキャスティング
// ========================================

function castRays(width, height) {

    const FOV =
        Math.PI / 3;

    const rayCount =
        Math.max(
            160,
            Math.floor(width / 2)
        );


    for (
        let ray = 0;
        ray < rayCount;
        ray++
    ) {

        const cameraX =
            (ray / rayCount) * 2 - 1;

        const angle =
            directionToAngle(
                player.direction
            ) +
            cameraX * (FOV / 2);


        const rayDirX =
            Math.cos(angle);

        const rayDirY =
            Math.sin(angle);


        const result =
            castSingleRay(
                rayDirX,
                rayDirY
            );


        if (!result) {
            continue;
        }


        // 魚眼効果を補正

        const playerAngle =
            directionToAngle(
                player.direction
            );

        const correctedDistance =
            result.distance *
            Math.cos(
                angle - playerAngle
            );


        const distance =
            Math.max(
                0.001,
                correctedDistance
            );


        // 壁の高さ

        const wallHeight =
            Math.min(
                height * 1.5,
                height / distance
            );


        const top =
            height / 2 -
            wallHeight / 2;


        // 壁の明るさ

        let brightness =
            1 / (1 + distance * 0.18);


        brightness =
            Math.max(
                0.18,
                Math.min(
                    1,
                    brightness
                )
            );


        // 壁の面によって少し暗くする

        if (result.side === 1) {
            brightness *= 0.72;
        }


        const value =
            Math.floor(
                65 * brightness
            );


        ctx.fillStyle =
            `rgb(${value},${value},${value})`;


        const sliceWidth =
            width / rayCount + 1;


        ctx.fillRect(
            ray * width / rayCount,
            top,
            sliceWidth,
            wallHeight
        );
    }
}


// ========================================
// 1本の光線を飛ばす
// ========================================

function castSingleRay(
    rayDirX,
    rayDirY
) {

    let mapX =
        Math.floor(player.x);

    let mapY =
        Math.floor(player.y);


    const deltaDistX =
        Math.abs(
            1 / (rayDirX || 0.000001)
        );

    const deltaDistY =
        Math.abs(
            1 / (rayDirY || 0.000001)
        );


    let stepX;
    let stepY;

    let sideDistX;
    let sideDistY;


    if (rayDirX < 0) {

        stepX = -1;

        sideDistX =
            (player.x - mapX) *
            deltaDistX;

    } else {

        stepX = 1;

        sideDistX =
            (mapX + 1.0 - player.x) *
            deltaDistX;
    }


    if (rayDirY < 0) {

        stepY = -1;

        sideDistY =
            (player.y - mapY) *
            deltaDistY;

    } else {

        stepY = 1;

        sideDistY =
            (mapY + 1.0 - player.y) *
            deltaDistY;
    }


    let side = 0;

    let distance = 0;


    // 最大探索距離

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        if (
            sideDistX <
            sideDistY
        ) {

            sideDistX +=
                deltaDistX;

            mapX += stepX;

            side = 0;

            distance =
                sideDistX -
                deltaDistX;

        } else {

            sideDistY +=
                deltaDistY;

            mapY += stepY;

            side = 1;

            distance =
                sideDistY -
                deltaDistY;
        }


        if (
            mapX < 0 ||
            mapY < 0 ||
            mapX >= mapWidth ||
            mapY >= mapHeight
        ) {

            break;
        }


        if (
            map[mapY][mapX] === "#"
        ) {

            return {
                distance:
                    Math.max(
                        0.01,
                        distance
                    ),

                side: side
            };
        }
    }


    return null;
}


// ========================================
// 方向 → 角度
// ========================================

function directionToAngle(direction) {

    switch (direction) {

        // 北
        case 0:
            return -Math.PI / 2;

        // 東
        case 1:
            return 0;

        // 南
        case 2:
            return Math.PI / 2;

        // 西
        case 3:
            return Math.PI;
    }

    return -Math.PI / 2;
}


// ========================================
// ステータス更新
// ========================================

function updateStatus() {

    document.getElementById(
        "hp"
    ).textContent =
        player.hp;


    document.getElementById(
        "level"
    ).textContent =
        player.level;
}


// ========================================
// メッセージ
// ========================================

function showMessage(text) {

    document.getElementById(
        "message"
    ).textContent =
        text;
}


// ========================================
// ボタン
// ========================================

document
    .getElementById("forward")
    .addEventListener(
        "click",
        moveForward
    );


document
    .getElementById("back")
    .addEventListener(
        "click",
        moveBack
    );


document
    .getElementById("turnLeft")
    .addEventListener(
        "click",
        turnLeft
    );


document
    .getElementById("turnRight")
    .addEventListener(
        "click",
        turnRight
    );


// ========================================
// キーボード操作
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

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
    }
);


// ========================================
// ゲーム開始
// ========================================

resizeCanvas();

showMessage(
    "地下迷宮B1F。探索を開始します。"
);
