import { Pencil, Upload } from "lucide-react";

function ImageUploadBox({
    image,
    type,
    label,
    bodyInputRef,
    tattooInputRef,
    editedBodyImage,
    setShowEditor,
    handleImageUpload
}: {
    image: string | null;
    type: 'body' | 'tattoo';
    label: string;
    bodyInputRef: React.RefObject<HTMLInputElement | null>;
    tattooInputRef: React.RefObject<HTMLInputElement | null>;
    editedBodyImage: string | null;
    setShowEditor: (show: boolean) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'body' | 'tattoo') => void;
}) {

    return (
        <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div
                onClick={() => !image && (type === 'body' ? bodyInputRef : tattooInputRef).current?.click()}
                className="relative aspect-square bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-all"
            >
                {image ? (
                    <>
                        <img src={type === 'body' && editedBodyImage ? editedBodyImage : image} alt="Preview" className="w-full h-full object-contain" />
                        {type === 'body' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowEditor(true); }}
                                className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                            >
                                <Pencil className="w-3 h-3" />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Subir imagen</p>
                    </div>
                )}
            </div>
            <input
                ref={type === 'body' ? bodyInputRef : tattooInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, type)}
                className="hidden"
            />
        </div>
    )
};

export default ImageUploadBox