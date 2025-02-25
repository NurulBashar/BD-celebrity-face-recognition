document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const predictBtn = document.getElementById("predict-btn");
    const resultDiv = document.getElementById("results");

    dropArea.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handleFile);

    async function handleFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        resultDiv.innerHTML = "<p>Processing...</p>";

        try {
            const response = await fetch("https://Bashar306-Face-recognition.hf.space/predict", {
                method: "POST",
                body: JSON.stringify({ img: file }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            resultDiv.innerHTML = "<p>Error processing image</p>";
        }
    }

    function displayResults(data) {
        let output = "<h3>Recognition Results:</h3>";
        for (const [celebrity, confidence] of Object.entries(data)) {
            output += `<p>${celebrity}: ${Math.round(confidence * 100)}%</p>`;
        }
        resultDiv.innerHTML = output;
    }
});
