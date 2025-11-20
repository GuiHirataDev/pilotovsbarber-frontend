const API_URL = "https://pilotovsbarber-backend.vercel.app";

document.getElementById("data").addEventListener("change", carregarHorarios);
document.getElementById("btnAgendar").addEventListener("click", agendar);

function toast(msg, cor = "#00d26a") {
  const box = document.getElementById("toast");
  box.innerText = msg;
  box.style.background = cor;
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}

async function carregarHorarios() {
  const data = document.getElementById("data").value;
  const select = document.getElementById("horarios");

  if (!data) return;

  select.innerHTML = "<option>Carregando...</option>";

  try {
    const res = await fetch(`${API_URL}/listar_horarios?date=${data}`);
    const horarios = await res.json();

    select.innerHTML = "";

    horarios.forEach((h) => {
      const option = document.createElement("option");
      option.value = h;
      option.textContent = h;
      select.appendChild(option);
    });

    if (horarios.length === 0) {
      select.innerHTML = "<option>Nenhum horário disponível</option>";
    }

  } catch (err) {
    toast("Erro ao carregar horário", "red");
  }
}

async function agendar() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const date = document.getElementById("data").value;
  const horario = document.getElementById("horarios").value;

  if (!nome || !date || !horario) {
    toast("Preencha nome, data e horário", "red");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/agendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone, date, horario }),
    });

    const dataRes = await res.json();

    if (res.status === 409) {
      toast("Horário já reservado", "red");
      carregarHorarios();
      return;
    }

    if (dataRes.success) {
      toast("Agendado com sucesso!");
      carregarHorarios();
      return;
    }

    toast("Erro inesperado", "red");

  } catch (err) {
    toast("Erro ao conectar", "red");
  }
}
