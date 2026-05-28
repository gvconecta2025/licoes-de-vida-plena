// app.js

import { store } from './state/store.js';
import { listenToBooks, listenToHomepageSettings } from './services/bookService.js';
import { renderLandingPage } from './render/renderLandingPage.js';
import { renderAdminPanel, renderBookModal } from './render/renderOverlays.js';

// Aguarda o DOM estar pronto antes de selecionar elementos e adicionar eventos.
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os containers principais do DOM.
    const headerTitle = document.getElementById('header-title');
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

    const setupAdminTrigger = () => {
        if (!headerTitle) {
            console.error('Elemento header-title não encontrado! Verifique o HTML.');
            return;
        }

        let clickCount = 0;
        let clickTimer = null;

        headerTitle.addEventListener('click', () => {
            console.log('Clique detectado no título. Contagem atual:', clickCount + 1);
            clickCount++;

            if (clickTimer) clearTimeout(clickTimer);
            // Timeout aumentado para 1500ms para maior tolerância
            clickTimer = setTimeout(() => {
                clickCount = 0;
                console.log('Timeout de clique atingido. Contagem resetada.');
            }, 1500);

            if (clickCount === 5) {
                clickCount = 0;
                clearTimeout(clickTimer);
                console.log('5 cliques consecutivos! Abrindo painel de administração.');
                store.dispatch({ type: 'OPEN_ADMIN_PANEL' });
            }
        });
    };

    const main = () => {
        setupAdminTrigger();
        store.subscribe(renderApp);

        // Inicia o listener para a coleção de livros.
        listenToBooks((books) => {
            console.log('Dados de livros recebidos/atualizados:', books.length);
            store.dispatch({ type: 'SET_BOOKS', payload: books });
        });

        // Inicia o listener para as configurações da homepage.
        listenToHomepageSettings((settings) => {
            console.log('Configurações da homepage recebidas/atualizadas:', settings);
            store.dispatch({ type: 'SET_HOMEPAGE_SETTINGS', payload: settings });
        });
    };

    main();
});