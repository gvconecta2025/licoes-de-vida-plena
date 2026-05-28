// app.js

import { store } from './state/store.js';
import { listenToBooks, listenToHomepageSettings } from './services/bookService.js';
import { renderLandingPage } from './render/renderLandingPage.js';
import { renderAdminPanel, renderBookModal } from './render/renderOverlays.js';

// Seleciona containers do DOM
const featuredBookContainer = document.getElementById('featured-book-container');
const suggestedBooksSection = document.getElementById('suggested-books-section');
const suggestedBooksGrid = document.getElementById('suggested-books-grid');
const adminPanelContainer = document.getElementById('admin-panel-container');
const bookModalContainer = document.getElementById('book-modal-container');
const loader = document.getElementById('loader');

const landingPageContainers = {
    featuredContainer: featuredBookContainer,
    suggestedSection: suggestedBooksSection,
    suggestedGrid: suggestedBooksGrid,
};

const renderApp = () => {
    const state = store.getState();
    renderLandingPage(landingPageContainers, state.books, state.homepageSettings);
    renderAdminPanel(adminPanelContainer, state);
    renderBookModal(bookModalContainer, state);

    if (!state.isLoading && loader.style.opacity !== '0') {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 300);
    }
};

/**
 * Configura o gatilho secreto do clique no título.
 */
const setupAdminTrigger = () => {
    let clickCount = 0;
    let clickTimer = null;

    const handleTitleClick = () => {
        clickCount++;
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1500);

        if (clickCount === 5) {
            clickCount = 0;
            clearTimeout(clickTimer);
            store.dispatch({ type: 'OPEN_ADMIN_PANEL' });
        }
    };

    const attachListener = () => {
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) {
            headerTitle.addEventListener('click', handleTitleClick);
            console.log('✅ Gatilho do admin ativado.');
        } else {
            console.warn('⏳ Elemento header-title não encontrado. Tentando novamente em 300ms...');
            setTimeout(attachListener, 300);
        }
    };

    attachListener();
};

/**
 * NOVA FUNÇÃO: Verifica se há um parâmetro de admin na URL e, se existir,
 * abre o painel automaticamente.
 */
const checkAdminParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin'); // Ex: ?admin
    const painelParam = urlParams.get('painel'); // Ex: ?painel=sim

    // Aceita qualquer um dos dois parâmetros para abrir o painel
    if (adminParam !== null || painelParam === 'sim') {
        console.log('🔑 Acesso via URL detectado. Abrindo painel de administração...');
        store.dispatch({ type: 'OPEN_ADMIN_PANEL' });

        // Remove o parâmetro da URL para evitar reabertura ao recarregar
        // Usa history.replaceState para não adicionar ao histórico
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
};

const main = () => {
    // 1. Verifica acesso via URL (prioridade)
    checkAdminParam();

    // 2. Configura gatilho de clique no título
    setupAdminTrigger();

    // 3. Assina renderização às mudanças de estado
    store.subscribe(renderApp);

    // 4. Inicia listeners do Firestore
    listenToBooks((books) => {
        store.dispatch({ type: 'SET_BOOKS', payload: books });
    });

    listenToHomepageSettings((settings) => {
        store.dispatch({ type: 'SET_HOMEPAGE_SETTINGS', payload: settings });
    });
};

main();