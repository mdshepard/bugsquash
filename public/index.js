const bugImages = ["bug1.png", "bug2.png", "bug3.png", "bug4.png"];
const messageBox = document.getElementById("box-o-messages");
let gameDiv = document.getElementById("gameDiv");
let countdownSpan = document.getElementById("countdownSpan");
let scoreSpan = document.getElementById("scoreSpan")
let countdown = 10, score = 0;
let startTime;
const getRequestButton = document.getElementById("get-request");
const postRequestButton = document.getElementById("post-request");


function gameOver() {
    // This is the function that gets called when the game is over.
    const scoresURL = "http://localhost:3000/scores"
    // Update this to post the new score to the server.
    let postData = {
        name: playerName,
        score,
    };
    const postRequestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData)
    }

    postRequestButton.addEventListener("click", event => {

        fetch("/scores", postRequestOptions)
            .then(res => {
                return res.json();
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log ("Yo dawg, your POST request is broken", error)
            })
    })

    getRequestButton.addEventListener("click", event => {
        fetch("/scores")
            .then(res => {
                return res.json();
            })
            .then(data => {
                printToMessageBox(JSON.stringify(data));
            })

    })

    function printToMessageBox(json) {
        const text = document.createTextNode(json);
        const div = document.createElement("div");

        div.appendChild(text);
        messageBox.innerHTML = "";
        messageBox.appendChild(div);
    }
}

function playGame() {
    playerName = document.getElementById("playerName").value;
    console.log(playerName);
    if(playerName.length<3) {
        alert("You must enter your name before playing.");
        return;
    }    
    document.getElementById("startButton").style.display = "none";

    startTime = Date.now();
    score = 0;
    onTick();
}

function bugholeHTML(left, top, imgUrl) {
    return `
    <div class="bugOuter" style="left: ${left}px; top: ${top}px;">
        <div class="bugHole"></div>
        <div class="bug" style="background-image: url('${imgUrl}')"></div>
    </div>`;
}

for(let row = 0; row < 4; row++) {
    for(let column = 0; column < 4; column++) {
        let bugImg = bugImages[Math.floor(Math.random()*bugImages.length)];
        gameDiv.innerHTML += bugholeHTML(column*100, row*90, bugImg);
    }
}
const bugs = document.getElementsByClassName("bug");

for(let i = 0; i<bugs.length; i++) {
    bugs[i].onclick = splat;
}

function splat(event) {
    let obj = event.currentTarget;
    if(!obj.classList.contains("splat")) {
        obj.classList.add("splat");
        score ++;
        setTimeout(function() {
            obj.classList.remove("splat")
        }, 2000);
    }
}

function animate(obj) {
    obj.style.top = "0px";
    obj.classList.add("popup");
    setTimeout(function() {
        obj.classList.remove("popup");
        obj.style.top = "70px";
        obj.classList.add("hideagain");
        setTimeout(function() {
            obj.classList.remove("hideagain");
        }, 1500);
    }, 2000);
}

function onTick() {
    let elapsed = (Date.now() - startTime)/1000;
    //console.log(elapsed);
    countdown = 5 - Math.floor(elapsed);
    if(countdown >= 0) {
        countdownSpan.innerHTML = countdown;
        scoreSpan.innerHTML = score;

        // start animations
        for(let i = 0; i < bugs.length; i++) {
            if(elapsed < 19.0 && Math.floor(Math.random()*16 < 0.1)) {
                if(!bugs[i].classList.contains("popup") && !bugs[i].classList.contains("hideagain")) {
                    console.log("animating " + i);
                    animate(bugs[i]);    
                }
            }
        }
        setTimeout(onTick, 50);
    } else {
        document.getElementById("startButton").style.display = "inline-block";
        gameOver();
    }
}

document.getElementById("startButton").onclick = playGame;