var punteggio = 0;

$(document).ready(function () {
    //---HOME---
    cambiaTxt();


    //---QUIZ---
    nascondi();
    $(".answer").click(contaPunti);

    //---SUBNETTING---
    var slider = document.getElementById("host");
    var output = document.getElementById("range-txt");
    output.innerHTML = "Numero di reti: " + slider.value;

    slider.oninput = function () {
        output.innerHTML = "Numero di reti: " + this.value;
    }


    var ip;
    var subnet;
    var numReti;

    $("#trasforma").click(function () {
        ip = $("input[name=ip]").val();

        subnet = parseInt($("input[name=subnet]").val()+0)/10;

        numReti = parseInt($("input[name=reti]").val());

        inputIPControl(numReti, ip, subnet);


    });




});

function cambiaTxt() {
    var t = ["i love JavaScript!", "Hi my name is Anton", "Tetris!!!", "Damn it!", "Baby Gronk", "Schibidi gabinetto", "Duke Dennis", "Kai Cenat"];
    var randomNumber = Math.floor(Math.random() * t.length);

    $("#tit-rot").html("" + t[randomNumber]);
}


//--------------------------------GESTIONE PAGINA(subnetting)------------------------------------

function inputIPControl(n, ip, sm) {
    var ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    var errore;
    var rangeReti = Math.pow(2, (32 - sm)) / (Math.pow(2, Math.ceil(Math.log2(n))));

    $("#ip").css("border-color", "black");
    $("#sm").css("border-color", "black");
    $("#host").css("border-color", "black");
    $(".subnets").empty();
    $(".net-range").empty();
    $(".host-range").empty();
    $(".num-host").empty();

    if (ip == "") {
        $("#ip").css("border-color", "red");
        errore = true;
    }
    else if (!ipRegex.test(ip)) {
        $("#ip").css("border-color", "red");
        $("#range-txt").css("border-color", "red");
        errore = true;
    }

    console.log(sm);

    if (sm == 0) {
        $("#sm").css("border-color", "red");
        errore = true;
    }
    else if (sm>32) {
        $("#sm").css("border-color", "red");
        errore = true;
    }

    if(rangeReti-2 == 0){
        $("#host").css("border-color", "red");
        errore = true;
    }

    if (!errore) {
        subnetting(n, ip, sm, rangeReti);
    }
}

//--------------------------------FINE GESTIONE PAGINA(subnetting)------------------------------

//--------------------------------GESTIONE QUIZ SUBN------------------------------

function nascondi() {
    $(".question2").hide();
    $(".question3").hide();
    $(".question4").hide();
    $(".question5").hide();
    $(".question6").hide();
    $(".question7").hide();
    $(".question8").hide();
    $(".question9").hide();
    $(".question10").hide();
    $(".result").hide();
}

function contaPunti() {

    switch($(this).attr("id")) { //controllo con l'id che sarebbe una delle 4 opzioni
        case "1A": case "1B": case "1C": case "1D": { //controllo prima domanda
            if($(this).attr("id")=="1B")  punteggio++;
            $(".question1").hide();
            $(".question2").show();
            break;
        }
        
        case "2A": case "2B": case "2C": case "2D": { //controllo seconda domanda
            if($(this).attr("id")=="2D")  punteggio++;
            $(".question2").hide();
            $(".question3").show();
            break;
        }

        case "3A": case "3B": case "3C": case "3D": { //controllo terza domanda
            if($(this).attr("id")=="3A")  punteggio++;
            $(".question3").hide();
            $(".question4").show();
            break;
        }

        case "4A": case "4B": case "4C": case "4D": { //controllo quarta domanda
            if($(this).attr("id")=="4C")  punteggio++;
            $(".question4").hide();
            $(".question5").show();
            break;
        }

        case "5A": case "5B": case "5C": case "5D": { //controllo quinta domanda
            if($(this).attr("id")=="5B")  punteggio++;
            $(".question5").hide();
            $(".question6").show();
            break;
        }

        case "6A": case "6B": case "6C": case "6D": { //controllo sesta domanda
            if($(this).attr("id")=="6D")  punteggio++;
            $(".question6").hide();
            $(".question7").show();
            break;
        }

        case "7A": case "7B": case "7C": case "7D": { //controllo settima domanda
            if($(this).attr("id")=="7C")  punteggio++;
            $(".question7").hide();
            $(".question8").show();
            break;
        }

        case "8A": case "8B": case "8C": case "8D": { //controllo ottava domanda
            if($(this).attr("id")=="8D")  punteggio++;
            $(".question8").hide();
            $(".question9").show();
            break;
        }

        case "9A": case "9B": case "9C": case "9D": { //controllo nona domanda
            if($(this).attr("id")=="9D")  punteggio++;
            $(".question9").hide();
            $(".question10").show();
            break;
        }

        case "10A": case "10B": { //controllo decima domanda
            if($(this).attr("id")=="10A")  punteggio++;
            $(".question10").hide();
            $(".result").show();
            $(".consegna").hide();
            $(".risultato").html("Hai fatto: "+punteggio+"/10");
            $(".progress-bar").html(punteggio*10+"%");
            anima();
            break;
        }

    }
}

function anima() {
    $(".progress-bar").animate({width: punteggio*10+"%"},1000);
}

//--------------------------------FINE GESTIONE QUIZ SUBN------------------------------



//--------------------------------GESTIONE DEL SUBNETTING---------------------------------------

function subnetting(n, ip, sm, rangeReti) {
    //calcolo del range delle reti
    //log2 del numero delle reti per ottenere il numero di bit da usare
    //ceil per arrotondare sempre in eccesso
    //numero di host totale / numero di combinazioni possibili per numero di reti

    var newsm = sm + Math.ceil(Math.log2(n));
    var bitsm = '1'.repeat(newsm) + '0'.repeat(32 - newsm); //da CIDR a binario per la subnet
    var bitip = toBit(ip);


    //inizializzazione
    var netip = logicAND(bitip, bitsm); //prende la rete in bit
    var start = netip;
    var end = netip;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < rangeReti; j++) { //incrementa per il numero di host di ogni rete
            end = incrementIPAddress(end);
        }

        end = decrementIPAddress(end); //perche' l'ultimo e' il primo della rete dopo -1

        $(".subnets").append(toDecimal(bitsm) + "/" + newsm + "<br>");
        $(".net-range").append("" + toDecimal(start) + '/' + newsm + " - " + toDecimal(end) + '/' + newsm + "<br>");
        $(".host-range").append("" + toDecimal(incrementIPAddress(start)) + '/' + newsm + " - " + toDecimal(decrementIPAddress(end)) + '/' + newsm + "<br>");
        $(".num-host").append("" + (rangeReti - 2) + "<br>");

        //preparazione per la rete successiva        
        start = incrementIPAddress(end);
        end = start;
    }
}

function incrementIPAddress(ip) {
    var carry = 1; // Carry per il riporto
    var newIP = ''; // Stringa per il nuovo indirizzo IP

    // Scansiona i bit dell'indirizzo IP dall'ultimo al primo
    for (var i = ip.length - 1; i >= 0; i--) {
        var bit = ip[i]; // Ottieni il bit corrente

        if (carry === 1) { // Se c'è un carry
            if (bit === '0') { // Se il bit è 0, diventa 1 e il carry diventa 0
                newIP = '1' + newIP;
                carry = 0;
            } else { // Se il bit è 1, diventa 0 e il carry rimane 1
                newIP = '0' + newIP;
            }
        } else { // Se non c'è carry, il bit rimane invariato
            newIP = bit + newIP;
        }
    }

    if (carry === 1) { // Se c'è ancora un carry dopo aver scansionato tutti i bit, l'indirizzo IP è fuori range
        throw "Indirizzo IP fuori range";
    }

    return newIP;
}

function decrementIPAddress(ip) {
    var borrow = 1; // Borrow per il riporto
    var newIP = ''; // Stringa per il nuovo indirizzo IP

    // Scansiona i bit dell'indirizzo IP dall'ultimo al primo
    for (var i = ip.length - 1; i >= 0; i--) {
        var bit = ip[i]; // Ottieni il bit corrente

        if (borrow === 1) { // Se c'è un borrow
            if (bit === '1') { // Se il bit è 1, diventa 0 e il borrow diventa 0
                newIP = '0' + newIP;
                borrow = 0;
            } else { // Se il bit è 0, diventa 1 e il borrow rimane 1
                newIP = '1' + newIP;
            }
        } else { // Se non c'è borrow, il bit rimane invariato
            newIP = bit + newIP;
        }
    }

    if (borrow === 1) { // Se c'è ancora un borrow dopo aver scansionato tutti i bit, l'indirizzo IP è fuori range
        throw "Indirizzo IP fuori range";
    }

    return newIP;
}

function logicAND(ip, sm) {
    var newip = "";

    for (var i = 0; i < 32; i++) {
        //se il bit della subnet =0 allora anche il bit della rete =0
        if (sm[i] != '0') newip += ip[i];
        else newip += '0';
    }

    return newip;
}

function toBit(s) {
    // divide l'ip in ottetti
    var octets = s.split('.');

    // converte ogni ottetto in binario
    var binaryArray = octets.map(function (octet) { //callback
        var binary = parseInt(octet, 10).toString(2).padStart(8, '0');
        return binary;
    });

    //returna con il punto
    return binaryArray.join('');
}

//preso un ip in binario senza '.' tra gli ottetti
function toDecimal(binaryIp) {
    var octets = [];

    //inserisce una stringa di 8 bit per 4 volte in un vettore di stringhe
    for (var i = 0; i < 4; i++) {
        octets.push(binaryIp.substr(i * 8, 8));
    }

    //trasforma gli otteti da binario a decimale
    var decimalOctets = octets.map(function (octet) { //.map crea una stringa di copia per ogni ottetto
        return parseInt(octet, 2);
    });

    return decimalOctets.join('.'); //da vettore di stringhe, passa a stringa unica con '.' tra quelle che prima erano stringhe separate
}

//--------------------------------FINE GESTIONE DEL SUBNETTING---------------------------------------
