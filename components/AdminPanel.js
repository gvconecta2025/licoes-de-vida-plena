// components/AdminPanel.js

import { store } from '../state/store.js';
import {
    createBook,
    updateBook,
    deleteBook,
    updateHomepageSettings
} from '../services/bookService.js';

const IMAGE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgMzAwIDQ1MCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFlMWQyYiIgLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkVzcGFjbyBkYSBDYXBhPC90ZXh0Pgo8L3N2Zz4K';

/**
 * Cria e retorna o elemento DOM para o painel de administração.
 * @param {object} state - O estado completo da aplicação (books, settings, etc).
 * @returns {HTMLElement} O elemento <div class="admin-panel-overlay">.
 */
export const createAdminPanel = (state) => {
    const { books, homepageSettings, editingBook } = state;
    const isEditing = Boolean(editingBook);
    const panelOverlay = document.createElement('div');
    panelOverlay.className = 'admin-panel-overlay';

    setTimeout(() => panelOverlay.classList.add('visible'), 10);

    // Gera as opções para o dropdown de livro em destaque.
    const featuredOptionsHTML = books
        .map(b => `<option value="${b.id}" ${homepageSettings.featuredBookId === b.id ? 'selected' : ''}>${b.title}</option>`)
        .join('');

    // Gera a lista de livros para reordenar.
    const orderListHTML = books
        .filter(b => b.id !== homepageSettings.featuredBookId) // Exclui o livro em destaque
        .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999)) // Ordena pela ordem atual
        .map(b => `
            <li class="order-item">
                <span class="order-item-title">${b.title}</span>
                <input type="number" class="order-item-input" data-book-id="${b.id}" value="${b.displayOrder || ''}" min="1">
            </li>
        `).join('');

    panelOverlay.innerHTML = `
        <div class="admin-panel">
            <div class="admin-panel-header">
                <h2>Gerenciador</h2>
                <button class="close-panel-btn" aria-label="Fechar painel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="admin-panel-tabs">
                <button class="tab-btn active" data-tab="edit-book-tab">${isEditing ? 'Editar Livro' : 'Adicionar Livro'}</button>
                <button class="tab-btn" data-tab="curation-tab">Curadoria da Homepage</button>
            </div>
            <div class="admin-panel-content">
                <!-- Aba de Edição/Criação de Livro -->
                <div id="edit-book-tab" class="tab-content active">
                    <div class="admin-form-container">
                        <form id="book-form">
                            <input type="hidden" name="id" value="${editingBook?.id || ''}">
                            <div class="form-group">
                                <label for="title">Título</label>
                                <input type="text" id="title" name="title" required value="${editingBook?.title || ''}">
                            </div>
                            <!-- ... (outros campos do formulário) ... -->
                            <div class="form-group">
                                <label for="subtitle">Subtítulo</label>
                                <input type="text" id="subtitle" name="subtitle" value="${editingBook?.subtitle || ''}">
                            </div>
                            <div class="form-group">
                                <label for="author">Autor</label>
                                <input type="text" id="author" name="author" required value="${editingBook?.author || ''}">
                            </div>
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="price">Preço (ex: 29.90)</label>
                                    <input type="number" id="price" name="price" step="0.01" required value="${editingBook?.price || ''}">
                                </div>
                                <div class="form-group">
                                    <label for="oldPrice">Preço Antigo (opcional)</label>
                                    <input type="number" id="oldPrice" name="oldPrice" step="0.01" value="${editingBook?.oldPrice || ''}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="image">URL da Capa</label>
                                <input type="url" id="image" name="image" required value="${editingBook?.image || ''}">
                            </div>
                            <div class="form-group">
                                <label for="synopsis">Sinopse</label>
                                <textarea id="synopsis" name="synopsis" rows="6" required>${editingBook?.synopsis || ''}</textarea>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-save">${isEditing ? 'Salvar Alterações' : 'Adicionar Livro'}</button>
                                ${isEditing ? `<button type="button" class="btn-delete">Excluir Livro</button>` : ''}
                            </div>
                        </form>
                    </div>
                    <div class="admin-preview-container">
                        <h4>Preview da Capa</h4>
                        <img src="${editingBook?.image || IMAGE_PLACEHOLDER}" alt="Preview da capa" id="image-preview" class="image-preview">
                    </div>
                </div>

                <!-- Aba de Curadoria -->
                <div id="curation-tab" class="tab-content">
                    <form id="curation-form">
                        <div class="form-group">
                            <label for="featured-book">Livro em Destaque na Homepage</label>
                            <select id="featured-book" name="featuredBookId">
                                <option value="">— Nenhum —</option>
                                ${featuredOptionsHTML}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ordem dos Livros Sugeridos</label>
                            <ul id="order-list" class="order-list">${orderListHTML}</ul>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-save">Salvar Curadoria</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // --- LÓGICA E EVENTOS ---
    const closePanel = () => {
        panelOverlay.classList.remove('visible');
        setTimeout(() => store.dispatch({ type: 'CLOSE_ADMIN_PANEL' }), 300);
    };

    // Lógica das Abas
    const tabButtons = panelOverlay.querySelectorAll('.tab-btn');
    const tabContents = panelOverlay.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            panelOverlay.querySelector(`#${button.dataset.tab}`).classList.add('active');
        });
    });

    // Lógica do Formulário de Livro
    const bookForm = panelOverlay.querySelector('#book-form');
    const saveButton = bookForm.querySelector('.btn-save');
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalButtonText = saveButton.textContent;
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';

        const formData = {
            title: bookForm.elements.title.value,
            subtitle: bookForm.elements.subtitle.value,
            author: bookForm.elements.author.value,
            price: parseFloat(bookForm.elements.price.value),
            oldPrice: bookForm.elements.oldPrice.value ? parseFloat(bookForm.elements.oldPrice.value) : null,
            image: bookForm.elements.image.value,
            synopsis: bookForm.elements.synopsis.value,
        };

        try {
            if (isEditing) {
                await updateBook(editingBook.id, formData);
            } else {
                await createBook(formData);
                bookForm.reset(); // Limpa o formulário para adicionar o próximo
                panelOverlay.querySelector('#image-preview').src = IMAGE_PLACEHOLDER;
                bookForm.elements.title.focus();
            }
            saveButton.textContent = 'Salvo!';
            setTimeout(() => {
                saveButton.disabled = false;
                saveButton.textContent = originalButtonText;
            }, 2000);
        } catch (error) {
            alert('Falha ao salvar o livro.');
            saveButton.disabled = false;
            saveButton.textContent = originalButtonText;
        }
    });

    // Lógica de Exclusão
    const deleteButton = panelOverlay.querySelector('.btn-delete');
    if (isEditing && deleteButton) {
        deleteButton.addEventListener('click', async () => {
            if (confirm(`Tem certeza que deseja excluir "${editingBook.title}"?`)) {
                try {
                    await deleteBook(editingBook.id);
                    closePanel(); // Excluir ainda fecha o painel
                } catch (error) { alert('Falha ao excluir o livro.'); }
            }
        });
    }

    // Lógica do Formulário de Curadoria
    const curationForm = panelOverlay.querySelector('#curation-form');
    curationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveCurationBtn = curationForm.querySelector('.btn-save');
        const originalButtonText = saveCurationBtn.textContent;
        saveCurationBtn.disabled = true;
        saveCurationBtn.textContent = 'Salvando...';

        try {
            // 1. Salva o livro em destaque
            const featuredBookId = curationForm.elements.featuredBookId.value;
            await updateHomepageSettings({ featuredBookId });

            // 2. Salva a ordem de exibição
            const orderInputs = panelOverlay.querySelectorAll('.order-item-input');
            const updatePromises = [];
            orderInputs.forEach(input => {
                const bookId = input.dataset.bookId;
                const displayOrder = parseInt(input.value, 10) || null; // Converte para número ou null
                updatePromises.push(updateBook(bookId, { displayOrder }));
            });
            await Promise.all(updatePromises);

            saveCurationBtn.textContent = 'Salvo!';
            setTimeout(() => {
                saveCurationBtn.disabled = false;
                saveCurationBtn.textContent = originalButtonText;
            }, 2000);

        } catch (error) {
            alert('Falha ao salvar a curadoria.');
            saveCurationBtn.disabled = false;
            saveCurationBtn.textContent = originalButtonText;
        }
    });

    // Eventos de Fechamento e Preview
    panelOverlay.querySelector('.close-panel-btn').addEventListener('click', closePanel);
    panelOverlay.querySelector('#image').addEventListener('input', (e) => {
        panelOverlay.querySelector('#image-preview').src = e.target.value || IMAGE_PLACEHOLDER;
    });

    return panelOverlay;
};