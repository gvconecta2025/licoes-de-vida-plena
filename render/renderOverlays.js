// render/renderOverlays.js

// Importa os componentes que este renderer irá instanciar.
import { createAdminPanel } from '../components/AdminPanel.js';
import { createBookModal } from '../components/BookModal.js';

// ARQUITETURA: Render Engine para Overlays
// Este módulo gerencia a renderização de elementos que aparecem "sobre" a
// interface principal, como o painel de admin e o modal de detalhes do livro.
// A lógica é simples e declarativa:
// 1. Olhe para o estado atual.
// 2. O painel de admin deve estar aberto? Se sim, e não estiver no DOM, crie-o. Se não, e estiver no DOM, remova-o.
// 3. Um livro está selecionado? Se sim, e o modal não estiver no DOM, crie-o. Se não, e estiver no DOM, remova-o.
// Isso garante que o DOM seja sempre um reflexo direto do estado da aplicação.

/**
 * Gerencia a renderização do Painel de Administração.
 * @param {HTMLElement} container - O container onde o painel será renderizado.
 * @param {object} state - O estado global da aplicação.
 */
export const renderAdminPanel = (container, state) => {
    const { isAdminPanelOpen, editingBook, books } = state;
    const isPanelInDom = container.querySelector('.admin-panel-overlay');

    if (isAdminPanelOpen && !isPanelInDom) {
        // O estado diz que o painel deve estar aberto, mas ele não está no DOM.
        // Se estivermos editando, precisamos garantir que temos os dados mais recentes do livro.
        const bookToEdit = editingBook ? books.find(b => b.id === editingBook.id) : null;
        const panel = createAdminPanel(bookToEdit);
        container.appendChild(panel);
        document.body.classList.add('no-scroll'); // Impede o scroll do fundo
    } else if (!isAdminPanelOpen && isPanelInDom) {
        // O estado diz que o painel deve estar fechado, mas ele está no DOM.
        // A remoção é feita aqui, após o componente interno ter despachado a ação
        // e a animação de saída (gerenciada pelo componente) ter sido iniciada.
        isPanelInDom.remove();
        document.body.classList.remove('no-scroll');
    }
};

/**
 * Gerencia a renderização do Modal de Detalhes do Livro.
 * @param {HTMLElement} container - O container onde o modal será renderizado.
 * @param {object} state - O estado global da aplicação.
 */
export const renderBookModal = (container, state) => {
    const { selectedBookId, books } = state;
    const isModalInDom = container.querySelector('.modal-overlay');

    if (selectedBookId && !isModalInDom) {
        // O estado diz que um livro está selecionado, mas o modal não está no DOM.
        // Encontramos o livro completo na lista de livros usando o ID.
        const selectedBook = books.find(book => book.id === selectedBookId);
        if (selectedBook) {
            const modal = createBookModal(selectedBook);
            container.appendChild(modal);
            document.body.classList.add('no-scroll');
        }
    } else if (!selectedBookId && isModalInDom) {
        // O estado diz que nenhum livro está selecionado, mas o modal está no DOM.
        // A remoção do DOM acontece aqui, como resultado da mudança de estado.
        isModalInDom.remove();
        document.body.classList.remove('no-scroll');
    }
};
