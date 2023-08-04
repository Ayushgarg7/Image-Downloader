 
 document.getElementById("downloadBtn").addEventListener("click", async () => {
    const urlInput = document.getElementById("urlInput");
    const url = urlInput.value.trim();

    if (url === "") {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        const response = await fetch(url);

        // Check if the response is a downloadable file type
        // if (!response.ok || !response.headers.get("content-type").startsWith("application/")) {
        //     alert("Invalid URL or unsupported file type. Only downloadable files are supported.");
        //     return;
        // }

        const file = await response.blob();

        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);

        const filename = getFilenameFromURL(url);
        link.download = filename;
        link.click();
    } catch (error) {
        alert("Failed to download the file. Please check the URL and try again.");
    }
});

function getFilenameFromURL(url) {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
}