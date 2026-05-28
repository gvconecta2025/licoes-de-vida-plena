// components/FeaturedBook.js

import { store } from '../state/store.js';

// ARQUITETURA: Componente de Destaque (Hero Component)
// Este componente é dedicado a criar uma apresentação cinematográfica e imersiva
// para o livro principal da landing page. Ele tem uma estrutura e estilo únicos
// para estabelecer hierarquia visual e capturar a atenção do usuário.

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
 * Trunca a sinopse para uma prévia curta e atraente.
 * @param {string} synopsis - O texto completo da sinopse.
 * @param {number} wordLimit - O número máximo de palavras.
 * @returns {string} A sinopse truncada.
 */
const truncateSynopsis = (synopsis, wordLimit = 35) => {
    const words = synopsis.split(' ');
    if (words.length <= wordLimit) {
        return synopsis;
    }
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
            <img src="${book.image}" alt="Capa do livro ${book.title}">
        </div>
        <div class="featured-book-details">
            <h2 class="featured-book-title">${book.title}</h2>
            ${book.subtitle ? `<h4 class="featured-book-subtitle">${book.subtitle}</h4>` : ''}
            <p class="featured-book-author">por ${book.author}</p>
            <p class="featured-book-synopsis">${truncateSynopsis(book.synopsis)}</p>
            ${priceHTML}
            <button class="btn-details">Ver Detalhes</button>
        </div>
    `;

    // INTERATIVIDADE: Reutilizando a arquitetura de modal existente.
    // Ao clicar no botão, despachamos a mesma ação que o BookCard despacha.
    // Isso desacopla completamente este componente do modal. Ele apenas informa
    // à 'store' a intenção do usuário, e o sistema reage.
    const detailsButton = featuredElement.querySelector('.btn-details');
    detailsButton.addEventListener('click', () => {
        store.dispatch({ type: 'OPEN_BOOK_MODAL', payload: book.id });
    });

    return featuredElement;
};