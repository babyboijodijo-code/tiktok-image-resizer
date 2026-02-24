import { useCallback, useState } from 'react'

export default function ImageUploader({ onUpload }) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true)
        } else if (e.type === 'dragleave') {
            setIsDragging(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0])
        }
    }, [])

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0])
        }
    }

    const handleFiles = (file) => {
        if (!file.type.startsWith('image/')) return

        const reader = new FileReader()
        reader.onload = (e) => {
            onUpload(e.target.result)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging
                    ? 'border-tiktok-blue bg-tiktok-blue/10 scale-[1.02]'
                    : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full bg-gray-800 transition-colors ${isDragging ? 'bg-tiktok-blue/20 text-tiktok-blue' : 'text-gray-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <p className="text-xl font-semibold">Drop image here or click to upload</p>
                    <p className="text-gray-500 text-sm">Supports JPG, PNG, WEBP</p>
                </div>

                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />

                <label
                    htmlFor="file-upload"
                    className="btn-primary cursor-pointer inline-block mt-4"
                >
                    Select File
                </label>
            </div>
        </div>
    )
}
