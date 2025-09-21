document.addEventListener('DOMContentLoaded', () => {
    // Dados de produtos com a nova propriedade 'description'
    const products = [
        { id: 1, name: 'Pão Francês', price: 0.50, category: 'Salgados', image: 'https://redemix.vteximg.com.br/arquivos/ids/214544-1000-1000/6914.jpg?v=638351307421600000', description: 'Um pão crocante e macio, perfeito para qualquer hora do dia.' },
        { id: 2, name: 'Bolo de Chocolate', price: 15.00, category: 'Doces', image: 'assets/bolo.png', description: 'Delicioso bolo de chocolate com cobertura de ganache.' },
        { id: 3, name: 'Croissant', price: 4.50, category: 'Salgados', description: 'Clássico croissant amanteigado, crocante por fora e macio por dentro.' },
        { id: 4, name: 'Torta de Frango', price: 8.00, category: 'Salgados', description: 'Torta caseira com recheio cremoso de frango e massa super leve.' },
        { id: 5, name: 'Café Expresso', price: 3.00, category: 'Bebidas', description: 'Café expresso forte e aromático, feito com grãos selecionados.' },
        { id: 6, name: 'Suco de Laranja', price: 6.50, category: 'Bebidas', description: 'Suco de laranja natural, espremido na hora e sem adição de açúcar.' },
        { id: 7, name: 'Brigadeiro', price: 2.50, category: 'Doces', description: 'O clássico brigadeiro brasileiro, feito com chocolate de alta qualidade.' },
        { id: 8, name: 'Baguete', price: 5.50, category: 'Salgados', description: 'Baguete artesanal de casca crocante, ideal para lanches e sanduíches.' },
        { id: 9, name: 'Torta de Limão', price: 12.00, category: 'Doces', description: 'Torta com um sabor irresistível e azedinho de limão, com uma base de biscoito amanteigado.' }
    ];

    // Mapeamento de categorias e ícones
    const categories = [
        { name: 'Todos', icon: 'fas fa-utensils' },
        { name: 'Salgados', icon: 'fas fa-pizza-slice' },
        { name: 'Doces', icon: 'fas fa-cookie-bite' },
        { name: 'Bebidas', icon: 'fas fa-coffee' }
    ];

    let selectedCategory = 'Todos';

    // Elementos do DOM
    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryList = document.getElementById('category-list');
    const descriptionModal = document.getElementById('description-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    // Funções para renderização e interação
    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.innerHTML = `
                <div class="product-icon-container">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : `<i class="fas fa-utensils product-icon"></i>`}
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    };

    const renderCategories = () => {
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const categoryItem = document.createElement('button');
            categoryItem.className = `category-item ${selectedCategory === category.name ? 'active' : ''}`;
            categoryItem.dataset.category = category.name;
            categoryItem.innerHTML = `
                <i class="${category.icon} category-icon"></i>
                <span class="category-text">${category.name}</span>
            `;
            categoryList.appendChild(categoryItem);
        });
    };

    const openDescriptionModal = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            document.getElementById('modal-title').innerText = product.name;
            document.getElementById('modal-image').src = product.image || 'assets/placeholder.png'; // Usar uma imagem genérica se não houver
            document.getElementById('modal-description').innerText = product.description;
            document.getElementById('modal-price').innerText = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
            descriptionModal.classList.add('show');
        }
    };

    const closeDescriptionModal = () => {
        descriptionModal.classList.remove('show');
    };

    const filterProducts = () => {
        let filteredProducts = products;
        if (selectedCategory !== 'Todos') {
            filteredProducts = products.filter(p => p.category === selectedCategory);
        }
        
        const query = searchBar.value.toLowerCase();
        if (query) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(query));
        }
        
        renderProducts(filteredProducts);
    };

    // Event Listeners
    searchBar.addEventListener('input', () => {
        filterProducts();
    });

    categoryList.addEventListener('click', (e) => {
        const button = e.target.closest('.category-item');
        if (button) {
            selectedCategory = button.dataset.category;
            renderCategories();
            filterProducts();
        }
    });

    productGrid.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.id;
            openDescriptionModal(productId);
        }
    });

    closeModalButton.addEventListener('click', closeDescriptionModal);
    descriptionModal.addEventListener('click', (e) => {
        if (e.target === descriptionModal) {
            closeDescriptionModal();
        }
    });

    // Inicialização
    renderCategories();
    filterProducts();
});