"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface ImageUrlManagerProps {
  onSave: (urls: Record<string, string>) => void
  sections: string[]
  initialUrls?: Record<string, string>
}

export default function ImageUrlManager({ onSave, sections, initialUrls = {} }: ImageUrlManagerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [urls, setUrls] = useState<Record<string, string>>(initialUrls)

  const handleChange = (section: string, value: string) => {
    setUrls((prev) => ({ ...prev, [section]: value }))
  }

  const handleSave = () => {
    onSave(urls)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-purple-600 transition-colors"
      >
        Update Image URLs
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Image URLs</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {sections.map((section) => (
            <div key={section} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{section}</label>
              <input
                type="text"
                value={urls[section] || ""}
                onChange={(e) => handleChange(section, e.target.value)}
                placeholder="Enter image URL"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          ))}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
