// components/BookModal.js

import { store } from '../state/store.js';

// ARQUITETURA: Componente de Overlay
// Este componente é responsável por criar a experiência imersiva de visualização
// de um livro. Ele é renderizado "por cima" do resto da aplicação.
// Sua lógica é autocontida: ele sabe como se exibir e como despachar a ação
// para se fechar, mas não se preocupa com o que o acionou.

/**
 * Formata um número para a moeda brasileira (BRL).
 * @param {number} value - O valor numérico a ser formatado.
 * @returns {string} O valor formatado como string.
 */
const formatPrice = (value) => {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/**
 * Cria e retorna o elemento DOM para o modal de detalhes do livro.
 * @param {object} book - O objeto do livro a ser exibido.
 * @returns {HTMLElement} O elemento <div class="modal-overlay">.
 */
export const createBookModal = (book) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // Adiciona uma classe para iniciar a animação de fade-in
    // A remoção da classe para fade-out será gerenciada pelo renderer.
    setTimeout(() => modalOverlay.classList.add('visible'), 10);

    const priceHTML = `
        <div class="book-modal-price">
            ${book.oldPrice ? `<span class="old-price">${formatPrice(book.oldPrice)}</span>` : ''}
            <span class="current-price">${formatPrice(book.price)}</span>
        </div>
    `;

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-btn" aria-label="Fechar modal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="book-modal-grid">
                <div class="book-modal-image-container">
                    <img src="${book.image}" alt="Capa do livro ${book.title}" class="book-modal-image">
                </div>
                <div class="book-modal-details">
                    <h2 class="book-modal-title">${book.title}</h2>
                    ${book.subtitle ? `<h4 class="book-modal-subtitle">${book.subtitle}</h4>` : ''}
                    <p class="book-modal-author">por ${book.author}</p>
                    ${priceHTML}
                    <div class="book-modal-synopsis">
                        <h3>Sinopse</h3>
                        <p>${book.synopsis.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // LÓGICA DE FECHAMENTO:
    // Despachar a ação 'CLOSE_BOOK_MODAL' para a store. A store irá atualizar
    // o estado, e o renderer principal irá remover o modal do DOM.

    const closeModal = () => {
        // Primeiro, remove a classe 'visible' para iniciar a animação de fade-out.
        modalOverlay.classList.remove('visible');
        // Espera a animação terminar antes de despachar a ação de fechamento.
        // O tempo (300ms) deve corresponder à duração da transição no CSS.
        setTimeout(() => {
            store.dispatch({ type: 'CLOSE_BOOK_MODAL' });
        }, 300);
    };

    const closeButton = modalOverlay.querySelector('.modal-close-btn');
    closeButton.addEventListener('click', closeModal);

    // Fechar ao clicar fora do conteúdo do modal (no overlay escuro).
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Impede que cliques dentro do modal fechem o modal (propagação de evento).
    const modalContent = modalOverlay.querySelector('.modal-content');
    modalContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Acessibilidade: Fechar com a tecla 'Escape'.
    // A gestão de adicionar/remover este listener será feita no renderer principal
    // para evitar listeners duplicados ou órfãos.
    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            closeModal();
            // Remove o listener de si mesmo após ser usado.
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);


    return modalOverlay;
};
