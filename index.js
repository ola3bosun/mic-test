document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const startBtn = document.getElementById("start-btn");

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-GB";
    recognition.continuous = true;

    let isRecognizing = false;
    let finalTranscript = "";

    // Button to start/stop recognition
    startBtn.addEventListener("click", () => {
        if (!isRecognizing) {
            recognition.start();
            isRecognizing = true;
            startBtn.textContent = "Stop Listening";
        } else {
            recognition.stop();
            isRecognizing = false;
            startBtn.textContent = "Start Listening";
        }
    });

    // Process results and add punctuation
    recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            const text = result[0].transcript;

            // If final result, process with punctuation
            if (result.isFinal) {
                finalTranscript += addPunctuation(text);
            } else {
                // For interim results, display without punctuation
                interimTranscript += text;
            }
        }
        output.textContent = finalTranscript + interimTranscript; // Combine final and interim text
    };

    // Stop recognition and reset button
    recognition.onend = () => {
        isRecognizing = false;
        startBtn.textContent = "Start Listening";
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        isRecognizing = false;
        startBtn.textContent = "Start Listening";
    };

    // Function to add punctuation
    function addPunctuation(text) {
        // Capitalize the first letter
        text = text.charAt(0).toUpperCase() + text.slice(1);

        // Add a period at the end of each sentence 
        if (!/[.!?]$/.test(text)) {
            text += ".";
        }

        // Optionally handle commas or other punctuation - kinda , to be reviewed soon!!!!!
        text = text.replace(/\band\b/gi, ", and");
        text = text.replace(/\bbut\b/gi, ", but");

        return text + " ";
    }

    // Function to change color theme
    function toggleMode() {
        var body = document.body;  // Moved body inside the function
        if (body.classList.contains("light")) {
            document.getElementsByClassName("toggle")[0].style.justifyContent = "right";
            body.classList.remove("light");
            body.classList.add("dark");
        } else if (body.classList.contains("dark")) {
            document.getElementsByClassName("toggle")[0].style.justifyContent = "left";
            body.classList.remove("dark");
            body.classList.add("light");
        }
    }

    // Add event listener for the mode toggle
    document.getElementById('slider').addEventListener("click", toggleMode);
});
