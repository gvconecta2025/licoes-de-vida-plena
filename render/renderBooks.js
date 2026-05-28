// render/renderBooks.js

import { createBookCard } from '../components/BookCard.js';

// ARQUITETURA: Render Engine Otimizado (DOM Diffing Simplificado)
// Esta função é responsável por sincronizar o DOM (a grade de livros visível)
// com o estado da aplicação (a lista de livros na store).
// Em vez de apagar e recriar tudo a cada atualização (o que é lento e causa
// piscadas na tela), ela compara o que está no DOM com o que deveria estar
// e faz apenas as alterações mínimas necessárias.

/**
 * Renderiza ou atualiza a grade de livros de forma eficiente.
 * @param {HTMLElement} container - O elemento DOM onde os cards serão renderizados.
 * @param {Array<object>} books - A lista atual de livros vinda do estado.
 */
export const renderBooks = (container, books) => {
    // 1. Mapeia os nós do DOM existentes por seus IDs de livro.
    // Isso nos permite encontrar rapidamente se um livro já está na tela.
    const existingBookNodes = new Map();
    container.querySelectorAll('.book-card').forEach(node => {
        existingBookNodes.set(node.dataset.bookId, node);
    });

    // 2. Itera sobre a lista de livros do estado (a "fonte da verdade").
    // Para cada livro, garantimos que ele esteja no DOM e na posição correta.
    books.forEach((book, index) => {
        const existingNode = existingBookNodes.get(book.id);

        if (existingNode) {
            // O livro já existe no DOM.
            // Removemos ele do nosso mapa para que não seja deletado no final.
            existingBookNodes.delete(book.id);

            // Verificamos se está na posição correta. Se não estiver, movemos.
            // Isso mantém a ordenação (ex: por data de criação) correta.
            if (container.children[index] !== existingNode) {
                container.insertBefore(existingNode, container.children[index]);
            }
            // NOTA: Se os dados do livro pudessem ser atualizados (ex: preço),
            // aqui seria o local para atualizar o conteúdo do 'existingNode'
            // em vez de recriá-lo. Para este projeto, a recriação no onSnapshot
            // é suficiente e mais simples.
        } else {
            // O livro é novo e não está no DOM. Criamos um novo card.
            const newCard = createBookCard(book);
            // Inserimos na posição correta para manter a ordem.
            if (container.children[index]) {
                container.insertBefore(newCard, container.children[index]);
            } else {
                container.appendChild(newCard);
            }
        }
    });

    // 3. Remove os nós que sobraram no mapa.
    // Se um livro estava no DOM (no mapa 'existingBookNodes') mas não na nova
    // lista de livros do estado, significa que ele foi deletado.
    existingBookNodes.forEach(node => node.remove());

    // 4. Trata o caso de não haver livros.
    // Mostra uma mensagem amigável em vez de uma grade vazia.
    const emptyStateElement = container.querySelector('.empty-state');
    if (books.length === 0 && !emptyStateElement) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>Nenhum livro encontrado.</p>
            <span>Adicione o primeiro livro usando o painel de gerenciamento.</span>
        `;
        container.appendChild(emptyState);
    } else if (books.length > 0 && emptyStateElement) {
        emptyStateElement.remove();
    }
};
