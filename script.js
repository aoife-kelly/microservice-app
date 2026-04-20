async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");
    const file = fileInput.files[0];

    if (!file) {
        status.innerText = "Please choose a JSON file first.";
        return;
    }

    try {
        status.innerText = "Requesting upload URL...";

        const response = await fetch("YOUR_API_ENDPOINT/upload-url");

        if (!response.ok) {
            throw new Error(`Failed to get upload URL: ${response.status}`);
        }

        const data = await response.json();
        const uploadURL = data.uploadURL;

        status.innerText = "Uploading file to S3...";

        const uploadResponse = await fetch(uploadURL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: file
        });

        if (!uploadResponse.ok) {
            throw new Error(`S3 upload failed: ${uploadResponse.status}`);
        }

        status.innerText = "Upload complete!";
    } catch (error) {
        console.error("Upload error:", error);
        status.innerText = "Upload failed. Check browser console and AWS settings.";
    }
}