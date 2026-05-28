// app.js

// ARQUITETURA: Orquestrador da Aplicação
// A principal mudança aqui é a adição de um segundo listener em tempo real.
// A aplicação agora escuta simultaneamente a coleção 'books' e o documento
// 'settings/homepage', garantindo que tanto os dados quanto a sua apresentação
// curada estejam sempre sincronizados.

import { store } from './state/store.js';
import { listenToBooks, listenToHomepageSettings } from './services/bookService.js';
import { renderLandingPage } from './render/renderLandingPage.js';
import { renderAdminPanel, renderBookModal } from './render/renderOverlays.js';

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
    let clickCount = 0;
    let clickTimer = null;
    headerTitle.addEventListener('click', () => {
        clickCount++;
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
        if (clickCount === 5) {
            clickCount = 0;
            clearTimeout(clickTimer);
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

    // NOVO: Inicia o listener para as configurações da homepage.
    // Isso garante que a escolha do livro em destaque seja reativa.
    listenToHomepageSettings((settings) => {
        console.log('Configurações da homepage recebidas/atualizadas:', settings);
        store.dispatch({ type: 'SET_HOMEPAGE_SETTINGS', payload: settings });
    });
};

main();