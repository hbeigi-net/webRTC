import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { Close, DragIndicator } from '@mui/icons-material';

interface DraggableVideoPopupProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVisible: boolean;
  onClose: () => void;
  title: string;
}

const DraggableVideoPopup = ({ videoRef, isVisible, onClose, title }: DraggableVideoPopupProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === popupRef.current || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
      if (isResizing) {
        const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart]);

  return (
    <Paper
      ref={popupRef}
      elevation={8}
      sx={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: 'black',
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        border: '2px solid #fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: isVisible ? 'block' : 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <Box
        className="drag-handle"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '0 8px',
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIndicator sx={{ color: 'white', fontSize: 16 }} />
          <Box sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
            {title}
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'white', padding: '2px' }}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Video */}
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)' // Mirror the camera
        }}
        muted={true}
      />

      {/* Resize Handle */}
      <Box
        onMouseDown={handleResizeMouseDown}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          cursor: 'nw-resize',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderTop: '8px solid rgba(255, 255, 255, 0.5)'
          }
        }}
      />
    </Paper>
  );
};

export default DraggableVideoPopup;
