// type activeRequestType = { details: { requestType: string; url: string } };

// document.addEventListener("DOMContentLoaded", function () {
//   const requestList = document.getElementById("requestList");

//   // Update request list every second
//   setInterval(() => {
//     chrome.runtime.sendMessage(
//       { type: "GET_ACTIVE_REQUESTS" },
//       (activeRequests) => {
//         if (requestList) {
//           requestList.innerHTML = "";
//         }
//         if (activeRequests) {
//           activeRequests.forEach((request: activeRequestType) => {
//             const div = document.createElement("div");
//             div.className = "request-item";

//             div.textContent = `${request.details.requestType} ${request.details.url}`;
//             requestList?.appendChild(div);
//           });
//         } else {
//           const div = document.createElement("div");
//           div.className = "request-item";

//           div.textContent = JSON.stringify(activeRequests);
//           requestList?.appendChild(div);
//         }
//       }
//     );
//   }, 1000);
// });
