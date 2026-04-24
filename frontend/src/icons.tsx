export interface IconProps {
  name: 'check' | 'x' | 'sparkle' | 'refresh' | 'lock' | 'back';
  size?: number;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 16, style }: IconProps) {
  const viewBox = '0 0 24 24';

  const icons: Record<string, string> = {
    check: '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    x: '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    sparkle: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>',
    refresh: '<path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64M3.51 15A9 9 0 0 0 18.36 18.36" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      style={{ display: 'inline-block', ...style }}
      dangerouslySetInnerHTML={{ __html: icons[name] || '' }}
    />
  );
}
