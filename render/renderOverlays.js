// render/renderOverlays.js

import { createAdminPanel } from '../components/AdminPanel.js';
import { createBookModal } from '../components/BookModal.js';

// ARQUITETURA: Render Engine para Overlays
// Este módulo gerencia a renderização de elementos que aparecem "sobre" a
// interface principal, como o painel de admin e o modal de detalhes do livro.

/**
 * Gerencia a renderização do Painel de Administração.
 * @param {HTMLElement} container - O container onde o painel será renderizado.
 * @param {object} state - O estado global da aplicação.
 */
export const renderAdminPanel = (container, state) => {
    const { isAdminPanelOpen } = state;
    const isPanelInDom = container.querySelector('.admin-panel-overlay');

    if (isAdminPanelOpen && !isPanelInDom) {
        // CORREÇÃO CRÍTICA:
        // O componente createAdminPanel foi refatorado para precisar do objeto 'state'
        // completo para construir a UI de curadoria. Agora estamos passando o objeto
        // 'state' inteiro, como ele espera, corrigindo o erro de 'destructuring'.
        const panel = createAdminPanel(state);
        container.appendChild(panel);
        document.body.classList.add('no-scroll');
    } else if (!isAdminPanelOpen && isPanelInDom) {
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
        const selectedBook = books.find(book => book.id === selectedBookId);
        if (selectedBook) {
            const modal = createBookModal(selectedBook);
            container.appendChild(modal);
            document.body.classList.add('no-scroll');
        }
    } else if (!selectedBookId && isModalInDom) {
        isModalInDom.remove();
        document.body.classList.remove('no-scroll');
    }
};