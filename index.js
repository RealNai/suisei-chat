messages = [];

function sendMessage() {
    const chatInput = document.getElementById("chat-input")
    const userInput = chatInput.value;
    chatInput.value = '';

    const chatContainer = document.querySelector('.chat-container');
    chatContainer.innerHTML += `<div class="user">You: ${userInput}</div>`;
    scrollToBottom()

    // if (sessionStorage.getItem("chat-messages")) {
    //     messages = messages.concat(sessionStorage.getItem("chat-messages"));
    // }
    messages.push({"role": "user", "content": userInput});

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
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
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
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

function scrollToBottom() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
  
    changeBgButton.addEventListener('click', () => {
      bgIndex = (bgIndex + 1) % backgrounds.length;
      bgElement.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    });
  
    changeOutfitButton.addEventListener('click', () => {
      outfitIndex = (outfitIndex + 1) % outfits.length;
      suiseiElement.style.backgroundImage = `url(${outfits[outfitIndex]})`;
    });
});