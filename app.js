// app.js

// ARQUITETURA: Orquestrador da Aplicação (Ponto de Entrada)
// Este arquivo é o coração que conecta todas as outras partes.
// Ele não renderiza nada diretamente nem busca dados. Sua responsabilidade é:
// 1. Inicializar a conexão com o serviço de dados (Firestore).
// 2. Assinar os renderizadores às mudanças de estado na store.
// 3. Ligar os eventos iniciais da UI (como o botão de abrir admin) ao sistema de estado.

import { store } from './state/store.js';
import { listenToBooks } from './services/bookService.js';
import { renderBooks } from './render/renderBooks.js';
import { renderAdminPanel, renderBookModal } from './render/renderOverlays.js';

// Seleciona os containers principais do DOM uma única vez para performance.
const bookGridContainer = document.getElementById('book-grid-container');
const adminPanelContainer = document.getElementById('admin-panel-container');
const bookModalContainer = document.getElementById('book-modal-container');
const openAdminBtn = document.getElementById('open-admin-btn');
const loader = document.getElementById('loader');

/**
 * A função de renderização principal.
 * Esta função é o ÚNICO assinante da store. Sempre que o estado muda,
 * ela é chamada e orquestra a atualização de todas as partes da UI.
 * Isso garante uma pipeline de renderização consistente e previsível.
 */
const renderApp = () => {
    // Obtém o estado mais recente da store.
    const state = store.getState();

    // Chama cada renderizador com os dados e containers necessários.
    renderBooks(bookGridContainer, state.books);
    renderAdminPanel(adminPanelContainer, state);
    renderBookModal(bookModalContainer, state);

    // Gerencia a visibilidade do loader inicial.
    if (!state.isLoading && loader.style.opacity !== '0') {
        loader.style.opacity = '0';
        // Remove o loader do DOM após a transição para não interferir com a UI.
        setTimeout(() => loader.style.display = 'none', 300);
    }
};

/**
 * Função principal que inicializa a aplicação.
 */
const main = () => {
    // 1. Conecta a UI ao sistema de estado.
    // O botão de admin não abre o painel diretamente. Ele despacha uma ação.
    // A store então mudará o estado, e o `renderApp` cuidará de mostrar o painel.
    openAdminBtn.addEventListener('click', () => {
        // A ação não precisa de payload, pois estamos criando um novo livro (editingBook será null).
        store.dispatch({ type: 'OPEN_ADMIN_PANEL' });
    });

    // 2. Assina a nossa função de renderização principal às mudanças da store.
    // A partir de agora, qualquer `dispatch` vai acionar uma re-renderização da UI.
    store.subscribe(renderApp);

    // 3. Inicia a escuta em tempo real com o Firestore.
    // O callback será chamado imediatamente com os dados iniciais e, depois,
    // a cada mudança na coleção 'books'.
    listenToBooks((books) => {
        // Quando recebemos os livros do Firestore, despachamos uma ação para
        // atualizar o estado global. Isso acionará o `renderApp`.
        console.log('Dados do Firestore recebidos/atualizados:', books);
        store.dispatch({ type: 'SET_BOOKS', payload: books });
    });
};

// Inicia a aplicação.
main();
