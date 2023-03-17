(() => {
    let config = {
        dotMinRad: 1,
        dotMaxRad: 10,
        sphereRad: 350,
        bigDotRad: 20,
        mouseSize: 30,
        massFactor: 0.001,
        defColor: 'rgba(250,10,30,0.6)',
        smooth: 0.15,
    }

    let controlForbigDotRad = document.getElementById("bigDotRad");
    let controlForMouseSize = document.getElementById("mouseSize");
    let controlFormassFactor = document.getElementById("massFactor");
    let controlForsmooth = document.getElementById("smooth");
    let controlForsphereRad = document.getElementById("sphereRad");
    let controlFordotMaxRad = document.getElementById("dotMaxRad");
    let controlFordotMinRad = document.getElementById("dotMinRad");

    controlForbigDotRad.oninput = function () {
        dots[0].rad = controlForbigDotRad.value;
    }

    controlForMouseSize.oninput = function () {
        config.mouseSize = controlForMouseSize.value;
    }

    controlFormassFactor.oninput = function () {
        config.massFactor = controlFormassFactor.value;
    }

    controlForsmooth.oninput = function () {
        config.smooth = controlForsmooth.value;
    }

    controlForsphereRad.oninput = function () {
        config.sphereRad = controlForsphereRad.value;
    }

    controlFordotMaxRad.oninput = function () {
        config.dotMaxRad = controlFordotMaxRad.value;
    }

    controlFordotMinRad.oninput = function () {
        config.dotMinRad = controlFordotMinRad.value;
    }

    const TWO_PI = 2 * Math.PI;
    // const windField = document.getElementById('wind-field');
    const canvas = document.getElementById('canv');
    const ctx = canvas.getContext('2d');

    let w, h, mouse, dots;

    class Dot {
        constructor(r) {
            this.pos = { x: mouse.x, y: mouse.y };
            this.vel = { x: 0, y: 0 };
            this.rad = r || random(config.dotMinRad, config.dotMaxRad);
            this.mass = this.rad * config.massFactor;
            this.color = config.defColor;
        }

        draw(x, y) {
            this.pos.x = x || this.pos.x + this.vel.x;
            this.pos.y = y || this.pos.y + this.vel.y;
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
            createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor);
        }
    }

    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let acc = { x: 0, y: 0 }
            for (let j = 0; j < dots.length; j++) {
                if (i == j) continue;
                let [a, b] = [dots[i], dots[j]]

                let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (dist - config.sphereRad) / dist * b.mass;

                if (j == 0) {
                    let alpha = config.mouseSize / dist;

                    a.color = `rgba(${250 / alpha},${250 * alpha},30, ${alpha})`;
                    dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
                }

                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }

            dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
        }
        dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
    }

    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = `rgba(225, 225, 225, 0.1)`;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        mouse = { x: w / 2, y: h / 2, down: false };
        dots = [];

        dots.push(new Dot(config.bigDotRad));
    }


    function loop() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.down) { dots.push(new Dot()); }
        updateDots();


        window.requestAnimationFrame(loop);
    }


    init();
    loop();

    function setPos({ clientX, clientY }) {
        [mouse.x, mouse.y] = [clientX, clientY];
    }

    function isDown() {
        mouse.down = !mouse.down;
    }

    function setTouchPos(x, y){
        [mouse.x, mouse.y] = [x, y];
    }

    window.addEventListener('mousemove', setPos); //canvas windField
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);
    window.addEventListener('touchmove', () => {setTouchPos(parseInt(e.changedTouches[0].pageX),parseInt(e.changedTouches[0].pageY)}~);
    window.addEventListener('touchstart', isDown);
    window.addEventListener('touchend', isDown);
})();
