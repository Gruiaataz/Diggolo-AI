const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// FOLOSIM UN MODEL MAI MIC ȘI MAI STABIL PENTRU RENDER
const HF_TOKEN = "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"; 
const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

async function getAIResponse(prompt) {
    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        const data = await response.json();

        if (data.error) {
            if (data.error.includes("currently loading")) {
                return "AI-Diggolo se trezește acum... Mai încearcă o dată în 10 secunde.";
            }
            return "Eroare AI: " + data.error;
        }

        return data.generated_text || data[0].generated_text;
    } catch (e) {
        return "Eroare de rețea. Verifică dacă ai adăugat corect cheia API.";
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user-message');
    userInput.value = "";

    const loadingId = "loading-" + Date.now();
    addMessage("AI-Diggolo gândește...", 'ai-message', null, loadingId);

    const aiResponse = await getAIResponse(text);

    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();

    addMessage(aiResponse, 'ai-message');
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

function addMessage(text, className, code = null, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}
