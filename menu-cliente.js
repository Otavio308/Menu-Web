document.addEventListener('DOMContentLoaded', () => {
    // Dados de produtos (estrutura adaptada para o filtro de 2 níveis)
    const products = [
        // PRATOS - ENTRADAS
        { id: 1, name: 'Pão Francês', price: 0.50, type: 'Pratos', category: 'Entradas', image: 'https://redemix.vteximg.com.br/arquivos/ids/214544-1000-1000/6914.jpg?v=638351307421600000', description: 'Um pão crocante e macio, perfeito para qualquer hora do dia.' },
        { id: 3, name: 'Croissant', price: 4.50, type: 'Pratos', category: 'Entradas', description: 'Clássico croissant amanteigado, crocante por fora e macio por dentro.' },
        // PRATOS - PRINCIPAL
        { id: 4, name: 'Torta de Frango', price: 8.00, type: 'Pratos', category: 'Principal', description: 'Torta caseira com recheio cremoso de frango e massa super leve.' },
        { id: 8, name: 'XTudo', price: 18.00, type: 'Pratos', category: 'Principal', description: 'Sanduíche completo com hambúrguer, ovo, bacon, queijo, presunto e salada.' },
        { id: 9, name: 'Macarronada', price: 25.00, type: 'Pratos', category: 'Principal', description: 'Massa italiana com molho de tomate e carne moída.' },
        // PRATOS - SOBREMESAS
        { id: 2, name: 'Bolo de Chocolate', price: 15.00, type: 'Pratos', category: 'Sobremesas', image: 'assets/bolo.png', description: 'Delicioso bolo de chocolate com cobertura de ganache.' },
        { id: 7, name: 'Brigadeiro', price: 2.50, type: 'Pratos', category: 'Sobremesas', description: 'O clássico brigadeiro brasileiro, feito com chocolate de alta qualidade.' },
        // BEBIDAS - REFRIGERANTES
        { id: 10, name: 'Coca-Cola', price: 7.00, type: 'Bebidas', category: 'Refrigerantes', description: 'Refrigerante Coca-Cola gelado.' },
        { id: 5, name: 'Guaraná Antarctica', price: 6.00, type: 'Bebidas', category: 'Refrigerantes', description: 'Refrigerante Guaraná Antarctica gelado.' },
        // BEBIDAS - SUCOS
        { id: 6, name: 'Suco de Laranja', price: 6.50, type: 'Bebidas', category: 'Sucos', description: 'Suco de laranja natural, espremido na hora.' },
    ];
    
    // Estrutura de sub-categorias
    const MENU_STRUCTURE = {
        'Pratos': [
            { name: 'Todos os Pratos', category: 'Todos', icon: 'fas fa-utensils' },
            { name: 'Entradas', category: 'Entradas', icon: 'fas fa-bread-slice' },
            { name: 'Principal', category: 'Principal', icon: 'fas fa-pizza-slice' },
            { name: 'Sobremesas', category: 'Sobremesas', icon: 'fas fa-ice-cream' }
        ],
        'Bebidas': [
            { name: 'Todas as Bebidas', category: 'Todos', icon: 'fas fa-glass-martini-alt' },
            { name: 'Refrigerantes', category: 'Refrigerantes', icon: 'fas fa-box' },
            { name: 'Sucos', category: 'Sucos', icon: 'fas fa-lemon' }
        ]
    };

    // Variáveis de estado
    let selectedType = null; // Nenhum tipo selecionado por padrão (mostra Pratos + Bebidas)
    let selectedCategory = 'Todos'; // Inicia mostrando tudo
    
    // Elementos do DOM
    const menuBar = document.querySelector('.category-menu-bar');
    const togglePratos = document.getElementById('toggle-pratos');
    const toggleBebidas = document.getElementById('toggle-bebidas');
    const dropdownOverlay = document.getElementById('dropdown-overlay');
    const dropdownContent = document.getElementById('dropdown-content');
    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');
    const descriptionModal = document.getElementById('description-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    // Mapeamento de elementos do Modal
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');

    // Funções Utilitárias
    const formatPrice = (price) => `R$ ${price.toFixed(2).replace('.', ',')}`;

    // -------------------- LÓGICA DO DROPDOWN (MENU OCULTO) --------------------

    const closeDropdown = () => {
        dropdownOverlay.classList.remove('show');
        togglePratos.classList.remove('active');
        toggleBebidas.classList.remove('active');
        document.removeEventListener('click', handleOutsideClick);
    };

    // Função para fechar o dropdown ao clicar fora
    const handleOutsideClick = (event) => {
        const isClickedOnToggle = event.target.closest('.menu-dropdown-toggle');
        const isClickedInsideDropdown = event.target.closest('#dropdown-content');
        
        if (!isClickedOnToggle && !isClickedInsideDropdown) {
            closeDropdown();
        }
    };
    
    // Renderiza as sub-categorias dentro do menu flutuante
    const renderDropdownContent = (type) => {
        dropdownContent.innerHTML = '';
        const categories = MENU_STRUCTURE[type] || [];
        
        categories.forEach(cat => {
            const button = document.createElement('button');
            button.classList.add('category-item-dropdown');
            // Mantém o estado ativo na sub-categoria se for a selecionada
            if (cat.category === selectedCategory && type === selectedType) {
                button.classList.add('active');
            }
            button.dataset.category = cat.category;
            button.dataset.type = type; 
            button.innerHTML = `<i class="${cat.icon} category-icon"></i><span class="category-text">${cat.name}</span>`;
            
            // Listener para seleção de Sub-Categoria
            button.addEventListener('click', () => {
                selectedCategory = cat.category;
                selectedType = type; // Garante que o tipo principal também está setado
                filterProducts();
                closeDropdown(); 
                
                // Atualiza o estado visual do botão principal
                updateToggleButtons();
            });

            dropdownContent.appendChild(button);
        });
    };

    // Atualiza o estado visual dos botões principais (Pratos/Bebidas)
    const updateToggleButtons = () => {
        // Remove 'active' de todos
        [togglePratos, toggleBebidas].forEach(btn => btn.classList.remove('active'));
        
        // Adiciona 'active' ao tipo principal (após o filtro)
        if (selectedType === 'Pratos') {
            togglePratos.classList.add('active');
        } else if (selectedType === 'Bebidas') {
            toggleBebidas.classList.add('active');
        }
    };
    
    // -------------------- EVENTOS DE NAVEGAÇÃO --------------------
    menuBar.addEventListener('click', (e) => {
        const button = e.target.closest('.menu-dropdown-toggle');
        if (!button) return;

        const newType = button.dataset.type;
        const isOpen = dropdownOverlay.classList.contains('show');
        const sameTypeOpen = isOpen && selectedType === newType;

        // Se o mesmo dropdown já está aberto, desmarca o filtro (mostra tudo) e fecha
        if (sameTypeOpen) {
            selectedType = null;         // <-- permite mostrar Pratos + Bebidas quando desmarcado
            selectedCategory = 'Todos';
            closeDropdown();
            filterProducts();
            updateToggleButtons();
            return;
        }

        // Abre o dropdown para o novo tipo
        closeDropdown(); // garante fechamento antes de abrir outro
        selectedType = newType;

        // gerencia visualmente os botões principais
        [togglePratos, toggleBebidas].forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        renderDropdownContent(newType);
        dropdownOverlay.classList.add('show');
        document.addEventListener('click', handleOutsideClick);

        // posicionamento do conteúdo em relação ao botão
        const rect = button.getBoundingClientRect();
        let leftPosition = rect.left - (menuBar.getBoundingClientRect().left);
        dropdownContent.style.transform = `translateX(${leftPosition}px)`;
    });

    // -------------------- FILTRO E RENDERIZAÇÃO DE PRODUTOS --------------------

    // Função principal de filtro
    const filterProducts = () => {
        // 1. Filtra pelo Tipo Principal (se não houver selectedType -> mostra todos)
        let filteredProducts = selectedType ? products.filter(p => p.type === selectedType) : products.slice();
        
        // 2. Filtra pela Sub-categoria (se não for "Todos")
        if (selectedCategory !== 'Todos') {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }
        
        // 3. Filtra pela barra de busca
        const query = (searchBar?.value || '').toLowerCase(); 
        if (query) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
        }
        
        renderProducts(filteredProducts);
    };

    // Renderiza os cards de produtos
    const renderProducts = (filteredProducts) => {
        productGrid.innerHTML = '';
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p class="empty-list" style="color: var(--light-text-color); margin-top: 30px;">Nenhum item encontrado nesta categoria ou busca.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.dataset.id = product.id; 

            // Determina se usa imagem ou ícone (para itens sem imagem)
            let mediaHtml;
            if (product.image) {
                mediaHtml = `<img src="${product.image}" alt="${product.name}" class="product-image">`;
            } else {
                // Encontra o ícone da categoria para itens sem imagem
                const typeStructure = MENU_STRUCTURE[product.type] || [];
                const defaultIcon = typeStructure.find(c => c.category === product.category)?.icon || 'fas fa-utensils';
                mediaHtml = `<div class="product-icon-container" style="background-color: #f8f8f8; display: flex; justify-content: center; align-items: center; height: 110px;"><i class="${defaultIcon} product-icon" style="font-size: 40px; color: var(--light-text-color);"></i></div>`;
            }

            card.innerHTML = `
                ${mediaHtml}
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                </div>
            `;
            productGrid.appendChild(card);
        });
    };
    
    // -------------------- MODAL DE DESCRIÇÃO (UX 3) --------------------
    const openDescriptionModal = (productId) => {
        const product = products.find(p => p.id == productId);
        if (product) {
            modalTitle.textContent = product.name;
            modalDescription.textContent = product.description;
            modalPrice.textContent = formatPrice(product.price);
            
            if (product.image) {
                modalImage.src = product.image;
                modalImage.style.display = 'block';
            } else {
                 modalImage.style.display = 'none';
            }

            descriptionModal.classList.add('show');
        }
    };

    const closeDescriptionModal = () => {
        descriptionModal.classList.remove('show');
    };

    // -------------------- EVENT LISTENERS GERAIS --------------------

    searchBar.addEventListener('input', () => {
        closeDropdown(); 
        filterProducts();
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
    
    // -------------------- INICIALIZAÇÃO --------------------
    updateToggleButtons(); 
    filterProducts();
});