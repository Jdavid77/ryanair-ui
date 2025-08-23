interface RyanairLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RyanairLogo({ className = '', size = 'md' }: RyanairLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base', 
    lg: 'w-16 h-16 text-xl'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold ${className}`}>
      <span>R</span>
    </div>
  );
}