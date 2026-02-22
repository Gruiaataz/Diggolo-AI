const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// Cheia ta (asigură-te că e exact așa, fără spații)
const HF_TOKEN = "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"; 

async function getAIResponse(prompt) {
    // Folosim un model foarte stabil de la Hugging Face
    const model = "facebook/blenderbot-400M-distill"; 

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        const data = await response.json();

        // Dacă primim eroare de încărcare, e normal la prima pornire
        if (data.error) {
            return "AI-Diggolo se pregătește (serverul se încarcă). Te rog mai apasă o dată butonul în 10 secunde.";
        }

        // Blenderbot returnează direct textul în generated_text
        return data.generated_text || data[0].generated_text;

    } catch (e) {
        console.error("Eroare Detaliată:", e);
        return "Eroare: Browserul a blocat conexiunea. Încearcă să deschizi fișierul index.html cu 'Right Click -> Open with Chrome' (nu prin dublu click direct pe fișier, uneori contează).";
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user-message');
    userInput.value = "";

    const loadingId = "loading-" + Date.now();
    addMessage("AI-Diggolo răspunde...", 'ai-message', null, loadingId);

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

    if (code) {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        wrapper.innerHTML = `<pre class="code-block">${code}</pre>`;
        msgDiv.appendChild(wrapper);
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}