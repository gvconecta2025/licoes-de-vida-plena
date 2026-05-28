// state/store.js

// ARQUITETURA: Estado Centralizado (Single Source of Truth no Cliente)
// Este módulo implementa um padrão de gerenciamento de estado simples, inspirado no Redux.
// O objetivo é ter um único objeto 'state' para toda a aplicação.
// A UI é uma função desse estado. Quando o estado muda, a UI é re-renderizada.
// Isso elimina bugs de sincronização entre componentes.

// O estado inicial da nossa aplicação.
const initialState = {
    books: [],              // A lista de livros vinda do Firestore.
    isLoading: true,        // Controla o loader inicial. Começa como true.
    selectedBookId: null,   // ID do livro selecionado para ver detalhes no modal.
    isAdminPanelOpen: false,// Controla a visibilidade do painel de administração.
    editingBook: null,      // O objeto do livro que está sendo editado no painel.
};

// Usamos uma closure para manter o estado e os listeners privados.
// Apenas as funções exportadas podem interagir com eles.
const createStore = () => {
    let state = { ...initialState };
    const listeners = new Set(); // Usar Set previne listeners duplicados.

    /**
     * Notifica todos os assinantes (listeners) que o estado mudou.
     * Cada listener é uma função de renderização ou atualização de UI.
     */
    const notify = () => {
        listeners.forEach(listener => listener());
    };

    /**
     * Permite que outras partes da aplicação (como os renderers) "assinem"
     * para serem notificadas sobre mudanças no estado.
     * @param {function} listener - A função a ser chamada quando o estado mudar.
     * @returns {function} Uma função para cancelar a assinatura (unsubscribe).
     */
    const subscribe = (listener) => {
        listeners.add(listener);
        // Retorna uma função que remove o listener do Set,
        // essencial para evitar memory leaks.
        return () => listeners.delete(listener);
    };

    /**
     * A única maneira de obter o estado atual. Garante que o estado seja somente leitura.
     * @returns {object} O estado atual da aplicação.
     */
    const getState = () => {
        return state;
    };

    /**
     * Despacha "ações" para modificar o estado. Uma ação é um objeto com
     * um 'type' (o que fazer) e um 'payload' (os dados para a mudança).
     * @param {object} action - O objeto da ação, ex: { type: 'SET_BOOKS', payload: [...] }
     */
    const dispatch = (action) => {
        // O 'reducer' de fato. Ele calcula o novo estado com base no estado antigo e na ação.
        switch (action.type) {
            case 'SET_BOOKS':
                state = { ...state, books: action.payload, isLoading: false };
                break;
            case 'OPEN_BOOK_MODAL':
                state = { ...state, selectedBookId: action.payload };
                break;
            case 'CLOSE_BOOK_MODAL':
                state = { ...state, selectedBookId: null };
                break;
            case 'OPEN_ADMIN_PANEL':
                // Se um livro for passado no payload, estamos editando. Senão, criando um novo.
                state = { ...state, isAdminPanelOpen: true, editingBook: action.payload || null };
                break;
            case 'CLOSE_ADMIN_PANEL':
                state = { ...state, isAdminPanelOpen: false, editingBook: null };
                break;
            default:
                // Se a ação não for reconhecida, não fazemos nada.
                break;
        }
        // Após qualquer mudança no estado, notificamos todos os assinantes.
        notify();
    };

    return { getState, subscribe, dispatch };
};

// Cria e exporta a instância única da store para toda a aplicação.
const store = createStore();

export { store };
