function go() {
  chrome.tabs.create({
    url: "https://example.com",
    active: true,
  });
  window.close();
}
document.querySelector("button").addEventListener("click", go);
