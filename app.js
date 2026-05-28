// app.js

// ARQUITETURA: Orquestrador da Aplicação (Ponto de Entrada)
// Este arquivo conecta todas as partes da aplicação.
// Suas responsabilidades foram atualizadas para:
// 1. Implementar a lógica de acesso secreto do administrador.
// 2. Orquestrar a nova renderização da landing page (destaque + sugestões).
// 3. Manter a conexão entre o serviço do Firestore, a store e os renderizadores.

import { store } from './state/store.js';
import { listenToBooks } from './services/bookService.js';
import { renderLandingPage } from './render/renderLandingPage.js';
import { renderAdminPanel, renderBookModal } from './render/renderOverlays.js';

// Seleciona os containers principais do DOM.
// A lista foi atualizada para refletir a nova estrutura do index.html.
const headerTitle = document.getElementById('header-title');
const featuredBookContainer = document.getElementById('featured-book-container');
const suggestedBooksSection = document.getElementById('suggested-books-section');
const suggestedBooksGrid = document.getElementById('suggested-books-grid');
const adminPanelContainer = document.getElementById('admin-panel-container');
const bookModalContainer = document.getElementById('book-modal-container');
const loader = document.getElementById('loader');

// Agrupa os containers da landing page para passar ao renderizador.
const landingPageContainers = {
    featuredContainer: featuredBookContainer,
    suggestedSection: suggestedBooksSection,
    suggestedGrid: suggestedBooksGrid,
};

/**
 * A função de renderização principal.
 * Chamada a cada mudança de estado, ela orquestra a atualização da UI.
 */
const renderApp = () => {
    const state = store.getState();

    // Chama os renderizadores com os dados e containers necessários.
    // Agora usamos o novo renderizador da landing page.
    renderLandingPage(landingPageContainers, state.books);
    renderAdminPanel(adminPanelContainer, state);
    renderBookModal(bookModalContainer, state);

    // Gerencia a visibilidade do loader inicial.
    if (!state.isLoading && loader.style.opacity !== '0') {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 300);
    }
};

/**
 * Configura o gatilho secreto para abrir o painel de administração.
 */
const setupAdminTrigger = () => {
    let clickCount = 0;
    let clickTimer = null;

    headerTitle.addEventListener('click', () => {
        clickCount++;

        // Limpa o timer anterior a cada clique. Se o usuário parar de clicar,
        // o timer vai expirar e resetar a contagem.
        if (clickTimer) {
            clearTimeout(clickTimer);
        }

        // Inicia um timer para resetar a contagem após 1 segundo de inatividade.
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1000);

        // Se 5 cliques forem detectados em rápida sucessão, abre o painel.
        if (clickCount === 5) {
            clickCount = 0;
            clearTimeout(clickTimer);
            store.dispatch({ type: 'OPEN_ADMIN_PANEL' });
        }
    });
};

/**
 * Função principal que inicializa a aplicação.
 */
const main = () => {
    // 1. Configura o acesso secreto do administrador.
    setupAdminTrigger();

    // 2. Assina a nossa função de renderização principal às mudanças da store.
    store.subscribe(renderApp);

    // 3. Inicia a escuta em tempo real com o Firestore.
    listenToBooks((books) => {
        console.log('Dados do Firestore recebidos/atualizados:', books);
        store.dispatch({ type: 'SET_BOOKS', payload: books });
    });
};

// Inicia a aplicação.
main();