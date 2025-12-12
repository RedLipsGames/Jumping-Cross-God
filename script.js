const FILAS = 29;
const COLUMNAS = 7;

let filaActual = 1;

// Contador de muertes por fila
let muertesPorFila = Array(FILAS).fill(0);

// Generador de número aleatorio entre min y max (inclusive)
function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera una fila aleatoria con minas y seguros
function generarFilaAleatoria(numeroMinas) {
    let fila = Array(COLUMNAS).fill("safe");
    let minasColocadas = 0;

    while (minasColocadas < numeroMinas) {
        let pos = rng(0, COLUMNAS - 1);
        if (fila[pos] !== "mine") {
            fila[pos] = "mine";
            minasColocadas++;
        }
    }

    return fila;
}

// Genera todas las filas del juego
function generarFilas() {
    let filas = [];
    for (let i = 1; i <= FILAS; i++) {
        if (i === 1 || i === FILAS) {
            filas.push(generarFilaAleatoria(6)); // 6 minas, 1 seguro
        } else {
            filas.push(generarFilaAleatoria(1)); // 1 mina, 6 seguros
        }
    }
    return filas;
}

let filas = generarFilas();

// Dibuja el juego
function dibujarJuego() {
    const juego = document.getElementById("juego");
    juego.innerHTML = "";

    for (let i = FILAS; i >= 1; i--) {
        let div = document.createElement("div");
        div.className = "fila";

        if (i === filaActual) div.classList.add("activa");
        if (i < filaActual) div.classList.add("completada");
        if (i > filaActual) div.classList.add("bloqueada");

        // Span para mostrar muertes de la fila
        let spanMuertes = document.createElement("span");
        spanMuertes.className = "muertes";
        spanMuertes.innerText = muertesPorFila[i - 1] + " 💀";
        div.appendChild(spanMuertes);

        for (let c = 0; c < COLUMNAS; c++) {
            let btn = document.createElement("button");
            let img = document.createElement("img");
            img.src = "pngwing.png"; // ruta de tu imagen
            img.alt = "Botón";
            img.width = 50; // ajustar al tamaño del botón
            img.height = 50;
            btn.appendChild(img);

            if (i !== filaActual) {
                btn.disabled = true;
            } else {
                btn.onclick = () => seleccionar(i, c, btn);
            }

            div.appendChild(btn);
        }
        let spanProbabilidad = document.createElement("span");
        spanProbabilidad.className = "probabilidad";

        if (i === 1 || i === FILAS) {
            spanProbabilidad.innerText = "1/7 Ganar☠️";
        } else {
            spanProbabilidad.innerText = "6/7 Ganar 😍";
        }

        div.appendChild(spanProbabilidad); // Se añade al final de la fila

        juego.appendChild(div);
    }
}

// Función al seleccionar un botón
function seleccionar(fila, col, boton) {

    if (filas[fila - 1][col] === "mine") {
        boton.style.background = "red";

        // Incrementar muertes en esta fila
        muertesPorFila[fila - 1]++;

        bloquearFila(filaActual);
        setTimeout(() => {
            filaActual = 1;
            filas = generarFilas();
            dibujarJuego();
        }, 1500);
        return;
    }

    // Botón azul si aciertas
    boton.style.background = "blue";

    if (filaActual < FILAS) {
        filaActual++;
        dibujarJuego();
    } else {
        dibujarJuego();
        setTimeout(() => {
            alert("🎉 ¡Has completado las 29 filas! Reiniciando juego.");
            filaActual = 1;
            filas = generarFilas();
            dibujarJuego();
        }, 500);
    }
}

// Bloquea temporalmente la fila actual
function bloquearFila(fila) {
    const filasDOM = document.querySelectorAll(".fila");
    const index = FILAS - fila;
    const botones = filasDOM[index].querySelectorAll("button");
    botones.forEach(btn => btn.disabled = true);
}

// Inicializa el juego
dibujarJuego();
