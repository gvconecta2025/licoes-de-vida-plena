// render/renderLandingPage.js

import { createFeaturedBook } from '../components/FeaturedBook.js';
import { createBookCard } from '../components/BookCard.js';

// ARQUITETURA: Render Engine da Página Principal
// Este módulo foi refatorado para orquestrar a renderização de toda a landing page,
// incluindo a seção de destaque e a grade de sugestões. Ele é o responsável por
// traduzir a lista de livros do estado em uma estrutura visual hierárquica.

/**
 * Renderiza a seção do livro em destaque.
 * @param {HTMLElement} container - O elemento DOM para a seção de destaque.
 * @param {object | undefined} featuredBook - O objeto do livro em destaque.
 */
const renderFeaturedBook = (container, featuredBook) => {
    container.innerHTML = ''; // Limpa o container antes de renderizar
    if (featuredBook) {
        const featuredElement = createFeaturedBook(featuredBook);
        container.appendChild(featuredElement);
    } else {
        // Opcional: Renderizar um placeholder se não houver livro em destaque.
        // Por enquanto, deixamos em branco.
    }
};

/**
 * Renderiza a grade de livros sugeridos.
 * @param {HTMLElement} gridContainer - O elemento DOM para a grade de sugestões.
 * @param {Array<object>} suggestedBooks - A lista de livros para a grade.
 */
const renderSuggestedBooks = (gridContainer, suggestedBooks) => {
    // CORREÇÃO CRÍTICA DO BUG DE SINCRONIZAÇÃO MÓVEL:
    // A abordagem anterior de "diffing" manual do DOM era frágil e causava
    // inconsistências. A nova abordagem é mais robusta e declarativa:
    // 1. Limpar completamente o container.
    // 2. Recriar todos os cards a partir do estado atual.
    // Para a quantidade de livros em uma landing page, o impacto de performance
    // é mínimo, mas a confiabilidade é máxima. O DOM é sempre um reflexo
    // perfeito do estado, em qualquer dispositivo.
    gridContainer.innerHTML = '';

    if (suggestedBooks.length > 0) {
        const fragment = document.createDocumentFragment();
        suggestedBooks.forEach(book => {
            const card = createBookCard(book);
            fragment.appendChild(card);
        });
        gridContainer.appendChild(fragment);
    }
    // Se não houver livros sugeridos, o grid simplesmente permanecerá vazio,
    // o que é o comportamento visual desejado.
};

/**
 * Orquestra a renderização de toda a página principal.
 * @param {object} containers - Um objeto contendo os elementos DOM necessários.
 * @param {Array<object>} books - A lista completa de livros vinda do estado.
 */
export const renderLandingPage = (containers, books) => {
    const { featuredContainer, suggestedGrid, suggestedSection } = containers;

    // Separa o livro em destaque (o mais recente) do resto.
    const featuredBook = books[0];
    const suggestedBooks = books.slice(1);

    // Renderiza as duas seções
    renderFeaturedBook(featuredContainer, featuredBook);
    renderSuggestedBooks(suggestedGrid, suggestedBooks);

    // Lógica de visibilidade da seção de sugestões.
    // Se não houver livros para sugerir, a seção inteira (incluindo o título "Sugestões")
    // é ocultada para uma UI mais limpa.
    if (suggestedBooks.length > 0) {
        suggestedSection.style.display = 'block';
    } else {
        suggestedSection.style.display = 'none';
    }

    // Gerencia o estado de "página vazia".
    // Se não houver NENHUM livro, mostra uma mensagem amigável no lugar do destaque.
    if (books.length === 0) {
        featuredContainer.innerHTML = `
            <div class="empty-state">
                <p>Nenhum livro na coleção.</p>
                <span>Clique 5x no título do site para adicionar o primeiro livro.</span>
            </div>
        `;
    }
};