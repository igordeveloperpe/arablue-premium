import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface ImageUploaderProps {
    currentImage?: string;
    currentPosition?: string;
    onUpload: (url: string) => void;
    onPositionChange?: (position: string) => void;
    aspectRatio?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    currentImage,
    currentPosition = '50% 50%',
    onUpload,
    onPositionChange,
    aspectRatio = 'aspect-video'
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    // Parse initial position
    const initialPos = currentPosition.split(' ');
    const [posX, setPosX] = useState(parseInt(initialPos[0]) || 50);
    const [posY, setPosY] = useState(parseInt(initialPos[1]) || 50);

    useEffect(() => {
        setPreview(currentImage);
    }, [currentImage]);

    useEffect(() => {
        if (onPositionChange) {
            onPositionChange(`${posX}% ${posY}%`);
        }
    }, [posX, posY]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload to Supabase
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (data) {
                onUpload(data.publicUrl);
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erro ao fazer upload da imagem.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {preview && (
                <div className="space-y-4">
                    <div className={`relative ${aspectRatio} w-full rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gray-100`}>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-all duration-100"
                            style={{ objectPosition: `${posX}% ${posY}%` }}
                        />
                        <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl"></div>
                    </div>

                    {onPositionChange && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ajustar Enquadramento</span>
                                <button
                                    onClick={() => { setPosX(50); setPosY(50); }}
                                    className="text-[10px] font-bold text-primary hover:underline"
                                >
                                    Resetar
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                        <span>Horizontal</span>
                                        <span>{posX}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={posX}
                                        onChange={(e) => setPosX(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                                        <span>Vertical</span>
                                        <span>{posY}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={posY}
                                        onChange={(e) => setPosY(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
                                <p className="text-[10px] font-black uppercase text-primary">Enviando...</p>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-3xl mb-2">add_a_photo</span>
                                <p className="text-xs text-gray-500 font-bold group-hover:text-gray-700 transition-colors">
                                    {preview ? 'Trocar Imagem' : 'Upload de Imagem'}
                                </p>
                            </>
                        )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;
