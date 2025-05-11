function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    document.getElementById("output").innerText = "Listening...";

    recognition.onresult = function(event) {
        const userSpeech = event.results[0][0].transcript;
        document.getElementById("output").innerText = "You said: " + userSpeech;
        sendToAI(userSpeech);
    };

    recognition.onerror = function(event) {
        document.getElementById("output").innerText = "Error: " + event.error;
    };
}

async function sendToAI(message) {
    const response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    document.getElementById("output").innerText = "AI says: " + data.reply;
    speak(data.reply);
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
}
