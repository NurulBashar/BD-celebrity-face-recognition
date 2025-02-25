import { Client } from "@gradio/client";

document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const predictBtn = document.getElementById("predict-btn");
    const resultDiv = document.getElementById("results");

    let selectedFile = null;

    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault());
    });

    // Highlight drop area when file is dragged over
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add("dragging"));
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove("dragging"));
    });

    // Handle dropped files
    dropArea.addEventListener("drop", (e) => {
        let files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Handle file selection
    dropArea.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

    function handleFile(file) {
        selectedFile = file;
        if (!selectedFile) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = function (e) {
            resultDiv.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" width="250"><p>Image Ready for Processing</p>`;
        };
        reader.readAsDataURL(selectedFile);
    }

    async function sendImageToAPI() {
        if (!selectedFile) {
            alert("Please upload an image first.");
            return;
        }

        resultDiv.innerHTML = "<p>Processing...</p>";

        try {
            // Convert file to Blob
            const fileBlob = new Blob([selectedFile], { type: selectedFile.type });

            // Initialize Gradio client
            const client = await Client.connect("Bashar306/Face_recognition");

            // Call API
            const result = await client.predict("/predict", {
                img: fileBlob,
            });

            displayResults(result.data);
        } catch (error) {
            resultDiv.innerHTML = "<p>Error processing image</p>";
            console.error(error);
        }
    }

    function displayResults(data) {
        let output = "<h3>Recognition Results:</h3>";
        for (const [celebrity, confidence] of Object.entries(data)) {
            output += `<p>${celebrity}: ${Math.round(confidence * 100)}%</p>`;
        }
        resultDiv.innerHTML = output;
    }

    predictBtn.addEventListener("click", sendImageToAPI);
});
