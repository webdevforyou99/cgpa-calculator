import React, { useEffect, useRef, useState } from 'react';
import { monetagConfig, type MonetagPlacementConfig } from '../config/monetag';
import { loadMonetagScript } from '../utils/monetag';

export const MonetagHeadScripts: React.FC = () => {
  useEffect(() => {
    if (!monetagConfig.enabled) return;

    monetagConfig.headScripts.forEach((script) => {
      if (script.location !== 'head') return;
      loadMonetagScript(script).catch((error) => {
        console.warn('[GradeFlow] Monetag head script was not loaded.', error);
      });
    });
  }, []);

  return null;
};

interface MonetagPlacementProps {
  placement: MonetagPlacementConfig;
  name: string;
  className?: string;
}

export const MonetagPlacement: React.FC<MonetagPlacementProps> = ({
  placement,
  name,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const active = monetagConfig.enabled && placement.enabled && placement.script !== null;

  useEffect(() => {
    if (!active || !placement.script || !containerRef.current) return;
    if (placement.script.location !== 'placement') return;

    loadMonetagScript(placement.script, containerRef.current).catch((error) => {
      console.warn(`[GradeFlow] Monetag placement "${name}" was not loaded.`, error);
      setFailed(true);
    });
  }, [active, name, placement.script]);

  if (!active || failed) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`monetag-placement print:hidden w-full overflow-hidden ${className}`}
      style={{ minHeight: placement.minHeight || undefined }}
    >
      <div
        ref={containerRef}
        data-monetag-placement={name}
        className="mx-auto flex max-w-full items-center justify-center overflow-hidden"
      />
    </aside>
  );
};
