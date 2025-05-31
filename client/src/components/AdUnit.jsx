import { useEffect } from 'react';

export default function AdUnit({ slot, format = 'auto', className = '' }) {
  useEffect(() => {
    try {
      // AdSense 스크립트가 로드되었는지 확인
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading AdSense:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8107190228703220"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 