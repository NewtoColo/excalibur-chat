# EXCALIBUR AI Chat Widget - Complete Package

This package contains everything you need to deploy an AI-powered chat widget for EXCALIBUR's website.

---

## 📦 Files Included

- **server.js** - Node.js backend server (handles API calls securely)
- **package.json** - Dependencies and project configuration
- **ExcaliburChatWidget.jsx** - React chat interface component
- **excalibur-chat-widget.js** - Pop-up widget launcher script
- **.env.example** - Environment variables template
- **README.md** - This file

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Your Claude API Key
1. Go to https://console.anthropic.com/
2. Sign up (free)
3. Create an API key
4. Copy it (looks like: `sk-ant-v7uxxxxxxxxxxx`)

### Step 2: Deploy to Render.com
1. Go to https://render.com/ and sign up
2. Click "New +" → "Web Service"
3. Upload this folder (or connect GitHub)
4. Fill in:
   - **Name:** `excalibur-chat`
   - **Language:** Node.js
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variable:
   - **Key:** `CLAUDE_API_KEY`
   - **Value:** Your API key from Step 1
6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment
8. Copy your service URL (e.g., https://excalibur-chat.onrender.com)

### Step 3: Add to Your Weebly Website
1. Log into Weebly
2. Go to Settings → SEO
3. Find "Header Code" section
4. Paste this code:

```html
<!-- EXCALIBUR AI Chat Widget -->
<script>
(function() {
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'excalibur-chat-widget-container';
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 9999;
  `;

  const chatButton = document.createElement('button');
  chatButton.id = 'excalibur-chat-button';
  chatButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  chatButton.style.cssText = `
    background: #003d7a;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
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
  };
  chatButton.onmouseout = function() {
    this.style.transform = 'scale(1)';
  };

  const chatFrame = document.createElement('iframe');
  chatFrame.id = 'excalibur-chat-frame';
  chatFrame.src = 'https://YOUR-SERVER-URL-HERE.onrender.com/';
  chatFrame.style.cssText = `
    display: none;
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 400px;
    height: 500px;
    max-width: 100vw;
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
    z-index: 9998;
  `;

  chatButton.addEventListener('click', function() {
    if (chatFrame.style.display === 'none') {
      chatFrame.style.display = 'block';
      chatButton.style.opacity = '0.5';
    } else {
      chatFrame.style.display = 'none';
      chatButton.style.opacity = '1';
    }
  });

  widgetContainer.appendChild(chatButton);
  widgetContainer.appendChild(chatFrame);
  document.body.appendChild(widgetContainer);

  window.addEventListener('message', function(event) {
    if (event.data === 'closeChat') {
      chatFrame.style.display = 'none';
      chatButton.style.opacity = '1';
    }
  });
})();
</script>
```

5. **IMPORTANT:** Replace `YOUR-SERVER-URL-HERE.onrender.com` with your actual Render URL from Step 2
6. Click "Save"
7. Publish your website
8. Test it! Look for blue chat button in bottom-right corner

---

## 📋 File Descriptions

### server.js
- Node.js/Express backend
- Handles all Claude API calls
- Keeps your API key secure (never exposed to visitors)
- Configured for EXCALIBUR's services

### package.json
- Lists all dependencies (express, cors, dotenv, etc.)
- Defines build and start commands
- Node.js will read this during deployment

### ExcaliburChatWidget.jsx
- React component for the chat interface
- Contains EXCALIBUR service information
- Handles user messages and AI responses

### excalibur-chat-widget.js
- Launcher script that creates the pop-up button
- Injects into your website via the Weebly Header Code
- Creates the chat window and handles open/close

### .env.example
- Template for environment variables
- Rename to `.env` and add your API key before deploying

---

## 🔧 Environment Setup

1. Rename `.env.example` to `.env`
2. Open `.env` and add your Claude API key:
   ```
   CLAUDE_API_KEY=sk-ant-your-actual-key-here
   PORT=3000
   NODE_ENV=production
   CORS_ORIGIN=https://www.excaliburlegalsupport.com
   ```

**DO NOT** commit `.env` to GitHub or share your API key!

---

## 🧪 Testing

Once deployed, test with these questions:
- "What services do you offer?"
- "Do you handle infidelity cases?"
- "What states do you serve?"
- "How do I schedule a consultation?"
- "What's your experience?"

Should get instant responses in 1-2 seconds!

---

## 📊 Costs

| Item | Cost |
|------|------|
| Render.com | Free (or $7/mo if busy) |
| Claude API | ~$1-5/month |
| Weebly | Your existing plan |
| **Total** | **~$5-12/month** |

---

## 🐛 Troubleshooting

### Widget button not showing
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Wait 30 seconds - Weebly can be slow
- Check browser console (F12) for errors

### Chat not responding
- Verify Render service is "Live" (green status)
- Check API key is correct in Render environment variables
- Visit your Render URL directly to verify it's running

### CORS errors
- Update `CORS_ORIGIN` in .env to your domain
- Redeploy to Render

### API key errors
- Double-check your Claude API key is valid
- Make sure it's properly set in Render environment variables
- Redeploy after making changes

---

## 📞 Support

- **Claude API Docs:** https://docs.anthropic.com/
- **Render Docs:** https://render.com/docs
- **Node.js Docs:** https://nodejs.org/docs/

---

## ✅ Deployment Checklist

Before going live:
- [ ] Claude API key obtained
- [ ] Files uploaded to Render
- [ ] API key added to Render environment variables
- [ ] Service deployed and showing "Live"
- [ ] Weebly code updated with correct Render URL
- [ ] Code saved in Weebly Settings → SEO → Header Code
- [ ] Website published
- [ ] Blue chat button visible on your site
- [ ] Chat responds to test messages
- [ ] Mobile testing completed

---

## 🎉 You're Ready!

Your EXCALIBUR website now has a 24/7 AI assistant answering questions about your investigation services.

**Next Steps:**
1. Deploy this package to Render
2. Add the widget code to your Weebly site
3. Test thoroughly
4. Monitor performance

Good luck! 🚀
