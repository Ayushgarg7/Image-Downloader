let mediaDownloadEnabled = false;

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("downloadButton").addEventListener("click", function() {
    mediaDownloadEnabled = !mediaDownloadEnabled;
    updateButtonLabel();
    toggleMediaDownload(mediaDownloadEnabled);
  });
});

function updateButtonLabel() {
  const button = document.getElementById("downloadButton");
  button.textContent = mediaDownloadEnabled ? "Media Download Enabled" : "Enable Media Download";
}

function toggleMediaDownload(enabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const code = `
      const images = document.querySelectorAll("img");
      images.forEach(img => {
        img.style.pointerEvents = enabled ? "auto" : "none";
        img.style.cursor = enabled ? "pointer" : "default";
      });

      const videos = document.querySelectorAll("video");
      videos.forEach(video => {
        video.controls = enabled;
      });
    `;

    const downloadCode = `
      const mediaElements = document.querySelectorAll("img, video");
      mediaElements.forEach(element => {
        const link = document.createElement("a");
        link.href = element.src || element.currentSrc;
        link.download = getFileNameFromURL(link.href);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    `;

    if (enabled) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          eval(code);
          eval(downloadCode);
        },
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          eval(code);
        },
      });
    }
  });
}

function getFileNameFromURL(url) {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
}
