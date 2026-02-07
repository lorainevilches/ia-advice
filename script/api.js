document.getElementById("get-advice").addEventListener("click", getAdvice);
document.getElementById("new-advice").addEventListener("click", resetToInitial);

document.getElementById("question").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getAdvice();
  }
});

const geminiKey = "AIzaSyCd877m69DAs9hFeygrwtXzKlw3q4MiJMM";

async function getAdvice() {
  const input = document.getElementById("question");
  const p = document.getElementById("response");
  const card = document.getElementById("card");
  const button = document.getElementById("get-advice");

  if (!input.value.trim()) {
    p.innerText = "Por favor, escreva algo antes de pedir um conselho 💙";
    card.style.display = "block";
    return;
  }

  button.disabled = true;
  button.innerText = "Pensando...";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: {
              text: "Aja como um conselheiro amoroso e direto. Dê conselhos claros, curtos e carinhosos para qualquer tema da vida, sempre com delicadeza, empatia e tom acolhedor de coach. Respostas com no máximo 3 frases.",
            },
          },
          contents: [{ parts: [{ text: input.value }] }],
        }),
      },
    );

    const dados = await response.json();
    const texto = dados?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (texto) {
      const textoLimpo = texto.replace(/<[^>]*>/g, "").trim();
      p.innerText = textoLimpo;

      const inputContainer = document.querySelector(".input-container");
      const newAdviceBtn = document.getElementById("new-advice");

      card.style.display = "block";
      inputContainer.style.display = "none";
      newAdviceBtn.style.display = "block";
    } else {
      p.innerText = "Opa, a IA não soube responder agora.";
    }
  } catch (error) {
    console.error("Erro na chamada:", error);
    p.innerText =
      "Erro ao conectar com a IA. Verifique sua conexão ou a chave.";
  } finally {
    button.disabled = false;
    button.innerText = "Get the advice";
  }
}

function resetToInitial() {
  const input = document.getElementById("question");
  const card = document.getElementById("card");
  const inputContainer = document.querySelector(".input-container");
  const newAdviceBtn = document.getElementById("new-advice");

  input.value = "";
  card.style.display = "none";
  newAdviceBtn.style.display = "none";
  inputContainer.style.display = "flex";
}
