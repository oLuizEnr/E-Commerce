let contador = 1; // Inicia o contador em 1

setInterval(function() { 
    document.getElementById('slide' + contador).checked = true; // Marca o slide correspondente ao contador
    contador++; // Incrementa o contador

    if (contador > 5) { // Se o contador ultrapassar 5
        contador = 1; // Reseta o contador para 1
    }
}, 3000); // Executa a função a cada 3 segundos (3000 ms)