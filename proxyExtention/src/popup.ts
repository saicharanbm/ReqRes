interface Window {
  activeRequests: { details: { requestType: string; url: string } }[];
}

document.addEventListener("DOMContentLoaded", function () {
  const requestList = document.getElementById("requestList");

  // Update request list every second
  setInterval(() => {
    chrome.runtime.getBackgroundPage((background) => {
      if (requestList) {
        requestList.innerHTML = "";
      }
      if (background) {
        background.activeRequests.forEach((request, id) => {
          const div = document.createElement("div");
          div.className = "request-item";

          div.textContent = `${request.details.requestType} ${request.details.url}`;
          requestList?.appendChild(div);
        });
      } else {
        const div = document.createElement("div");
        div.className = "request-item";

        div.textContent = `No requests to show.`;
        requestList?.appendChild(div);
      }
    });
  }, 1000);
});
