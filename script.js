const API_URL = "https://pilotovsbarber-backend.vercel.app";

document.getElementById("data").addEventListener("change", carregarHorarios);
document.getElementById("btnAgendar").addEventListener("click", agendar);

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
    document.getElementById("saida").innerText = "Erro ao carregar horários";
  }
}

async function agendar() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const date = document.getElementById("data").value;
  const horario = document.getElementById("horarios").value;

  if (!nome || !date || !horario) {
    return alert("Preencha nome, data e horário.");
  }

  try {
    const res = await fetch(`${API_URL}/agendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone, date, horario })
    });

    const dataRes = await res.json();

    if (res.status === 409) {
      alert("Horário já reservado.");
      return carregarHorarios();
    }

    if (dataRes.success) {
      alert("Agendamento realizado com sucesso!");
      carregarHorarios();
      return;
    }

    alert("Erro: " + JSON.stringify(dataRes));
  } catch (err) {
    alert("Erro ao agendar.");
  }
}
