// firebase/firebaseConfig.js

// Importa as funções necessárias do SDK do Firebase que configuramos no importmap.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ARQUITETURA: Centralizar a configuração do Firebase em um único arquivo
// garante que toda a aplicação use a mesma instância, evitando conexões duplicadas
// e facilitando a manutenção.

// =============================================================================
// ATENÇÃO: SUBSTITUA AS INFORMAÇÕES ABAIXO PELAS DO SEU PROJETO FIREBASE
// 1. Vá para o console do Firebase: https://console.firebase.google.com/
// 2. Crie um novo projeto (ou selecione um existente).
// 3. Vá para "Configurações do projeto" (ícone de engrenagem).
// 4. Na aba "Geral", role para baixo até "Seus apps".
// 5. Clique no ícone da web "</>" para adicionar um app da web.
// 6. Dê um nome ao seu app e clique em "Registrar app".
// 7. O Firebase fornecerá um objeto `firebaseConfig`. Copie e cole aqui.
// =============================================================================

const firebaseConfig = {
  apiKey: "AIzaSyC4GUyzhu-ax0a-DuqWWneSI764wgGga90",
  authDomain: "landingpagelivros.firebaseapp.com",
  projectId: "landingpagelivros",
  storageBucket: "landingpagelivros.firebasestorage.app",
  messagingSenderId: "681377067030",
  appId: "1:681377067030:web:3722bdf9cd4e36e3970537",
  measurementId: "G-JN86KFWJ7L"
};


// Inicializa o aplicativo Firebase com a configuração fornecida.
// Esta é a porta de entrada para todos os serviços do Firebase.
const app = initializeApp(firebaseConfig);

// Obtém a instância do Firestore para este aplicativo.
// É este objeto 'db' que usaremos para todas as operações de banco de dados:
// ler, escrever, atualizar, deletar e ouvir mudanças em tempo real.
const db = getFirestore(app);

// Exporta a instância do Firestore para ser usada em outros módulos,
// como o nosso `bookService.js`.
export { db };
