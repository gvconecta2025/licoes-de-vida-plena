// state/store.js

// ARQUITETURA: Estado Centralizado
// O estado foi expandido para incluir as configurações de curadoria da homepage.
// Isso permite que a UI reaja não apenas às mudanças nos dados dos livros,
// mas também às mudanças na forma como esses dados devem ser apresentados.

const initialState = {
    books: [],
    // NOVO: Armazena as configurações de curadoria (ex: qual livro é o destaque).
    homepageSettings: {
        featuredBookId: null,
    },
    isLoading: true,
    selectedBookId: null,
    isAdminPanelOpen: false,
    editingBook: null,
};

const createStore = () => {
    let state = { ...initialState };
    const listeners = new Set();

    const notify = () => {
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    const getState = () => {
        return state;
    };

    const dispatch = (action) => {
        switch (action.type) {
            case 'SET_BOOKS':
                state = { ...state, books: action.payload, isLoading: false };
                break;
            // NOVA AÇÃO: Atualiza as configurações da homepage no estado.
            case 'SET_HOMEPAGE_SETTINGS':
                state = { ...state, homepageSettings: action.payload };
                break;
            case 'OPEN_BOOK_MODAL':
                state = { ...state, selectedBookId: action.payload };
                break;
            case 'CLOSE_BOOK_MODAL':
                state = { ...state, selectedBookId: null };
                break;
            case 'OPEN_ADMIN_PANEL':
                state = { ...state, isAdminPanelOpen: true, editingBook: action.payload || null };
                break;
            case 'CLOSE_ADMIN_PANEL':
                state = { ...state, isAdminPanelOpen: false, editingBook: null };
                break;
            default:
                break;
        }
        notify();
    };

    return { getState, subscribe, dispatch };
};

const store = createStore();

export { store };