// components/FeaturedBook.js

import { store } from '../state/store.js';

// ARQUITETURA: Componente de Destaque (Hero Component)
// Refinado para incluir múltiplos CTAs (Calls to Action), transformando-o
// em uma ferramenta de marketing mais eficaz, além de ser uma vitrine.

const formatPrice = (value) => {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const truncateSynopsis = (synopsis, wordLimit = 35) => {
    const words = synopsis.split(' ');
    if (words.length <= wordLimit) return synopsis;
    return words.slice(0, wordLimit).join(' ') + '...';
};

/**
 * Cria e retorna o elemento DOM para a seção do livro em destaque.
 * @param {object} book - O objeto do livro a ser exibido.
 * @returns {HTMLElement} O elemento <div class="featured-book">.
 */
export const createFeaturedBook = (book) => {
    const featuredElement = document.createElement('div');
    featuredElement.className = 'featured-book';

    const priceHTML = `
        <div class="featured-book-price">
            ${book.oldPrice ? `<span class="old-price">${formatPrice(book.oldPrice)}</span>` : ''}
            <span class="current-price">${formatPrice(book.price)}</span>
        </div>
    `;

    featuredElement.innerHTML = `
        <div class="featured-book-cover">
            <img src="${book.image}" alt="Capa do livro ${book.title}" class="book-cover-glow">
        </div>
        <div class="featured-book-details">
            <h2 class="featured-book-title">${book.title}</h2>
            ${book.subtitle ? `<h4 class="featured-book-subtitle">${book.subtitle}</h4>` : ''}
            <p class="featured-book-author">por ${book.author}</p>
            <p class="featured-book-synopsis">${truncateSynopsis(book.synopsis)}</p>
            ${priceHTML}
            
            <!-- NOVOS BOTÕES DE AÇÃO -->
            <div class="featured-book-actions">
                <button class="btn btn-primary">Comprar Agora</button>
                <button class="btn btn-secondary">Ver Detalhes</button>
                <button class="btn btn-tertiary">Ler Amostra</button>
            </div>
        </div>
    `;

    // A imagem agora tem a classe 'book-cover-glow' para o efeito visual.

    // O botão "Ver Detalhes" (agora btn-secondary) mantém sua funcionalidade.
    const detailsButton = featuredElement.querySelector('.btn-secondary');
    detailsButton.addEventListener('click', () => {
        store.dispatch({ type: 'OPEN_BOOK_MODAL', payload: book.id });
    });

    // NOTA: Os outros botões são para fins de UI nesta fase.
    // Em uma aplicação completa, eles teriam seus próprios event listeners.

    return featuredElement;
};