import { db } from "./firebase-config.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const rankingList = document.getElementById("rankingList");

async function carregarRanking() {
  rankingList.innerHTML = "<p>Carregando ranking...</p>";

  try {
    const usuariosRef = collection(db, "usuarios");

    // Ordenar por pontuacao_total desc, limitado a 10
    const q = query(usuariosRef, orderBy("pontuacao_total", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    rankingList.innerHTML = ""; // Limpa a lista antes de preencher

    let posicao = 1;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const avatarURL = data.avatarURL && data.avatarURL !== "default"
        ? data.avatarURL
        : "default-avatar.png";

      const playerDiv = document.createElement("div");
      playerDiv.className = "player-rank";

      playerDiv.innerHTML = `
        <span>${posicao}º</span>
        <img src="${avatarURL}" alt="Avatar do jogador ${data.nick || "Anônimo"}" />
        <div class="nick">${data.nick || "Anônimo"}</div>
        <div class="stats">
          <div>Pontos: ${data.pontuacao_total || 0}</div>
          <div>Cliques: ${data.cliques_totais || 0}</div>
        </div>
      `;

      rankingList.appendChild(playerDiv);
      posicao++;
    });

    if (posicao === 1) {
      rankingList.innerHTML = "<p>Nenhum jogador encontrado.</p>";
    }

  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    rankingList.innerHTML = `<p>Erro ao carregar ranking.</p>`;
  }
}

carregarRanking();
setInterval(carregarRanking, 60000); // Atualiza a cada 60s
