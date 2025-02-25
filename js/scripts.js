document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const predictBtn = document.getElementById("predict-btn");
    const resultDiv = document.getElementById("results");

    dropArea.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handleFile);
    predictBtn.addEventListener("click", sendImageToAPI);

    let selectedFile = null;

    function handleFile(event) {
        selectedFile = event.target.files[0];
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

        const formData = new FormData();
        formData.append("img", selectedFile);

        try {
            const response = await fetch("https://Bashar306-Face_recognition.hf.space/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process the image");
            }

            const data = await response.json();
            displayResults(data);
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
});
