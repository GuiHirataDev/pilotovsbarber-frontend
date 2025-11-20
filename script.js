document.getElementById("btnTestar").onclick = async () => {
  const url =
    "https://pilotovsbarber-backend.vercel.app/listar_horarios?date=2025-11-22";

  try {
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById("saida").innerText =
      JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("saida").innerText =
      "Erro: " + err.toString();
  }
};
