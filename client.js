messages = [];

function sendMessage() {
    const chatInput = document.getElementById("chat-input")
    const userInput = chatInput.value;
    chatInput.value = '';
    autoResizeChatInput(chatInput);

    const chatContainer = document.querySelector('.chat-container');
    chatContainer.innerHTML += `<div class="user">You: ${userInput}</div>`;
    scrollToBottom()

    // if (sessionStorage.getItem("chat-messages")) {
    //     messages = messages.concat(sessionStorage.getItem("chat-messages"));
    // }
    messages.push({"role": "user", "content": userInput});

    showThinkingIndicator();

    try {
        fetch("/api/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({messages: messages}),
        })
        .then(response => {
            console.log(response);
            hideThinkingIndicator();
            if (response.status === 402) {
                document.getElementById('broke-modal').style.display = 'flex';
                return null;
            }
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;
            messages.push({"role": "assistant", "content": data.message});
            chatContainer.innerHTML += `<div class="assistant">Suisei: ${data.message}</div>`;
            scrollToBottom()
            // Trigger Suisei's animation
            const suiseiElement = document.querySelector('.suisei');
            suiseiElement.classList.add('suisei-move');

            // Remove animation class after animation ends
            setTimeout(() => {
                suiseiElement.classList.remove('suisei-move');
            }, 500); // Duration of the animation
        })
        .catch(error => {
            hideThinkingIndicator();
            console.error("Error sending message:", error);
        })
    } catch (error) {
        hideThinkingIndicator();
        console.error("Error sending message:", error);
    }
}

function showThinkingIndicator() {
    const chatContainer = document.querySelector('.chat-container');
    const indicator = document.createElement('div');
    indicator.id = 'thinking-indicator';
    indicator.className = 'assistant thinking';
    indicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatContainer.appendChild(indicator);
    scrollToBottom();

    document.querySelector('.suisei').classList.add('suisei-thinking');
}

function hideThinkingIndicator() {
    const indicator = document.getElementById('thinking-indicator');
    if (indicator) indicator.remove();

    document.querySelector('.suisei').classList.remove('suisei-thinking');
}

function scrollToBottom() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function autoResizeChatInput(chatInput) {
    chatInput.style.height = 'auto';
    const style = getComputedStyle(chatInput);
    const lineHeight = parseFloat(style.lineHeight);
    const verticalExtras = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const maxHeight = lineHeight * 3 + verticalExtras;
    if (chatInput.scrollHeight > maxHeight) {
        chatInput.style.height = maxHeight + 'px';
        chatInput.style.overflowY = 'auto';
    } else {
        chatInput.style.height = chatInput.scrollHeight + 'px';
        chatInput.style.overflowY = 'hidden';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const backgrounds = ['images/bg1.webp', 'images/bg2.webp', 'images/bg3.webp', 'images/bg4.webp', 'images/bg5.webp'];
    const outfits = ['images/suisei_outfit1.webp', 'images/suisei_outfit2.png'];
    let bgIndex = 0;
    let outfitIndex = 0;

    const bgElement = document.querySelector('.bg');
    const suiseiElement = document.querySelector('.suisei');
    const changeBgButton = document.querySelector('.change-bg');
    const changeOutfitButton = document.querySelector('.change-outfit');
    const chatInput = document.getElementById('chat-input');

    changeBgButton.addEventListener('click', () => {
      bgIndex = (bgIndex + 1) % backgrounds.length;
      bgElement.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    });

    changeOutfitButton.addEventListener('click', () => {
      outfitIndex = (outfitIndex + 1) % outfits.length;
      suiseiElement.style.backgroundImage = `url(${outfits[outfitIndex]})`;
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    chatInput.addEventListener('input', () => autoResizeChatInput(chatInput));
    autoResizeChatInput(chatInput);
});