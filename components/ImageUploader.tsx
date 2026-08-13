'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase-client';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 1MB制限
    const MAX_SIZE = 1 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('画像サイズは1MB以下にしてください。\n現在: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
      return;
    }

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const storageRef = ref(storage, `push-images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onImageUploaded(url);
      alert('画像アップロード完了！');
    } catch (err) {
      alert('アップロード失敗: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        画像（1MB以下）{uploading && ' - アップロード中...'}
      </label>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          transition: 'all 0.2s',
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="プレビュー" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        ) : (
          <p>
            {isDragActive
              ? 'ここにドロップしてください'
              : 'クリックまたはドラッグ＆ドロップで画像を選択（1MB以下）'}
          </p>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        ※ 対応形式: PNG, JPG, GIF, WebP / 最大1MB
      </p>
    </div>
  );
}
