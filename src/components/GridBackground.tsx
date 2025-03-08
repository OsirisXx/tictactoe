import { useEffect, useRef } from 'react';

const GridBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    // Add new function for random streaks
    const createRandomStreak = () => {
      const gridSize = 50;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Random starting position
      let startX = Math.random() * width;
      let startY = Math.random() * height;
      
      // Random direction (-1 to 1 for both x and y)
      const dirX = (Math.random() - 0.5) * 2;
      const dirY = (Math.random() - 0.5) * 2;
      
      // Number of cells in the streak
      const streakLength = Math.floor(Math.random() * 8) + 3;
      
      for (let i = 0; i < streakLength; i++) {
        setTimeout(() => {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          
          const gridX = Math.floor(startX / gridSize) * gridSize;
          const gridY = Math.floor(startY / gridSize) * gridSize;
          
          cell.style.left = `${gridX}px`;
          cell.style.top = `${gridY}px`;
          cell.style.opacity = '1';
          cell.style.transform = 'scale(1)';
          cell.style.backgroundColor = `rgba(255, 0, 0, ${0.2 - (i * 0.02)})`;
          
          container.appendChild(cell);
          
          setTimeout(() => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(1.2)';
            setTimeout(() => cell.remove(), 500);
          }, 300);
          
          // Move to next position
          startX += dirX * gridSize;
          startY += dirY * gridSize;
        }, i * 50); // Delay each cell in the streak
      }
    };

    // Start random streak generation
    const streakInterval = setInterval(() => {
      // Create 1-3 streaks at random intervals
      const numStreaks = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numStreaks; i++) {
        setTimeout(createRandomStreak, Math.random() * 500);
      }
    }, 1000); // Create new streaks every second

    const createSpreadEffect = (centerX: number, centerY: number) => {
      const gridSize = 50;
      const spreadRadius = 4;
      const baseDelay = 50;
      const cells: HTMLDivElement[] = [];

      // Create all cells first but keep them invisible
      for (let ring = 0; ring <= spreadRadius; ring++) {
        for (let dx = -ring; dx <= ring; dx++) {
          for (let dy = -ring; dy <= ring; dy++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) === ring) {
              const cell = document.createElement('div');
              cell.className = 'grid-cell';
              
              const gridX = Math.floor(centerX / gridSize) * gridSize + dx * gridSize;
              const gridY = Math.floor(centerY / gridSize) * gridSize + dy * gridSize;
              
              cell.style.left = `${gridX}px`;
              cell.style.top = `${gridY}px`;
              cell.style.opacity = '0';
              cell.style.transform = 'scale(0)';
              
              // Calculate distance from center for intensity
              const distance = Math.sqrt(dx * dx + dy * dy);
              const intensity = Math.max(0.1, 1 - (distance / spreadRadius));
              cell.style.backgroundColor = `rgba(255, 0, 0, ${intensity * 0.4})`;
              
              container.appendChild(cell);
              cells.push(cell);
            }
          }
        }
      }

      // Animate cells from center outward
      cells.forEach((cell, index) => {
        const ring = Math.floor(Math.sqrt(index));
        const delay = ring * baseDelay;

        // Appear animation
        setTimeout(() => {
          cell.style.opacity = '1';
          cell.style.transform = 'scale(1)';
        }, delay);

        // Disappear animation
        setTimeout(() => {
          cell.style.opacity = '0';
          cell.style.transform = 'scale(1.2)';
          setTimeout(() => cell.remove(), 500);
        }, delay + 300);
      });
    };

    const createRipple = (x: number, y: number) => {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      
      // Remove wave color calculation and use static color
      cell.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      
      // Adjust for scroll position and container offset
      const rect = container.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      // Calculate position relative to the grid
      const gridSize = 50;
      const offsetX = rect.left + scrollX;
      const offsetY = rect.top + scrollY;
      const gridX = Math.floor((x - offsetX) / gridSize) * gridSize;
      const gridY = Math.floor((y - offsetY) / gridSize) * gridSize;
      
      cell.style.left = `${gridX}px`;
      cell.style.top = `${gridY}px`;
      cell.style.opacity = '1';
      cell.style.transform = 'scale(1)';
      
      container.appendChild(cell);
      
      setTimeout(() => {
        cell.style.opacity = '0';
        cell.style.transform = 'scale(1.2)';
        setTimeout(() => cell.remove(), 500);
      }, 300);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createSpreadEffect(x, y);
    };

    const updateCursor = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      createRipple(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', updateCursor);
    container.addEventListener('click', handleClick);
    
    return () => {
      clearInterval(streakInterval);
      window.removeEventListener('mousemove', updateCursor);
      container.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="grid-background" style={{ pointerEvents: 'auto' }}/>
      <div ref={cursorRef} className="cursor-trail" />
    </>
  );
};

export default GridBackground;
