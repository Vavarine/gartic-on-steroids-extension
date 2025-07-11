const OriginalWebSocket = window.WebSocket;

const eventIdMap = new Map([
  ["34", "ON_GAME_INIT"],
  ["27", "ON_RIGHT_GUESS"],
  ["19", "ON_GAME_END"],
]);

window.WebSocket = function (url, protocols) {
  const ws = new OriginalWebSocket(url, protocols);

  console.log("🔗 WebSocket connection created:", url);

  // Store original methods
  const originalSend = ws.send;

  // Override send - this is safe and won't cause loops
  ws.send = function (data) {
    // console.log("📤 Outgoing:", data);
    return originalSend.call(this, data);
  };

  // Add ONE message listener using capture phase
  // This fires before any user handlers
  ws.addEventListener(
    "message",
    function (event) {
      try {
        const eventStringData = event.data?.split?.("[")[1];
        const eventData = eventStringData
          ? JSON.parse("[" + eventStringData)
          : null;

        const eventId = String(eventData?.[0]);

        if (eventId && eventIdMap.has(eventId)) {
          window.postMessage({
            type: eventIdMap.get(eventId),
            detail: eventData,
          });
        }
      } catch (e) {
        // console.error("Error parsing WebSocket message:", e);
      }
    },
    true
  ); // Capture phase = fires first

  // Log connection events
  ws.addEventListener("open", () => console.log("✅ WebSocket opened"));
  ws.addEventListener("close", () => console.log("❌ WebSocket closed"));
  ws.addEventListener("error", () => console.log("⚠️ WebSocket error"));

  return ws;
};

// Copy static properties
Object.assign(window.WebSocket, OriginalWebSocket);

console.log("Minimal WebSocket interceptor active");
