document.getElementById("get-advice").addEventListener("click", getAdvice);

const geminiKey = "AIzaSyCd877m69DAs9hFeygrwtXzKlw3q4MiJMM";
async function getAdvice() {
  const input = document.getElementById("question");
  const p = document.getElementById("response");
  const card = document.getElementById("card");

  p.innerText = "Pensando...";

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
      p.innerText = texto;
      card.style.display = "block";
    } else {
      p.innerText = "Opa, a IA não soube responder agora.";
    }
  } catch (error) {
    console.error("Erro na chamada:", error);
    p.innerText =
      "Erro ao conectar com a IA. Verifique sua conexão ou a chave.";
  }
}
