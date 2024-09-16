let contador = 1; // Inicia o contador em 1

setInterval(function() { 
    document.getElementById('slide' + contador).checked = true; // Marca o slide correspondente ao contador
    contador++; // Incrementa o contador

    if (contador > 3) { // Se o contador ultrapassar 3
        contador = 1; // Reseta o contador para 1
    }
}, 4000); // Executa a função a cada 3 segundos (4000 ms)