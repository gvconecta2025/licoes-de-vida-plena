// components/AdminPanel.js

import { store } from '../state/store.js';
import { createBook, updateBook, deleteBook } from '../services/bookService.js';

// ARQUITETURA: Componente de Formulário Adaptativo
// Este componente encapsula toda a lógica para criar e editar livros.
// Ele recebe um 'book' opcional. Se 'book' for nulo, ele opera em modo 'criar'.
// Se 'book' for um objeto, ele opera em modo 'editar', pré-preenchendo os campos
// e mostrando a opção de deletar. Isso evita ter dois componentes separados.

const IMAGE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFlMWQyYiIgLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkVzcGFjbyBkYSBDYXBhPC90ZXh0Pgo8L3N2Zz4K';

/**
 * Cria e retorna o elemento DOM para o painel de administração.
 * @param {object | null} book - O livro a ser editado, ou null para criar um novo.
 * @returns {HTMLElement} O elemento <div class="admin-panel-overlay">.
 */
export const createAdminPanel = (book = null) => {
    const isEditing = Boolean(book);
    const panelOverlay = document.createElement('div');
    panelOverlay.className = 'admin-panel-overlay';

    setTimeout(() => panelOverlay.classList.add('visible'), 10);

    panelOverlay.innerHTML = `
        <div class="admin-panel">
            <div class="admin-panel-header">
                <h2>${isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</h2>
                <button class="close-panel-btn" aria-label="Fechar painel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="admin-panel-content">
                <div class="admin-form-container">
                    <form id="book-form">
                        <div class="form-group">
                            <label for="title">Título</label>
                            <input type="text" id="title" name="title" required value="${book?.title || ''}">
                        </div>
                        <div class="form-group">
                            <label for="subtitle">Subtítulo</label>
                            <input type="text" id="subtitle" name="subtitle" value="${book?.subtitle || ''}">
                        </div>
                        <div class="form-group">
                            <label for="author">Autor</label>
                            <input type="text" id="author" name="author" required value="${book?.author || ''}">
                        </div>
                        <div class="form-group-row">
                            <div class="form-group">
                                <label for="price">Preço (ex: 29.90)</label>
                                <input type="number" id="price" name="price" step="0.01" required value="${book?.price || ''}">
                            </div>
                            <div class="form-group">
                                <label for="oldPrice">Preço Antigo (opcional)</label>
                                <input type="number" id="oldPrice" name="oldPrice" step="0.01" value="${book?.oldPrice || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="image">URL da Capa</label>
                            <input type="url" id="image" name="image" required value="${book?.image || ''}">
                        </div>
                        <div class="form-group">
                            <label for="synopsis">Sinopse</label>
                            <textarea id="synopsis" name="synopsis" rows="6" required>${book?.synopsis || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-save">${isEditing ? 'Salvar Alterações' : 'Adicionar Livro'}</button>
                            ${isEditing ? `<button type="button" class="btn-delete">Excluir Livro</button>` : ''}
                        </div>
                    </form>
                </div>
                <div class="admin-preview-container">
                    <h4>Preview da Capa</h4>
                    <img src="${book?.image || IMAGE_PLACEHOLDER}" alt="Preview da capa" id="image-preview" class="image-preview">
                </div>
            </div>
        </div>
    `;

    // --- LÓGICA E EVENTOS ---

    const form = panelOverlay.querySelector('#book-form');
    const imageInput = panelOverlay.querySelector('#image');
    const imagePreview = panelOverlay.querySelector('#image-preview');
    const saveButton = panelOverlay.querySelector('.btn-save');
    const deleteButton = panelOverlay.querySelector('.btn-delete');
    const closeButton = panelOverlay.querySelector('.close-panel-btn');

    // Função para fechar o painel com animação
    const closePanel = () => {
        panelOverlay.classList.remove('visible');
        setTimeout(() => {
            store.dispatch({ type: 'CLOSE_ADMIN_PANEL' });
        }, 300);
    };

    // Preview da imagem em tempo real
    imageInput.addEventListener('input', () => {
        imagePreview.src = imageInput.value || IMAGE_PLACEHOLDER;
    });
    imagePreview.onerror = () => {
        imagePreview.src = IMAGE_PLACEHOLDER;
    };

    // Submissão do formulário (Criar ou Atualizar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';

        const formData = {
            title: form.elements.title.value,
            subtitle: form.elements.subtitle.value,
            author: form.elements.author.value,
            price: parseFloat(form.elements.price.value),
            oldPrice: form.elements.oldPrice.value ? parseFloat(form.elements.oldPrice.value) : null,
            image: form.elements.image.value,
            synopsis: form.elements.synopsis.value,
        };

        try {
            if (isEditing) {
                await updateBook(book.id, formData);
            } else {
                await createBook(formData);
            }
            closePanel();
        } catch (error) {
            alert('Falha ao salvar o livro. Verifique o console para mais detalhes.');
            saveButton.disabled = false;
            saveButton.textContent = isEditing ? 'Salvar Alterações' : 'Adicionar Livro';
        }
    });

    // Lógica de exclusão
    if (isEditing && deleteButton) {
        deleteButton.addEventListener('click', async () => {
            if (confirm(`Tem certeza que deseja excluir o livro "${book.title}"? Esta ação não pode ser desfeita.`)) {
                deleteButton.disabled = true;
                saveButton.disabled = true;
                deleteButton.textContent = 'Excluindo...';
                try {
                    await deleteBook(book.id);
                    closePanel();
                } catch (error) {
                    alert('Falha ao excluir o livro.');
                    deleteButton.disabled = false;
                    saveButton.disabled = false;
                    deleteButton.textContent = 'Excluir Livro';
                }
            }
        });
    }

    // Fechar o painel
    closeButton.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', (e) => {
        if (e.target === panelOverlay) closePanel();
    });
    
    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            closePanel();
            document.removeEventListener('keydown', handleEscKey);
        }
    };
    document.addEventListener('keydown', handleEscKey);

    return panelOverlay;
};
