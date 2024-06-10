import { useSong } from './SongProvider';
import { useCallback, useEffect, useRef, useState } from 'react';

const SongUploadArea = () => {
  const { parseImport, importSongFromJson } = useSong();

  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current++;
    if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current > 0) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        dragCounter.current = 0;
        const [file] = event.dataTransfer.files;
        const textContent = await file.text();
        const songObject = parseImport(textContent);
        if (songObject) {
          importSongFromJson(songObject);
        }
        event.dataTransfer.clearData();
      }
    },
    [parseImport, importSongFromJson],
  );

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  });
  return isDragging ? (
    <div
      style={{
        backgroundColor: isDragging ? 'rgba(0,0,0,0.5)' : undefined,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100vh',
      }}
    ></div>
  ) : null;
};

export default SongUploadArea;
