// components/BookCard.js

import { store } from '../state/store.js';

// ARQUITETURA: Componente Funcional
// Esta função é um "componente". Ela recebe dados (o objeto 'book') e retorna
// uma representação visual (um elemento DOM). É uma peça de UI reutilizável e isolada.
// Ela não sabe onde será renderizada, apenas como se renderizar.

/**
 * Formata um número para a moeda brasileira (BRL).
 * @param {number} value - O valor numérico a ser formatado.
 * @returns {string} O valor formatado como string, ex: "R$ 29,90".
 */
const formatPrice = (value) => {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/**
 * Cria e retorna o elemento DOM para um único card de livro.
 * @param {object} book - O objeto do livro com todos os seus dados.
 * @returns {HTMLElement} O elemento <article> do card do livro.
 */
export const createBookCard = (book) => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.dataset.bookId = book.id; // Adiciona o ID para referência futura

    // LÓGICA DE PREÇO: Renderiza o preço antigo riscado se ele existir.
    const priceHTML = `
        <div class="book-card-price">
            ${book.oldPrice ? `<span class="old-price">${formatPrice(book.oldPrice)}</span>` : ''}
            <span class="current-price">${formatPrice(book.price)}</span>
        </div>
    `;

    card.innerHTML = `
        <div class="book-card-image-wrapper">
            <img src="${book.image}" alt="Capa do livro ${book.title}" class="book-card-image" loading="lazy">
        </div>
        <div class="book-card-content">
            <h3 class="book-card-title">${book.title}</h3>
            <p class="book-card-author">${book.author}</p>
            ${priceHTML}
        </div>
    `;

    // INTERATIVIDADE: Conectando a UI ao Estado Central
    // Ao clicar no card, despachamos uma ação para a store, informando
    // qual livro deve ser aberto no modal. A store então notificará
    // o renderer do modal para que ele se atualize.
    // Isso desacopla o card do modal. O card não precisa saber como o modal funciona.
    card.addEventListener('click', () => {
        store.dispatch({ type: 'OPEN_BOOK_MODAL', payload: book.id });
    });

    return card;
};
