// EXCALIBUR Legal Support - AI Chat Widget
// Add this script to your website's <head> or footer

(function() {
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'excalibur-chat-widget-container';
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    z-index: 9999;
  `;

  // Create button to open chat
  const chatButton = document.createElement('button');
  chatButton.id = 'excalibur-chat-button';
  chatButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  chatButton.style.cssText = `
    background: #003d7a;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 61, 122, 0.3);
    transition: all 0.3s ease;
    padding: 0;
  `;

  chatButton.onmouseover = function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 6px 16px rgba(0, 61, 122, 0.4)';
  };

  chatButton.onmouseout = function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 12px rgba(0, 61, 122, 0.3)';
  };

  // Create chat iframe
  const chatFrame = document.createElement('iframe');
  chatFrame.id = 'excalibur-chat-frame';
  chatFrame.style.cssText = `
    display: none;
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 400px;
    height: 500px;
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
    z-index: 9998;
  `;

  // Set iframe src - replace with your actual endpoint
  chatFrame.src = 'https://www.excaliburlegalsupport.com/chat/';

  // Toggle chat visibility
  chatButton.addEventListener('click', function() {
    if (chatFrame.style.display === 'none') {
      chatFrame.style.display = 'block';
      chatButton.style.opacity = '0.5';
    } else {
      chatFrame.style.display = 'none';
      chatButton.style.opacity = '1';
    }
  });

  // Append elements to page
  widgetContainer.appendChild(chatButton);
  widgetContainer.appendChild(chatFrame);
  document.body.appendChild(widgetContainer);

  // Handle close message from iframe
  window.addEventListener('message', function(event) {
    if (event.data === 'closeChat') {
      chatFrame.style.display = 'none';
      chatButton.style.opacity = '1';
    }
  });
})();
