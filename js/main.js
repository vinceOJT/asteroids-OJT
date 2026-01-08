const game_control = {
    reverse: true
}
// contineous rotation
// pick ships

const game_vals = {
    w: 400,
    h: 400,
    mw: 40,
    mh: 31,
    p: 0, // points
    s: "booting",
    ac: 100, // # of asteroird,
    asc: 1, // # of alien ships
    ai: 200, // asteroid interval
    aits: 0, // asteroid timestamp
    l: 1, // proportional with level
    lint: 1000,
    ltms: 0,
    lvlt: 0,
    gw: 0,
    gwint: 3000,
    gwts: 0,
    pcs: 24, // must be even
    gspt: 700,
    gsts: 0,
    px: 20,
    ass: "pink"
};

const space_ship = {
    x: 200,
    y: 200,
    r: 12,
    d: 0,
    bc: 30, // bullet count 5 original
    bi: 100, // bullet fire rate 500 original
    bits: 0,
    ma: 0, // movement of ship at start
    a: 90, // angle if ship at the start
    av: 5, // angle velocity
    w: 20, // width of the ship
    h: 20, // height of the ship
    v: 4, // velocity or movement
    ki: 30, // key interval
    kts: 0, // key timestamp
    km: [],
    tts: 0, // ship tail timestamp
    ti: 50, // shil tail interval
    tis: 0,
}




/** No App */
// game_vals.w = game_vals.px * game_vals.mw;
// game_vals.h = game_vals.px * game_vals.mh;
let or_durable = 10;
var asteroids = [];
var bullets = [];

if (document.getElementById("game_container").offsetWidth) {
    game_vals.w = document.getElementById("game_container").offsetWidth;
}

if (document.getElementById("game_container").offsetHeight) {
    game_vals.h = document.getElementById("game_container").offsetHeight;
}

document.getElementById("game_resume").style.display = "none";
document.getElementById("game_pause").style.display = "none";

const game_canvas = document.getElementById("game");
const game_ctx = game_canvas.getContext("2d");

game_canvas.width = game_vals.w;
game_canvas.height = game_vals.h;

window.addEventListener("keydown", (e) => {

    if (game_vals.s === "playing") {
        let kc = true;
        let ec = "";
        switch (e.code) {
            case "KeyW":
            case "ArrowUp":
                ec = "KeyW";
                break;
            case "KeyS":
            case "ArrowDown":
                ec = "KeyS";
                break;
            case "KeyA":
            case "ArrowLeft":
                ec = "KeyA";
                break;
            case "KeyD":
            case "ArrowRight":
                ec = "KeyD";
                break;
            case "Space":
                ec = "Space";
                break;
            default:
                kc == false;
                break;
        }

        if (kc) {

            switch (ec) {
                case "KeyW":
                    if (!space_ship.km.includes(ec)) {
                        space_ship.km.push(ec);
                        space_ship.ma = space_ship.a;
                    }
                    break;
                case "KeyS":
                    if (!space_ship.km.includes(ec)) {
                        space_ship.km.push(ec);
                        space_ship.ma = space_ship.a;


                    }
                    break;
                case "KeyA":
                case "KeyD":
                    if (!space_ship.km.includes("KeyA") && !space_ship.km.includes("KeyD")) {
                        space_ship.km.push(ec);
                    }
                    break;
                case "Space":
                    if (!space_ship.km.includes(ec)) {
                        space_ship.km.push(ec);
                    }
                    break;
            }

        }

    }

})


window.addEventListener("keyup", (e) => {

    if (game_vals.s === "playing") {

        let kc = true;
        let ec = "";

        switch (e.code) {
            case "KeyW":
            case "ArrowUp":
                ec = "KeyW";
                space_ship.ma = space_ship.a;
                break;
            case "KeyS":
            case "ArrowDown":
                ec = "KeyS";
                space_ship.ma = 0;
                break;

            case "KeyA":
            case "ArrowLeft":
                ec = "KeyA";
                break;
            case "KeyD":
            case "ArrowRight":
                ec = "KeyD";
                break;
            case "Space":
                ec = "Space";
                break;
            default:
                kc == false;
                break;
        }

        if (kc) {
            let eci = space_ship.km.indexOf(ec);
            space_ship.km.splice(eci, 1);
        }

    }

})

game_vals.s = "game_over";
window.requestAnimationFrame(update);
check_allow_config();
function check_allow_config() {

    let r_data = { cmd: 'check_allow_config' };
    r_data = { cmd: 'check_allow_config' };
    $.ajax({
        url: "api/asteroid_dba.php",
        type: "post",
        data: r_data,
        dataType: "JSON"
    })


}
function game_start() {

    if (!document.getElementById("name").value) {
        alert("Please input Name");
        document.getElementById("name").focus();
        return;
    }

    if (game_vals.s === "game_over") {
        space_ship.x = Math.floor(game_vals.w / 2);
        space_ship.y = Math.floor(game_vals.w / 2);
        space_ship.d = or_durable;
        space_ship.km = [];

        asteroids = [];
        bullets = [];

        game_vals.p = 0;
        game_vals.l = 1;
        game_vals.ac = game_vals.ac;
        game_vals.lvlt = 0;
        game_vals.s = "playing";

        document.getElementById("game_start").style.display = "none";
        document.getElementById("game_resume").style.display = "none";
        document.getElementById("game_pause").style.display = "";
        document.getElementById("name").style.background = "#e9ecef";
        document.getElementById("name").style.cursor = "default";
        document.getElementById("name").setAttribute('readonly', true);
    }


}

function game_pause() {

    if (game_vals.s === "playing") {
        game_vals.s = "pause";
        document.getElementById("game_resume").style.display = "";
        document.getElementById("game_pause").style.display = "none";
    }


}

function game_resume() {

    if (game_vals.s === "pause") {
        game_vals.s = "playing";
        document.getElementById("game_resume").style.display = "none";
        document.getElementById("game_pause").style.display = "";
    }

}

function update_score_info() {

    document.getElementById("level").value = game_vals.l;
    document.getElementById("score").value = game_vals.p;
    document.getElementById("asteroid").value = game_vals.ac;
    document.getElementById("armor").value = space_ship.d;
    // Save this stuff itf
    update_db_score();

}



function update_db_score() {


    let f_data = {};
    f_data['cmd'] = "update_score";
    f_data['score'] = game_vals.p;
    f_data['name'] = document.getElementById("name").value;

    $.ajax({
        url: "api/asteroid_dba.php",
        type: "post",
        data: f_data,
        success: (res) => {

        }

    })

}
function create_asteroids() {

    if (asteroids.length >= game_vals.ac) {
        return;
    }

    let asteroid = {
        x: 0,
        y: 0,
        a: rand_number(360),
        r: rand_number(35, 10),
        f: 1, // force
        d: 0, // durability
        v: rand_number(4, 1), // velocity multiplier?
        mi: 30, // movement interval
        mts: 0, // movement timestamp
        ma: [],
    }

    let xA = [];
    xA.push(-rand_number(15));
    xA.push(rand_number(game_vals.w / 2));
    xA.push(rand_number(game_vals.w + 15, game_vals.w / 2));
    xA.push(rand_number(game_vals.w + 15, game_vals.w));

    let yA = [];
    yA.push(-rand_number(15));
    yA.push(rand_number(game_vals.h / 2));
    yA.push(rand_number(game_vals.h + 15, game_vals.h / 2));
    yA.push(rand_number(game_vals.h + 15, game_vals.h));




    if (asteroid.a >= 0 && asteroid.a < 90) {
        asteroid.x = xA[0];
        asteroid.y = yA[1];
    } else if (asteroid.a >= 90 && asteroid.a < 180) {
        asteroid.x = xA[2];
        asteroid.y = yA[3];
    } else if (asteroid.a >= 180 && asteroid.a < 270) {
        asteroid.x = xA[3];
        asteroid.y = yA[1];
    } else {
        asteroid.x = xA[1];
        asteroid.y = yA[0];
    }

    let rr;
    let rrr = asteroid.r;
    let mxa = 5;
    for (let i = 0; i < mxa; i++) {
        rr = rand_number(rrr, 1);
        rrr = rrr - rr;
        if (rrr > 0) {
            asteroid.ma.push(rr);
        } else {
            break;
        }

        if (i == mxa - 1) {
            asteroid.ma.push(rrr);
            break;
        }

    }

    asteroids.push(asteroid);

}

// function asteroid_design() {

//     game_ctx.beginPath();
//     game_ctx.strokeStyle = "white";
//     game_ctx.arc(tmpA.x, tmpA.y, asteroids[ai].r, 0, 2 * Math.PI);
//     game_ctx.stroke();
//     game_ctx.closePath();


// }

function asteroid_design() {
    game_ctx.beginPath();
    game_ctx.strokeStyle = "white";
    game_ctx.arc(tmpA.x, tmpA.y, asteroids[ai].r, 0, 2 * Math.PI);
    // Define the points for a jagged, irregular shape
    // The points are relative to the asteroid's (tmpA.x, tmpA.y) center
    // const radius = asteroids[ai].r;
    // // Example points for a simple irregular hexagon.
    // // Adjust these points to create a more complex or random shape.
    // const points = [
    //     { x: 0, y: -1 * radius },         // Top point
    //     { x: 0.9 * radius, y: -0.2 * radius }, // Upper right
    //     { x: 0.7 * radius, y: 0.8 * radius },  // Lower right
    //     { x: 0, y: 0.5 * radius },         // Bottom point (indented)
    //     { x: -0.7 * radius, y: 0.8 * radius }, // Lower left
    //     { x: -0.9 * radius, y: -0.2 * radius }  // Upper left
    // ];

    // // Move to the first point
    // game_ctx.moveTo(tmpA.x + points[0].x, tmpA.y + points[0].y);

    // // Draw lines to the other points
    // for (let i = 1; i < points.length; i++) {
    //     game_ctx.lineTo(tmpA.x + points[i].x, tmpA.y + points[i].y);
    // }

    // Close the path to connect the last point to the first
    game_ctx.closePath();
    game_ctx.stroke();
}


function create_mini_asteroid(ox, oy, ov, oa, ma) {

    let tArr = [];
    for (let i = 0; i < ma.length; i++) {

        let na = oa + (rand_number(10, 1) * (Math.random() > 0.5 ? 1 : -1));
        let aa = rand_number(ma[i] + 5, ma[i]) * (Math.random() > 0.5 ? 1 : -1);

        let asteroid = {
            x: ox + aa,
            y: oy + aa,
            a: na,
            r: ma[i],
            f: 1, // force
            d: 5, // durability
            v: ov + rand_number(2), // velocity multiplier?
            mi: 30, // movement interval
            mts: 0, // movement timestamp
            ma: [],
        }

        if (ma[i] >= 10) {

            let rr;
            let rrr = ma[i];
            let mxa = 5;
            for (let i = 0; i < mxa; i++) {
                rr = rand_number(rrr, 1);
                rrr = rrr - rr;
                if (rrr > 0) {
                    asteroid.ma.push(rr);
                } else { break; }

                if (i == mxa - 1) {
                    asteroid.ma.push(rrr);
                    break;
                }

            }

        }

        tArr.push(asteroid);
    }

    return tArr;
}

function create_bullets() {

    if (bullets.length >= space_ship.bc) {
        return;
    }

    let bullet = {
        x: space_ship.x,
        y: space_ship.y,
        a: space_ship.a,
        r: 3,
        v: 4,
        d: 3,
        mi: 10, // bullet interval
        mits: 0, // bullet timestamp
    }

    bullets.push(bullet);

}

function rand_number(max, min = 0) {
    let nMx = max - min;
    return (Math.floor(Math.random() * nMx) + min);
}


function update(ts) {

    if (game_vals.s === "pause" || game_vals.s === "game_over") {
        window.requestAnimationFrame(update);
        return;
    }

    update_score_info();

    if (ts - game_vals.ltms >= game_vals.lint) {
        game_vals.lvlt = game_vals.lvlt + 1;
        game_vals.ltms = ts;

        if (game_vals.lvlt % 10 == 0) {
            game_vals.ac = game_vals.ac + 1;
        }

        if (game_vals.lvlt % 60 == 0) {
            game_vals.l = game_vals.l + 1;
        }

        game_vals.p = game_vals.p + (10 * game_vals.l);

    }


    game_ctx.clearRect(0, 0, game_vals.w, game_vals.h);

    // consider leveling
    if (ts - game_vals.aits >= game_vals.ai) {
        create_asteroids();
        game_vals.aits = ts;
    }


    if (ts - space_ship.kts >= space_ship.ki) {

        let nx, ny;
        let na = space_ship.a;
        let av = space_ship.av;

        if (space_ship.km.includes("KeyA")) {
            na = na + av;
        }

        if (space_ship.km.includes("KeyD")) {
            na = na - av;
        }

        if (space_ship.km.includes("KeyW")) {
            nx = space_ship.x + (space_ship.v * Math.cos(na * (Math.PI / 180)));
            ny = space_ship.y - (space_ship.v * Math.sin(na * (Math.PI / 180)));
        } else if (space_ship.km.includes("KeyS") && game_control.reverse == true) {
            nx = space_ship.x - (space_ship.v * Math.cos(na * (Math.PI / 180)));
            ny = space_ship.y + (space_ship.v * Math.sin(na * (Math.PI / 180)));
        }
        else if (space_ship.ma != "") {

        }
        // if (space_ship.km.includes("KeyW")) {
        //     nx = space_ship.x + (space_ship.v * Math.cos(na * (Math.PI / 180)));
        //     ny = space_ship.y - (space_ship.v * Math.sin(na * (Math.PI / 180)));
        // } else if (space_ship.ma != "") {
        //     nx = space_ship.x + (space_ship.v * Math.cos(space_ship.ma * (Math.PI / 180)));
        //     ny = space_ship.y - (space_ship.v * Math.sin(space_ship.ma * (Math.PI / 180)));
        // }

        if (nx != undefined && ny != undefined) {
            space_ship.x = nx;
            space_ship.y = ny;
            space_ship.a = na;
        } else {
            space_ship.a = na;
        }
        space_ship.kts = ts;

    }

    if (space_ship.km.includes("Space")) {
        if (ts - space_ship.bits >= space_ship.bi) {
            create_bullets();
            space_ship.bits = ts;
        }
    }


    if (space_ship.x < -space_ship.v) {
        space_ship.x = game_vals.w + space_ship.v;
    }

    if (space_ship.x > game_vals.w + space_ship.v) {
        space_ship.x = -space_ship.v;
    }


    if (space_ship.y < -space_ship.v) {
        space_ship.y = game_vals.h + space_ship.v;
    }

    if (space_ship.y > game_vals.h + space_ship.v) {
        space_ship.y = -space_ship.v;
    }

    /*** Create Bullets */
    let nBlt = [];
    for (let bi = 0; bi < bullets.length; bi++) {

        let bltARr = bullets[bi];
        if (ts - bullets[bi].mits >= bullets[bi].mi) {

            let nbx = bullets[bi].x + (bullets[bi].v * Math.cos(bullets[bi].a * (Math.PI / 180)));
            let nby = bullets[bi].y - (bullets[bi].v * Math.sin(bullets[bi].a * (Math.PI / 180)));

            if (nbx < 0 || nbx > game_vals.w || nby < 0 || nby > game_vals.h) {
                continue;
            }
            bltARr.x = nbx;
            bltARr.y = nby;
            bullets[bi].mits = ts;

        }

        game_ctx.beginPath();
        game_ctx.fillStyle = "gold";
        game_ctx.arc(bltARr.x, bltARr.y, bltARr.r, 0, 2 * Math.PI);
        game_ctx.fill();
        game_ctx.closePath();

        nBlt.push(bltARr);

    }
    bullets = nBlt;

    /**Create Asteroid */
    let nAst = [];
    let astArr = [];
    for (let ai = 0; ai < asteroids.length; ai++) {

        let tmpA = asteroids[ai];


        if (ts - asteroids[ai].mts >= asteroids[ai].mi) {
            asteroids[ai].mts = ts;

            let ax = asteroids[ai].x + (asteroids[ai].v * Math.cos(asteroids[ai].a * (Math.PI / 180)));
            let ay = asteroids[ai].y - (asteroids[ai].v * Math.sin(asteroids[ai].a * (Math.PI / 180)));
            // add collition later

            tmpA.x = Math.round(ax);
            tmpA.y = Math.round(ay);

        }

        game_ctx.strokeStyle = game_vals.ass;
        // game_ctx.arc(tmpA.x, tmpA.y, asteroids[ai].r, 0, 2 * Math.PI);


        const radius = asteroids[ai].r;
        console.log(radius);
        // target points of the asteroid
        //HEART
        // const points = [
        //     { x: 0.4 * radius, y: -0.4 * radius },

        //     { x: 0.8 * radius, y: 0 },


        //     { x: 0.8 * radius, y: 0.2 * radius },

        //     { x: 0.6 * radius, y: 0.4 * radius },

        //     { x: 0.4 * radius, y: 0.3 * radius },

        //     { x: 0.2 * radius, y: 0.4 * radius },

        //     { x: 0, y: 0.2 * radius },

        //     { x: 0, y: 0 },


        // ]

        // ARROW
        // const points = [
        //     { x: 0, y: 1 * radius },
        //     { x: 0.8 * radius, y: 0.2 * radius },
        //     { x: 0.2 * radius, y: 0.2 * radius },
        //     { x: 0.2 * radius, y: -1 * radius },
        //     { x: -0.2 * radius, y: -1 * radius },
        //     { x: -0.2 * radius, y: 0.2 * radius },
        //     { x: -0.8 * radius, y: 0.2 * radius },

        // ]


        //DEBRIS
        const points = [
            { x: 0, y: -1 * radius },

            { x: 0.9 * radius, y: -0.2 * radius },
            { x: 0.7 * radius, y: 0.8 * radius },

            { x: 0, y: 0.5 * radius },

            { x: -0.7 * radius, y: 0.8 * radius },
            { x: -0.9 * radius, y: -0.2 * radius },
            { x: -0.6 * radius, y: -0.9 * radius },


        ]

        //       game_ctx.moveTo(points[0].x, points[0].y); 
        // for (let i = 1; i < points.length; i++) {
        //     game_ctx.lineTo(points[i].x, points[i].y);

        // itterates through each array and draws them base on their given x, y axis
        game_ctx.save(); // screenshot the state of the current canavas
        game_ctx.translate(tmpA.x, tmpA.y); // make the asteroids be at the center of the canvas


        game_ctx.rotate(asteroids[ai].a * Math.PI / 360); //rotate the canvas


        game_ctx.beginPath();

        game_ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            game_ctx.lineTo(points[i].x, points[i].y);

        }
        game_ctx.closePath();
        game_ctx.stroke();
        game_ctx.restore(); //restore after after use

        if (tmpA.x <= -100 || tmpA.x >= game_vals.w + 100 || tmpA.y <= -100 || tmpA.y >= game_vals.h + 100) {
            continue;
        }

        nAst.push(tmpA);
        astArr.push(asteroids[ai].x + "," + asteroids[ai].y + "," + asteroids[ai].r);

    }
    asteroids = nAst;
    /** */
    let astRemove = [];
    let bltRemove = [];
    for (let ii = astArr.length - 1; ii >= 0; ii--) {


        if (astRemove.includes(ii) || bltRemove.includes(ii)) {
            continue;
        }

        let tps = astArr[ii].split(",");
        let cld = Math.hypot(parseInt(tps[0]) - (space_ship.x), parseInt(tps[1]) - (space_ship.y));

        if (cld < Math.abs(parseInt(tps[2]) + space_ship.r)) {

            if (asteroids[ii].r >= space_ship.d) {
                game_vals.s = "game_over";
                document.getElementById("game_start").style.display = "";
                document.getElementById("game_pause").style.display = "none";
                document.getElementById("game_resume").style.display = "none";
                alert("Game Over");
            } else {
                space_ship.d = space_ship.d - asteroids[ii].r;
                // Todo
                // Add status ex life or durability remaining
                bltRemove.push(ii);
            }

        }

        let bh = false;
        let nbltl = []
        for (let abi = 0; abi < bullets.length; abi++) {
            let clb = Math.hypot(parseInt(tps[0]) - (bullets[abi].x), parseInt(tps[1]) - (bullets[abi].y));
            if (clb < Math.abs(parseInt(tps[2]) + bullets[abi].r)) {
                bh = true;
                continue;
            }
            nbltl.push(bullets[abi]);
        }
        bullets = nbltl;

        if (bh) {
            if (asteroids[ii].r <= 10) {
                bltRemove.push(ii);
            } else {
                astRemove.push(ii);
            }
            continue;
        }


        for (let iii = 0; iii < astArr.length; iii++) {
            if (iii == ii) { continue; }

            let aps = astArr[iii].split(",");
            let ald = Math.hypot(aps[0] - tps[0], aps[1] - tps[1]);

            if (ald < Math.abs(parseInt(aps[2]) + parseInt(tps[2]))) {

                if (asteroids[iii].r > asteroids[ii].r) {

                    if (!astRemove.includes(ii)) {
                        asteroids[ii].a = asteroids[iii].a;
                        astRemove.push(ii);
                    }
                } else if (asteroids[iii].r < asteroids[ii].r) {
                    if (!astRemove.includes(iii)) {
                        asteroids[iii].a = asteroids[ii].a;
                        astRemove.push(iii);
                    }
                } else {
                    if (!astRemove.includes(ii)) {
                        asteroids[ii].a = asteroids[iii].a;
                        astRemove.push(ii);
                    }

                    if (!astRemove.includes(iii)) {
                        asteroids[iii].a = asteroids[ii].a;
                        astRemove.push(iii);
                    }
                }


                break;
            }
        }

    }


    let nmAst = [];
    for (let ari = 0; ari < astRemove.length; ari++) {

        if (!asteroids[astRemove[ari]]) { continue; }

        if (asteroids[astRemove[ari]].r > 3) {
            let mas = create_mini_asteroid(asteroids[astRemove[ari]].x, asteroids[astRemove[ari]].y, asteroids[astRemove[ari]].v, asteroids[astRemove[ari]].a, asteroids[astRemove[ari]].ma);
            if (mas.length) {
                nmAst = nmAst.concat(mas);
            }
        }
        // add points based on asteroid radius
        game_vals.p = game_vals.p + (asteroids[astRemove[ari]].r * game_vals.l);
        asteroids.splice(astRemove[ari], 1);
    }

    if (nmAst.length) {
        asteroids = asteroids.concat(nmAst);
    }


    for (let bri = 0; bri < bltRemove.length; bri++) {
        asteroids.splice(bltRemove[bri], 1);
    }


    /*** Space Ship */
    game_ctx.strokeStyle = "white";
    game_ctx.lineWidth = 2;
    game_ctx.beginPath();

    game_ctx.fillStyle = "gold";
    game_ctx.arc(space_ship.x, space_ship.y, space_ship.v, 0, 2 * Math.PI);
    game_ctx.fill();

    game_ctx.closePath();


    game_ctx.beginPath();

    game_ctx.strokeStyle = "white";
    // game_ctx.arc(space_ship.x, space_ship.y, space_ship.r, 0, 2 * Math.PI);
    // game_ctx.stroke();

    game_ctx.closePath();




    if (ts - space_ship.tts >= space_ship.ti) {
        if (space_ship.tis == 1) {
            space_ship.tis = 0;
        } else {
            space_ship.tis = 1;
        }
        space_ship.tts = ts;
    }


    let op = [
        "10",
        "6,35",
        "15,15",
        "12,45",
        "9,80",
        "15,105",
        "18,125",
        "12,145",
        "15,180",
        "12,215",
        "18,235",
        "15,255",
        "9,280",
        "12,315",
        "15,345",
        "6,325",
        "10"
    ]

    game_ctx.beginPath();

    let ccx;
    let ccy;

    for (let opi = 0; opi < op.length; opi++) {
        let t = op[opi].split(",");
        let ccr = parseInt(t[0]);
        let cca = t[1] ? parseInt(t[1]) : 0;

        ccx = space_ship.x + (ccr * Math.cos((space_ship.a + cca) * (Math.PI / 180)));
        ccy = space_ship.y - (ccr * Math.sin((space_ship.a + cca) * (Math.PI / 180)));

        if (opi == 0) {
            game_ctx.moveTo(ccx, ccy);
        } else {
            game_ctx.lineTo(ccx, ccy);
        }

    }

    game_ctx.stroke();
    game_ctx.closePath();

    // todo Line Design

    if (space_ship.tis == 1 && space_ship.km.includes("KeyW")) {
        let ccr = 20;
        let bg = 10;
        let bgg = 10;
        let stx = space_ship.x + ((ccr / 2) * Math.cos((space_ship.a + 180) * (Math.PI / 180)));
        let sty = space_ship.y - ((ccr / 2) * Math.sin((space_ship.a + 180) * (Math.PI / 180)));

        game_ctx.save();
        game_ctx.beginPath();
        game_ctx.lineWidth = 5;
        game_ctx.moveTo(stx, sty);
        let stex, stey;
        stex = stx + (bg * Math.cos((space_ship.a + 180) * (Math.PI / 180)));
        stey = sty - (bg * Math.sin((space_ship.a + 180) * (Math.PI / 180)));
        game_ctx.lineTo(stex, stey);
        game_ctx.stroke();
        game_ctx.closePath();
        game_ctx.restore();


        game_ctx.save();
        game_ctx.beginPath();
        game_ctx.lineWidth = 3;
        game_ctx.moveTo(stx, sty);
        stex, stey;
        stex = stx + (bgg * Math.cos((space_ship.a + 180) * (Math.PI / 180)));
        stey = sty - (bgg * Math.sin((space_ship.a + 180) * (Math.PI / 180)));
        game_ctx.lineTo(stex, stey);
        game_ctx.stroke();
        game_ctx.closePath();
        game_ctx.restore();

    }



    // Triangle
    /***
    let rplx = 9;
    let radg = 22;
    let ccr = 18;
    let bg = 10;
    let bgg = 14;

    let ccx = space_ship.x + (ccr * Math.cos(space_ship.a * (Math.PI / 180)));
    let ccy = space_ship.y - (ccr * Math.sin(space_ship.a * (Math.PI / 180)));
    

    if (space_ship.tis == 1 && space_ship.km.includes("KeyW")) {

        let stx = space_ship.x + ((ccr / 2) * Math.cos((space_ship.a + 180) * (Math.PI / 180)));
        let sty = space_ship.y - ((ccr / 2) * Math.sin((space_ship.a + 180) * (Math.PI / 180)));

        game_ctx.save();
        game_ctx.beginPath();
        game_ctx.lineWidth = 5;
        game_ctx.moveTo(stx, sty);
        let stex, stey;
        stex = stx + (bg * Math.cos((space_ship.a + 180) * (Math.PI / 180)));
        stey = sty - (bg * Math.sin((space_ship.a + 180)* (Math.PI / 180)));
        game_ctx.lineTo(stex, stey);
        game_ctx.stroke();
        game_ctx.closePath();
        game_ctx.restore();


        game_ctx.save();
        game_ctx.beginPath();
        game_ctx.lineWidth = 3;
        game_ctx.moveTo(stx, sty);
        stex, stey;
        stex = stx + (bgg * Math.cos((space_ship.a + 180) * (Math.PI / 180)));
        stey = sty - (bgg * Math.sin((space_ship.a + 180)* (Math.PI / 180)));
        game_ctx.lineTo(stex, stey);
        game_ctx.stroke();
        game_ctx.closePath();
        game_ctx.restore();

    }

    game_ctx.beginPath();
    
    game_ctx.moveTo(ccx, ccy);
    let rgx, rgy;
    let ra = space_ship.a + 180 + radg;
    rgx = ccx + ((space_ship.v * rplx) * Math.cos(ra * (Math.PI / 180)));
    rgy = ccy - ((space_ship.v * rplx) * Math.sin(ra * (Math.PI / 180)));
    game_ctx.lineTo(rgx, rgy);
    game_ctx.stroke();
    game_ctx.closePath();

    game_ctx.beginPath();
    game_ctx.moveTo(ccx, ccy);
    let lgx, lgy;
    let la = space_ship.a + 180 - radg;
    lgx = ccx + ((space_ship.v * rplx) * Math.cos(la * (Math.PI / 180)));
    lgy = ccy - ((space_ship.v * rplx) * Math.sin(la * (Math.PI / 180)));
    game_ctx.lineTo(lgx, lgy);
    game_ctx.stroke();
    game_ctx.closePath();

    game_ctx.beginPath();
    game_ctx.moveTo(lgx, lgy);
    game_ctx.lineTo(rgx, rgy);
    game_ctx.stroke();
    game_ctx.closePath();
     */
    /*** Space Ship */

    window.requestAnimationFrame(update);

}