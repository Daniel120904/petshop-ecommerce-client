const chatBox = document.getElementById("chatBox");
const messageInput = document.querySelector('input[type="text"]');
const sendButton = document.querySelector('button[type="button"]');

window.addEventListener("DOMContentLoaded", () => {
  chatBox.innerHTML = `
    <div class="bot-message">
      <span>Olá! Sou a IA do PetShop. Como posso te ajudar hoje?</span>
    </div>
  `;
});

function addUserMessage(message) {
  const userMessageDiv = document.createElement("div");
  userMessageDiv.className = "user-message";
  userMessageDiv.innerHTML = `<span>${message}</span>`;
  chatBox.appendChild(userMessageDiv);
  scrollToBottom();
}

function addBotMessage(message) {
  const botMessageDiv = document.createElement("div");
  botMessageDiv.className = "bot-message";
  botMessageDiv.innerHTML = `<span>${message}</span>`;
  chatBox.appendChild(botMessageDiv);
  scrollToBottom();
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-message typing-indicator";
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = `<span>Digitando...</span>`;
  chatBox.appendChild(typingDiv);
  scrollToBottom();
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  addUserMessage(message);

  messageInput.value = "";

  sendButton.disabled = true;
  messageInput.disabled = true;

  showTypingIndicator();

  try {
    const response = await fetch(
      "http://localhost:3000/api/getAiRecommendation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    hideTypingIndicator();

    addBotMessage(data.recommendation);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);

    hideTypingIndicator();

    addBotMessage(
      "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente."
    );
  } finally {
    sendButton.disabled = false;
    messageInput.disabled = false;

    messageInput.focus();
  }
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
