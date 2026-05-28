// components/BookModal.js

import { store } from '../state/store.js';

// ARQUITETURA: Componente de Overlay
// Refinado para incluir os mesmos CTAs da seção de destaque, garantindo
// uma experiência de usuário consistente, não importa como ele chegue
// aos detalhes do livro.

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
                    <img src="${book.image}" alt="Capa do livro ${book.title}" class="book-modal-image book-cover-glow">
                </div>
                <div class="book-modal-details">
                    <h2 class="book-modal-title">${book.title}</h2>
                    ${book.subtitle ? `<h4 class="book-modal-subtitle">${book.subtitle}</h4>` : ''}
                    <p class="book-modal-author">por ${book.author}</p>
                    ${priceHTML}
                    
                    <!-- NOVOS BOTÕES DE AÇÃO -->
                    <div class="book-modal-actions">
                        <button class="btn btn-primary">Comprar Agora</button>
                        <button class="btn btn-tertiary">Ler Amostra</button>
                    </div>

                    <div class="book-modal-synopsis">
                        <h3>Sinopse</h3>
                        <p>${book.synopsis.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // A imagem agora tem a classe 'book-cover-glow' para o efeito visual.

    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        setTimeout(() => {
            store.dispatch({ type: 'CLOSE_BOOK_MODAL' });
        }, 300);
    };

    modalOverlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) closeModal();
    });
    modalOverlay.querySelector('.modal-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);

    return modalOverlay;
};