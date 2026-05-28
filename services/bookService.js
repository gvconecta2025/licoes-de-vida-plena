// services/bookService.js

// Importa a instância 'db' do nosso arquivo de configuração e todas as
// funções do Firestore que precisaremos para o CRUD e para o listener em tempo real.
import { db } from '../firebase/firebaseConfig.js';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

// ARQUITETURA: Camada de Serviço (Service Layer)
// Esta camada isola completamente a lógica de acesso a dados (Firestore)
// do resto da aplicação (estado, renderização). Se um dia quisermos trocar
// o Firebase por outro banco, só precisaremos modificar este arquivo.

// Referência para a coleção 'books' no Firestore.
// Manter isso como uma constante evita erros de digitação.
const booksCollection = collection(db, 'books');

/**
 * A função mais importante: escuta por mudanças em tempo real na coleção de livros.
 * @param {function} callback - Uma função que será chamada toda vez que os dados mudarem.
 * Ela receberá a lista atualizada de livros como argumento.
 * @returns {function} Uma função 'unsubscribe' para parar de escutar e evitar memory leaks.
 */
const listenToBooks = (callback) => {
    // Cria uma query para buscar os livros, ordenando pelos mais recentes primeiro.
    // A ordenação por 'createdAt' garante uma exibição consistente.
    const q = query(booksCollection, orderBy('createdAt', 'desc'));

    // onSnapshot é o coração da nossa aplicação em tempo real.
    // Ele estabelece uma conexão persistente com o Firestore.
    // O callback interno é disparado imediatamente com os dados atuais e, depois,
    // toda vez que um documento for adicionado, modificado ou removido na coleção.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const books = [];
        querySnapshot.forEach((doc) => {
            // Para cada documento, extraímos os dados e adicionamos o ID,
            // que é crucial para operações de update e delete.
            books.push({ id: doc.id, ...doc.data() });
        });
        // Chama o callback fornecido (que no nosso caso, atualizará o estado global)
        // com a lista de livros completa e atualizada.
        callback(books);
    }, (error) => {
        // Tratamento de erros para a escuta em tempo real.
        console.error("Erro ao escutar por atualizações de livros: ", error);
        // Em uma aplicação de produção, poderíamos mostrar uma notificação ao usuário.
        callback([]); // Retorna um array vazio em caso de erro.
    });

    // Retorna a função 'unsubscribe' para que o chamador possa encerrar a escuta
    // quando não for mais necessária.
    return unsubscribe;
};

/**
 * Cria um novo livro no Firestore.
 * @param {object} bookData - Os dados do livro a ser criado.
 * @returns {Promise<void>}
 */
const createBook = async (bookData) => {
    try {
        // Adiciona timestamps do servidor. Usar serverTimestamp() garante que a hora
        // seja definida pelo servidor do Firebase, evitando inconsistências de fuso horário do cliente.
        await addDoc(booksCollection, {
            ...bookData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao criar livro: ", error);
        // Lançar o erro permite que a UI (ex: o painel admin) saiba que a operação falhou
        // e possa, por exemplo, reativar o botão de salvar.
        throw error;
    }
};

/**
 * Atualiza um livro existente no Firestore.
 * @param {string} bookId - O ID do livro a ser atualizado.
 * @param {object} bookData - Os novos dados para o livro.
 * @returns {Promise<void>}
 */
const updateBook = async (bookId, bookData) => {
    try {
        // Cria uma referência direta ao documento que queremos atualizar.
        const bookDoc = doc(db, 'books', bookId);
        // Atualiza o documento, incluindo o timestamp de atualização.
        await updateDoc(bookDoc, {
            ...bookData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao atualizar livro: ", error);
        throw error;
    }
};

/**
 * Deleta um livro do Firestore.
 * @param {string} bookId - O ID do livro a ser deletado.
 * @returns {Promise<void>}
 */
const deleteBook = async (bookId) => {
    try {
        const bookDoc = doc(db, 'books', bookId);
        await deleteDoc(bookDoc);
    } catch (error) {
        console.error("Erro ao deletar livro: ", error);
        throw error;
    }
};

// Exporta todas as funções para serem usadas por outras partes da aplicação.
export { listenToBooks, createBook, updateBook, deleteBook };
