let allPictures = ["slike/arsenal.png", "slike/atalanta.png", "slike/Atletico.png", "slike/Barcelona.png", "slike/Bayern.png",
    "slike/Benfica.png", "slike/Bilbao.png", "slike/Boca.png", "slike/Bordeaux.png", "slike/Borussia.png", "slike/chelsea.png",
    "slike/Cruzeiro.png", "slike/Cukaricki.png", "slike/fiorentina.png", "slike/inter.png", "slike/juventus.png",
    "slike/lazio.png", "slike/leicester.png", "slike/Leipzig.png", "slike/Valencia.png", "slike/Vasco.png", "slike/Villarreal.png",
    "slike/Vojvodina.png", "slike/wolverhampton.png", "slike/zvezda.png", "slike/leverkuzen.png", "slike/lion.png", "slike/liverpool.png",
    "slike/manchestersity.png", "slike/manchesterunited.png", "slike/Marseille.png", "slike/milan.png", "slike/Monaco.png", "slike/napoli.png",
    "slike/Olympiacos.png", "slike/Panathinaikos.png", "slike/parma.png", "slike/Partizan.png", "slike/Porto.png", "slike/PSG.png",
    "slike/Radnicki.png", "slike/River.png", "slike/roma.png", "slike/Schalke.png", "slike/sentetjen.png", "slike/Sevilla.png",
    "slike/Slavia.png", "slike/Sparta.png", "slike/Sporting.png", "slike/tottenham.png"
];

let allCards = document.querySelector("#grid-container");
let baza = window.localStorage;
let tabela = baza.getItem('tabela');

const index = {
    lako: 16,
    srednje: 36,
    tesko: 64,
    ekspert: 100
};

if (tabela == null) {
    baza.setItem('tabela', JSON.stringify({
        lako: [],
        srednje: [],
        tesko: [],
        ekspert: []
    }));
}

function getRadioValue() {
    let checkedRadio = document.querySelector("input[name='level']:checked");
    return checkedRadio.value;
};
let checkedRadioValue = getRadioValue();

window.canCount = true;
window.mainTimer = null;

let inputTajmer = document.getElementById('tajmer');
const userName = document.getElementsByClassName("userName")[0];

if (baza.getItem('username') != null) {
    userName.value = baza.getItem('username');
}

function pokreniIgru(event, baza) {
    userName.disabled = true;
    let chose = document.querySelectorAll("input[name='level']");
    chose.forEach(elem => {
        elem.disabled = true;
    });
    let un = event.target.value;

    baza.setItem('username', un);

    let tajmer = 0;

    let checkedRadioValue = getRadioValue();

    renderGrid(checkedRadioValue);

    window.mainTimer = setInterval(function() {

        if (window.canCount) {

            tajmer += 1;

            inputTajmer.value = tajmer;
        } else {

            clearInterval(window.mainTimer);

            let tabela = JSON.parse(baza.getItem('tabela'));

            tabela[getRadioValue()].push({ username: baza.getItem('username'), time: tajmer });

            let handle = tabela[getRadioValue()].sort(({ time: a }, { time: b }) => a - b).slice(0, 5);

            tabela[getRadioValue()] = handle;

            baza.setItem('tabela', JSON.stringify(tabela));
            userName.disabled = false;
            chose.forEach(elem => {
                elem.disabled = true;
            });
        }

    }, 1000);
}

userName.addEventListener("keydown", ({ key }) => {
    if (key === "Enter") {
        event.preventDefault();
        if (userName.value.length == 0 || userName.value == null || userName.value.length > 17) {
            alert('Unesite odgovarajuce korisnicko ime')
        } else {
            pokreniIgru(event, baza);
        }
        console.log(checkedRadioValue);
    }
})

//pravljenje odgovarajuceg niza slika
function renderGrid(tezina) {
    let numCard = index[tezina] / 2;
    let pictureEasy = [];
    for (let i = 0; i < numCard; i++) {
        pictureEasy.push(allPictures[i]);
        pictureEasy.push(allPictures[i]);
    };

    // mesanje slika
    let shufle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };
    shufle(pictureEasy);


    // dohvatanje diva i dodavanje elemenata 
    let divGame = document.getElementById("grid-container");
    divGame.classList.add('x' + index[tezina]);

    pictureEasy.forEach(elem => {
        let divPicture = document.createElement("div");
        divPicture.classList.add("card"); //ispod menjam
        divPicture.dataset.mark = `${elem}`;
        divPicture.innerHTML += `<img class="front-face" src="${elem}">
    <img class="back-face" src="slike/trofej.jpg">`;
        divGame.appendChild(divPicture);
    });

    document.addEventListener('click', function(e) {

        let parent = e.target.parentNode;

        if (e.target && parent.classList.contains('card')) {

            if (countOpenCards() < 2) parent.classList.add('flip');

            if (parent.classList.contains('solved')) {

                return false;
            }

            let cards = getFliped();

            if (countOpenCards() == 2) {

                let first = cards[0].dataset.mark;
                let second = cards[1].dataset.mark;

                if (first == second) {
                    cards[0].classList.add('solved');
                    cards[1].classList.add('solved');
                } else {

                    let t1 = setTimeout(() => {

                        clearTimeout(t1);

                        cards[0].classList.remove('flip');
                        cards[1].classList.remove('flip');
                    }, 1500);
                }
            }

            if (countSolved() == index[tezina]) {

                window.canCount = false;

                var t2 = setTimeout(() => {

                    if (confirm('Kraj igre, Da li zelite novu igru?')) {

                        window.location.reload();
                    }

                    clearTimeout(t2);

                }, 1500);
            }
        }
    });


};

function getFliped() {
    let parent = document.getElementById('grid-container');
    return parent.querySelectorAll('.card.flip:not(.solved)');
}

function countOpenCards() {
    let parent = document.getElementById('grid-container');
    return parent.querySelectorAll('.card.flip:not(.solved)').length;
};

function countSolved() {
    let parent = document.getElementById('grid-container');
    return parent.querySelectorAll('.card.solved').length;
};

let btn = document.querySelectorAll('.btn');

function hideBox() {
    let box = document.querySelectorAll('.box');
    for (i = 0; i < box.length; i++) {
        box[i].style.display = "none";
    }
};
for (var i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', function(event) {
        event.preventDefault();
        let id = event.target.id;

        let lista = JSON.parse(tabela);
        let res = lista[id];

        let html = '';
        for (let x in res) {
            html += '<tr>';
            html += '<td>' + (parseInt(x) + 1) + "." + '</td>';
            html += '<td>' + res[x].username + '</td>';
            html += '<td>' + res[x].time + '</td>';
            html += '</tr>';
        };
        hideBox();
        let rezultat = document.querySelector('.' + id);
        document.querySelector('.' + id + ' tbody').innerHTML = html;
        rezultat.style.display = "block";
    });
}
document.getElementById("lako").click();