// Seleciona os elementos do HTML necessários
let listProductHTML = document.querySelector('.listProduct'); // Lista de produtos
let listCartHTML = document.querySelector('.listCart'); // Lista de produtos no carrinho
let iconCart = document.querySelector('.icon-cart'); // Ícone do carrinho
let iconCartSpan = document.querySelector('.icon-cart span'); // Indicador de quantidade no ícone do carrinho
let body = document.querySelector('body'); // Corpo do documento para manipular a exibição do carrinho
let closeCart = document.querySelector('.close'); // Botão para fechar o carrinho
let nomeProduto = document.getElementById('nomeProduto'); // Campo de pesquisa
let products = []; // Array para armazenar os produtos
let cart = []; // Array para armazenar os produtos no carrinho

// Adiciona evento de clique no ícone do carrinho para abrir/fechar o carrinho
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); // Alterna a classe 'showCart', que controla a exibição
})

// Adiciona evento de clique para fechar o carrinho
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart'); // Alterna a exibição do carrinho
})

// Função para adicionar os produtos na interface HTML
const addDataToHTML = (filteredProducts = products) => {
    listProductHTML.innerHTML = ''; // Limpa os produtos existentes na lista
    if (filteredProducts.length > 0) { // Se houver produtos filtrados
        filteredProducts.forEach(product => {
            let newProduct = document.createElement('div'); // Cria um novo elemento div para cada produto
            newProduct.dataset.id = product.id; // Atribui o ID do produto como um atributo de dados
            newProduct.classList.add('item'); // Adiciona a classe 'item' para estilização
            newProduct.innerHTML = `
                <a href="${product.produto}">
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">R$${product.price}</div>
                </a>
                <button class="addCart" style="cursor:pointer">Comprar</button>`; // Monta o HTML do produto com nome, imagem, preço e botão
            listProductHTML.appendChild(newProduct); // Adiciona o novo produto à lista de produtos no HTML
        });
    } else {
        listProductHTML.innerHTML = '<p>Nenhum produto encontrado.</p>'; // Exibe uma mensagem se não houver produtos correspondentes
    }
}

// Evento para buscar produtos à medida que o usuário digita
nomeProduto.addEventListener('input', (e) => {
    let searchQuery = e.target.value.toLowerCase(); // Obtém o valor da pesquisa em letras minúsculas
    let filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery) // Verifica se o nome do produto contém o termo pesquisado
    );
    addDataToHTML(filteredProducts); // Atualiza a exibição da lista de produtos com os resultados filtrados
});

// Evento de clique na lista de produtos para adicionar ao carrinho
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target; // Identifica onde o usuário clicou
    if (positionClick.classList.contains('addCart')) { // Verifica se foi clicado no botão 'Comprar'
        let id_product = positionClick.parentElement.dataset.id; // Obtém o ID do produto
        addToCart(id_product); // Chama a função para adicionar o produto ao carrinho
    }
});

// Função para adicionar produtos ao carrinho
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id); // Procura o índice do produto no carrinho
    if (cart.length <= 0) { // Se o carrinho estiver vazio, adiciona o primeiro produto
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) { // Se o produto não estiver no carrinho, adiciona com quantidade 1
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else { // Se o produto já estiver no carrinho, aumenta a quantidade
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML(); // Atualiza o carrinho no HTML
    addCartToMemory(); // Armazena o carrinho no localStorage
}

// Função para armazenar o carrinho no localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart)); // Salva o carrinho em formato JSON no localStorage
}

// Função para atualizar a exibição do carrinho no HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = ''; // Limpa o conteúdo anterior do carrinho
    let totalQuantity = 0; // Variável para armazenar a quantidade total de itens
    if (cart.length > 0) { // Se houver itens no carrinho
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity; // Soma a quantidade total de itens
            let newItem = document.createElement('div'); // Cria um novo elemento div para cada item do carrinho
            newItem.classList.add('item'); // Adiciona a classe 'item'
            newItem.dataset.id = item.product_id; // Atribui o ID do produto como atributo de dados

            let positionProduct = products.findIndex((value) => value.id == item.product_id); // Encontra o produto correspondente no array de produtos
            let info = products[positionProduct]; // Obtém as informações do produto
            listCartHTML.appendChild(newItem); // Adiciona o novo item ao carrinho no HTML
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div> <!-- Exibe o preço total -->
                <div class="quantity">
                    <span class="minus"><</span> <!-- Botão para diminuir a quantidade -->
                    <span>${item.quantity}</span> <!-- Quantidade atual -->
                    <span class="plus">></span> <!-- Botão para aumentar a quantidade -->
                </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity; // Atualiza a quantidade total de itens no ícone do carrinho
}

// Evento de clique no carrinho para aumentar ou diminuir a quantidade de itens
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target; // Identifica onde o usuário clicou
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){ // Verifica se foi clicado para aumentar ou diminuir
        let product_id = positionClick.parentElement.parentElement.dataset.id; // Obtém o ID do produto
        let type = 'minus'; // Define a ação como 'diminuir'
        if(positionClick.classList.contains('plus')){ // Se clicou no botão de aumentar, muda o tipo para 'aumentar'
            type = 'plus';
        }
        changeQuantityCart(product_id, type); // Chama a função para alterar a quantidade do produto no carrinho
    }
})

// Função para alterar a quantidade de itens no carrinho
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id); // Encontra o índice do produto no carrinho
    if(positionItemInCart >= 0){ // Se o produto estiver no carrinho
        let info = cart[positionItemInCart]; // Obtém as informações do item
        switch (type) {
            case 'plus': // Se for para aumentar a quantidade
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default: // Se for para diminuir a quantidade
                let changeQuantity = cart[positionItemInCart].quantity - 1; // Calcula a nova quantidade
                if (changeQuantity > 0) { // Se a quantidade for maior que 0, atualiza
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{ // Se a quantidade for 0, remove o item do carrinho
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML(); // Atualiza o carrinho no HTML
    addCartToMemory(); // Atualiza o carrinho no localStorage
}

// Inicializa o aplicativo
const initApp = () => {
    fetch('products.json') // Busca os dados dos produtos de um arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        products = data; // Armazena os produtos
        addDataToHTML(); // Adiciona os produtos no HTML

        // Busca os dados do carrinho no localStorage
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart')); // Converte os dados do localStorage para um objeto JavaScript
            addCartToHTML(); // Atualiza o carrinho no HTML
        }
    });
}
initApp(); // Chama a função para inicializar o aplicativo