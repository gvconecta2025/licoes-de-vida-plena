// services/bookService.js

import { db } from '../firebase/firebaseConfig.js';
import {
    collection, query, orderBy, onSnapshot,
    addDoc, updateDoc, deleteDoc, doc,
    serverTimestamp, getDoc, setDoc
} from "firebase/firestore";

const booksCollection = collection(db, 'books');
const settingsCollection = collection(db, 'settings');

/**
 * Escuta por mudanças em tempo real na coleção de livros.
 * A ordenação padrão agora é pelo 'displayOrder', depois por data.
 */
const listenToBooks = (callback) => {
    const q = query(booksCollection, orderBy('displayOrder', 'asc'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const books = [];
        querySnapshot.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() });
        });
        callback(books);
    }, (error) => {
        console.error("Erro ao escutar por atualizações de livros: ", error);
        callback([]);
    });

    return unsubscribe;
};

/**
 * Escuta por mudanças em tempo real nas configurações da homepage.
 * @param {function} callback - Chamada com os dados de configuração.
 * @returns {function} Uma função 'unsubscribe'.
 */
const listenToHomepageSettings = (callback) => {
    const homepageDocRef = doc(settingsCollection, 'homepage');
    const unsubscribe = onSnapshot(homepageDocRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            // Se o documento não existir, retorna um estado padrão.
            console.warn("Documento de configurações 'homepage' não encontrado. Usando padrão.");
            callback({ featuredBookId: null });
        }
    }, (error) => {
        console.error("Erro ao escutar configurações da homepage: ", error);
        callback({ featuredBookId: null });
    });
    return unsubscribe;
};

/**
 * Atualiza as configurações da homepage.
 * @param {object} settingsData - Os dados a serem salvos, ex: { featuredBookId: '...' }.
 */
const updateHomepageSettings = async (settingsData) => {
    try {
        const homepageDocRef = doc(settingsCollection, 'homepage');
        // Usa setDoc com merge: true para criar o documento se não existir, ou atualizar se existir.
        await setDoc(homepageDocRef, settingsData, { merge: true });
    } catch (error) {
        console.error("Erro ao atualizar configurações da homepage: ", error);
        throw error;
    }
};

const createBook = async (bookData) => {
    try {
        await addDoc(booksCollection, {
            ...bookData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao criar livro: ", error);
        throw error;
    }
};

const updateBook = async (bookId, bookData) => {
    try {
        const bookDoc = doc(db, 'books', bookId);
        await updateDoc(bookDoc, {
            ...bookData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao atualizar livro: ", error);
        throw error;
    }
};

const deleteBook = async (bookId) => {
    try {
        const bookDoc = doc(db, 'books', bookId);
        await deleteDoc(bookDoc);
    } catch (error) {
        console.error("Erro ao deletar livro: ", error);
        throw error;
    }
};

export {
    listenToBooks,
    createBook,
    updateBook,
    deleteBook,
    listenToHomepageSettings,
    updateHomepageSettings
};