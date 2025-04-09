"use client"

import { useEffect } from "react"
import Script from "next/script"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "df-messenger": any
    }
  }
}

export default function DialogflowMessenger() {
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      df-messenger {
        z-index: 999;
        position: fixed;
        bottom: 20px;
        right: 20px;
      }

      df-messenger-chat {
        background: rgba(26, 30, 35, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
        border: 1px solid rgba(0, 255, 255, 0.1) !important;
        width: 400px !important;
        height: 600px !important;
        max-height: 80vh !important;
      }

      df-messenger-titlebar {
        background: linear-gradient(90deg, #2A3038 0%, #1A1E23 100%) !important;
        border-bottom: 1px solid rgba(0, 255, 255, 0.1) !important;
        border-radius: 12px 12px 0 0 !important;
        padding: 16px !important;
      }

      df-messenger-titlebar::before {
        content: 'Chat with Maximus';
        color: #00FFFF;
        font-size: 18px;
        font-weight: 600;
      }

      df-messenger-message {
        background: #2A3038 !important;
        border-radius: 12px !important;
        padding: 12px !important;
        margin: 8px !important;
        animation: fadeIn 0.3s ease-out;
      }

      df-messenger-message[agent="true"] {
        background: #1A1E23 !important;
        border: 1px solid rgba(0, 255, 255, 0.1) !important;
      }

      df-messenger-message[agent="false"] {
        background: rgba(0, 255, 255, 0.1) !important;
      }

      df-messenger-user-input {
        background: #2A3038 !important;
        border: 1px solid rgba(0, 255, 255, 0.1) !important;
        border-radius: 24px !important;
        margin: 16px !important;
        padding: 12px 16px !important;
      }

      df-messenger-user-input::placeholder {
        color: rgba(255, 255, 255, 0.5) !important;
      }

      df-messenger-send-icon {
        color: #00FFFF !important;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
        strategy="lazyOnload"
      />
      <df-messenger
        project-id="weighty-elf-450509-b5"
        agent-id="cd904ab7-f36f-4d6c-b827-24b43bbb36a9"
        language-code="en"
        max-query-length="-1"
      />
    </>
  )
}
