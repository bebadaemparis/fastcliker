import { auth, db } from "./firebase-config.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, getDoc, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("authForm");
const avatarInput = document.getElementById("avatar");

const btnNovo = document.getElementById("btnNovo");
const btnContinuar = document.getElementById("btnContinuar");
const avatarGroup = document.getElementById("avatarGroup");

// Controle visual dos modos
btnNovo.addEventListener("click", () => {
  form.dataset.mode = "novo";
  btnNovo.classList.add("active");
  btnContinuar.classList.remove("active");
  avatarGroup.style.display = "block";
  document.getElementById("nick").required = true;
  document.getElementById("senha").required = true;
  avatarInput.value = "";
});

btnContinuar.addEventListener("click", () => {
  form.dataset.mode = "continuar";
  btnContinuar.classList.add("active");
  btnNovo.classList.remove("active");
  avatarGroup.style.display = "none";
  document.getElementById("nick").required = true;
  document.getElementById("senha").required = true;
  avatarInput.value = "";
});

function getAvatarBase64() {
  const file = avatarInput.files[0];
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function findUserByNick(nick) {
  const userDoc = await getDoc(doc(db, "usuarios", nick));
  if (!userDoc.exists()) return null;
  return userDoc;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nick = document.getElementById("nick").value.trim();
  const senha = document.getElementById("senha").value;

  if (!nick || !senha) {
    alert("Por favor, preencha nick e senha.");
    return;
  }

  try {
    // Login anônimo para pegar uid temporário
    await signInAnonymously(auth);

    if (form.dataset.mode === "novo") {
      // Novo jogador: verifica se o nick já existe
      const existingUserDoc = await findUserByNick(nick);
      if (existingUserDoc) {
        alert("Este nick já está em uso. Por favor, escolha outro ou utilize 'Continuar Progresso'.");
        return;
      }

      const avatarBase64 = await getAvatarBase64();

      // Salva novo usuário no Firestore com o nick como ID do documento
      await setDoc(doc(db, "usuarios", nick), {
        nick,
        senha,  // Em produção, sempre usar hash
        avatarURL: avatarBase64 || "default",
        cliques: 0,
        pontuacao: 0,
        cliques_totais: 0,
        pontuacao_total: 0,
        ultima_partida: new Date().toISOString()
      });

      // Salva no sessionStorage
      sessionStorage.setItem("user", JSON.stringify({
        uid: nick,
        nick,
        avatarURL: avatarBase64 || "default",
        cliques: 0,
        pontuacao: 0,
        cliques_totais: 0,
        pontuacao_total: 0
      }));

      window.location.href = "game.html";

    } else if (form.dataset.mode === "continuar") {
      // Continuar progresso: busca usuário pelo nick e verifica senha
      const userDoc = await findUserByNick(nick);

      if (!userDoc) {
        alert("Usuário não encontrado. Verifique o nick ou crie um novo jogador.");
        return;
      }

      const userData = userDoc.data();

      if (userData.senha !== senha) {
        alert("Senha incorreta.");
        return;
      }

      // Salva no sessionStorage os dados do usuário recuperados
      sessionStorage.setItem("user", JSON.stringify({
        uid: nick,
        nick: userData.nick,
        avatarURL: userData.avatarURL || "default",
        cliques: userData.cliques || 0,
        pontuacao: userData.pontuacao || 0,
        cliques_totais: userData.cliques_totais || 0,
        pontuacao_total: userData.pontuacao_total || 0
      }));

      window.location.href = "game.html";

    } else {
      alert("Modo desconhecido.");
    }

  } catch (err) {
    console.error("Erro:", err.message);
    alert("Erro: " + err.message);
  }
});
