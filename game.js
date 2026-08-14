// ========================================
// MONSTER DUNGEON RPG
// 一人称ダンジョン探索システム
// ========================================


// ========================================
// ダンジョンマップ
// ========================================

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
//
// x / y は「マスの中央」に配置します
//
// direction
// 0 = 北
// 1 = 東
// 2 = 南
// 3 = 西
//

const player = {

    x: 8.5,
    y: 5.5,

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

const ctx =
    canvas.getContext("2d");


// ========================================
// Canvasサイズ
// ========================================

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const width =
        Math.max(
            320,
            Math.floor(rect.width || 700)
        );

    const height =
        Math.max(
            240,
            Math.floor(rect.height || 600)
        );

    canvas.width = width;
    canvas.height = height;

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

    const mx = Math.floor(x);
    const my = Math.floor(y);

    if (
        mx < 0 ||
        my < 0 ||
        mx >= mapWidth ||
        my >= mapHeight
    ) {
        return true;
    }

    return map[my][mx] === "#";
}


// ========================================
// 方向
// ========================================

function getDirection() {

    switch (player.direction) {

        case 0:
            return {
                x: 0,
                y: -1
            };

        case 1:
            return {
                x: 1,
                y: 0
            };

        case 2:
            return {
                x: 0,
                y: 1
            };

        case 3:
            return {
                x: -1,
                y: 0
            };
    }

    return {
        x: 1,
        y: 0
    };
}


// ========================================
// 前進
// ========================================

function moveForward() {

    const dir =
        getDirection();

    const nx =
        player.x + dir.x;

    const ny =
        player.y + dir.y;


    if (isWall(nx, ny)) {

        showMessage(
            "壁にぶつかった。"
        );

        drawDungeon();

        return;
    }


    player.x = nx;
    player.y = ny;


    showMessage(
        "前へ進んだ。"
    );


    drawDungeon();
}


// ========================================
// 後退
// ========================================

function moveBack() {

    const dir =
        getDirection();

    const nx =
        player.x - dir.x;

    const ny =
        player.y - dir.y;


    if (isWall(nx, ny)) {

        showMessage(
            "壁にぶつかった。"
        );

        drawDungeon();

        return;
    }


    player.x = nx;
    player.y = ny;


    showMessage(
        "後ろへ下がった。"
    );


    drawDungeon();
}


// ========================================
// 左を向く
// ========================================

function turnLeft() {

    player.direction =
        (player.direction + 3) % 4;

    showMessage(
        "左を向いた。"
    );

    drawDungeon();
}


// ========================================
// 右を向く
// ========================================

function turnRight() {

    player.direction =
        (player.direction + 1) % 4;

    showMessage(
        "右を向いた。"
    );

    drawDungeon();
}


// ========================================
// 一人称画面
// ========================================

function drawDungeon() {

    const width =
        canvas.width;

    const height =
        canvas.height;


    // ----------------------------
    // 全体を黒で消去
    // ----------------------------

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // ----------------------------
    // 天井
    // ----------------------------

    const horizon =
        height * 0.50;

    ctx.fillStyle =
        "#111111";

    ctx.fillRect(
        0,
        0,
        width,
        horizon
    );


    // ----------------------------
    // 床
    // ----------------------------

    ctx.fillStyle =
        "#252525";

    ctx.fillRect(
        0,
        horizon,
        width,
        height - horizon
    );


    // ----------------------------
    // 床の遠近線
    // ----------------------------

    drawFloor(
        width,
        height,
        horizon
    );


    // ----------------------------
    // 壁
    // ----------------------------

    drawWalls(
        width,
        height,
        horizon
    );


    // ----------------------------
    // 枠
    // ----------------------------

    ctx.strokeStyle =
        "#777777";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        1.5,
        1.5,
        width - 3,
        height - 3
    );


    updateStatus();
}


// ========================================
// 床を描画
// ========================================

function drawFloor(
    width,
    height,
    horizon
) {

    ctx.strokeStyle =
        "rgba(150,150,150,0.18)";

    ctx.lineWidth = 1;


    // 横線

    for (
        let i = 1;
        i <= 8;
        i++
    ) {

        const t =
            i / 8;

        const y =
            horizon +
            Math.pow(t, 1.8) *
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


    // 縦線

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
// 壁を描画
// ========================================

function drawWalls(
    width,
    height,
    horizon
) {

    const fov =
        Math.PI / 3;

    const rayCount =
        Math.max(
            240,
            Math.floor(width * 0.7)
        );


    const playerAngle =
        directionToAngle(
            player.direction
        );


    for (
        let i = 0;
        i < rayCount;
        i++
    ) {

        // -1 ～ +1

        const camera =
            (i / (rayCount - 1)) * 2 - 1;


        // 視野角

        const angle =
            playerAngle +
            camera * fov / 2;


        const rayX =
            Math.cos(angle);

        const rayY =
            Math.sin(angle);


        const hit =
            castRay(
                rayX,
                rayY
            );


        if (!hit) {
            continue;
        }


        // ----------------------------
        // 魚眼補正
        // ----------------------------

        const corrected =
            hit.distance *
            Math.cos(
                angle - playerAngle
            );


        const distance =
            Math.max(
                0.15,
                corrected
            );


        // ----------------------------
        // 壁の高さ
        // ----------------------------

        let wallHeight =
            height * 0.95 / distance;


        // 大きくなりすぎないように制限

        wallHeight =
            Math.min(
                height * 0.95,
                wallHeight
            );


        const top =
            horizon -
            wallHeight / 2;


        // ----------------------------
        // 壁の明るさ
        // ----------------------------

        let brightness =
            1 /
            (1 + distance * 0.22);


        brightness =
            Math.max(
                0.20,
                Math.min(
                    1,
                    brightness
                )
            );


        // 横壁を少し暗くする

        if (hit.side === 1) {

            brightness *= 0.72;
        }


        const gray =
            Math.floor(
                100 * brightness
            );


        ctx.fillStyle =
            `rgb(${gray},${gray},${gray})`;


        // ----------------------------
        // 壁の1列
        // ----------------------------

        const x =
            i * width / rayCount;


        const columnWidth =
            width / rayCount + 2;


        ctx.fillRect(
            x,
            top,
            columnWidth,
            wallHeight
        );


        // ----------------------------
        // 壁の境界線
        // ----------------------------

        if (distance < 8) {

            ctx.fillStyle =
                `rgba(220,220,220,${
                    0.15 * brightness
                })`;

            ctx.fillRect(
                x,
                top,
                columnWidth,
                2
            );
        }
    }
}


// ========================================
// レイを飛ばす
// ========================================

function castRay(
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


    // ----------------------------
    // X方向
    // ----------------------------

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


    // ----------------------------
    // Y方向
    // ----------------------------

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


    // ----------------------------
    // マップを進む
    // ----------------------------

    for (
        let count = 0;
        count < 64;
        count++
    ) {

        if (
            sideDistX <
            sideDistY
        ) {

            sideDistX +=
                deltaDistX;

            mapX +=
                stepX;

            side = 0;

        } else {

            sideDistY +=
                deltaDistY;

            mapY +=
                stepY;

            side = 1;
        }


        // マップ外

        if (
            mapX < 0 ||
            mapY < 0 ||
            mapX >= mapWidth ||
            mapY >= mapHeight
        ) {

            return null;
        }


        // 壁に当たった

        if (
            map[mapY][mapX] === "#"
        ) {

            let distance;


            if (side === 0) {

                distance =
                    (
                        mapX -
                        player.x +
                        (1 - stepX) / 2
                    ) /
                    rayDirX;

            } else {

                distance =
                    (
                        mapY -
                        player.y +
                        (1 - stepY) / 2
                    ) /
                    rayDirY;
            }


            return {

                distance:
                    Math.abs(distance),

                side: side,

                mapX: mapX,
                mapY: mapY
            };
        }
    }


    return null;
}


// ========================================
// 方向を角度に変換
// ========================================

function directionToAngle(
    direction
) {

    switch (direction) {

        case 0:
            return -Math.PI / 2;

        case 1:
            return 0;

        case 2:
            return Math.PI / 2;

        case 3:
            return Math.PI;
    }


    return 0;
}


// ========================================
// ステータス
// ========================================

function updateStatus() {

    const hp =
        document.getElementById("hp");

    const level =
        document.getElementById("level");


    if (hp) {

        hp.textContent =
            player.hp;
    }


    if (level) {

        level.textContent =
            player.level;
    }
}


// ========================================
// メッセージ
// ========================================

function showMessage(text) {

    const message =
        document.getElementById(
            "message"
        );


    if (message) {

        message.textContent =
            text;
    }
}


// ========================================
// ボタン
// ========================================

const forward =
    document.getElementById(
        "forward"
    );

const back =
    document.getElementById(
        "back"
    );

const turnLeftButton =
    document.getElementById(
        "turnLeft"
    );

const turnRightButton =
    document.getElementById(
        "turnRight"
    );


if (forward) {

    forward.addEventListener(
        "click",
        moveForward
    );
}


if (back) {

    back.addEventListener(
        "click",
        moveBack
    );
}


if (turnLeftButton) {

    turnLeftButton.addEventListener(
        "click",
        turnLeft
    );
}


if (turnRightButton) {

    turnRightButton.addEventListener(
        "click",
        turnRight
    );
}


// ========================================
// キーボード
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
