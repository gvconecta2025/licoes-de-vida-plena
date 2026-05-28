// render/renderLandingPage.js

import { createFeaturedBook } from '../components/FeaturedBook.js';
import { createBookCard } from '../components/BookCard.js';

// ARQUITETURA: Render Engine com Lógica de Curadoria
// Este módulo foi promovido para ser o cérebro da apresentação da homepage.
// Ele consome tanto a lista de livros quanto as configurações de curadoria
// para construir a página exatamente como o administrador a projetou.

const renderFeaturedBook = (container, featuredBook) => {
    container.innerHTML = '';
    if (featuredBook) {
        const featuredElement = createFeaturedBook(featuredBook);
        container.appendChild(featuredElement);
    }
};

const renderSuggestedBooks = (gridContainer, suggestedBooks) => {
    gridContainer.innerHTML = '';
    if (suggestedBooks.length > 0) {
        const fragment = document.createDocumentFragment();
        suggestedBooks.forEach(book => {
            const card = createBookCard(book);
            fragment.appendChild(card);
        });
        gridContainer.appendChild(fragment);
    }
};

/**
 * Orquestra a renderização de toda a página principal.
 * @param {object} containers - Um objeto contendo os elementos DOM necessários.
 * @param {Array<object>} books - A lista completa de livros vinda do estado.
 * @param {object} settings - As configurações da homepage (ex: featuredBookId).
 */
export const renderLandingPage = (containers, books, settings) => {
    const { featuredContainer, suggestedGrid, suggestedSection } = containers;

    // LÓGICA DE CURADORIA:
    // 1. Encontra o livro em destaque com base no ID salvo nas configurações.
    const featuredBook = settings.featuredBookId
        ? books.find(book => book.id === settings.featuredBookId)
        : null;

    // 2. Prepara a lista de sugestões.
    const suggestedBooks = books
        // Filtra para remover o livro que já está em destaque.
        .filter(book => book.id !== settings.featuredBookId)
        // Ordena pelo campo 'displayOrder'. Livros sem ordem (ou com ordem 0)
        // são empurrados para o final.
        .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

    // Renderiza as duas seções com os dados curados.
    renderFeaturedBook(featuredContainer, featuredBook);
    renderSuggestedBooks(suggestedGrid, suggestedBooks);

    // Gerencia a visibilidade da seção de sugestões.
    suggestedSection.style.display = suggestedBooks.length > 0 ? 'block' : 'none';

    // Gerencia os estados de "página vazia" ou "sem destaque".
    if (books.length === 0) {
        featuredContainer.innerHTML = `
            <div class="empty-state">
                <p>Nenhum livro na coleção.</p>
                <span>Use o painel de administração para adicionar o primeiro livro.</span>
            </div>
        `;
    } else if (!featuredBook) {
        // NOVO ESTADO: Há livros, mas nenhum foi escolhido como destaque.
        featuredContainer.innerHTML = `
            <div class="empty-state">
                <p>Nenhum livro em destaque selecionado.</p>
                <span>Use o painel de administração para escolher um.</span>
            </div>
        `;
    }
};