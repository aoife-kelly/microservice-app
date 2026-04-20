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

        // Use your actual API Gateway Invoke URL here
        const response = await fetch("https://smme10qp9l.execute-api.eu-west-1.amazonaws.com/dev/upload-url");

        if (!response.ok) {
            throw new Error(`Failed to get upload URL: ${response.status}`);
        }

        const data = await response.json();
        const uploadURL = data.uploadURL;

        status.innerText = "Uploading file to S3...";

        // To prevent SignatureDoesNotMatch errors, we remove the explicit Content-Type header
        // This must match the Lambda's presigned URL generation parameters
        const uploadResponse = await fetch(uploadURL, {
            method: "PUT",
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
