import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export default function QRPage() {
  const { type, id } = useParams(); // type can be profile, link, resume
  const { addToast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
  const qrUrl = `${API_BASE_URL}/qr/${type}/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    addToast('Link copied to clipboard', 'success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My SmartLink Hub QR Code',
          url: qrUrl
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="pt-8 pb-8 flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
          <p className="text-sm text-gray-500 mb-8">Point your camera at the QR code to view</p>
          
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 inline-block">
            <img 
              src={qrUrl} 
              alt={`QR Code for ${type}`}
              className="w-48 h-48 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200?text=QR+Error';
              }}
            />
          </div>

          <div className="flex justify-center gap-3 w-full">
            <Button variant="secondary" onClick={handleShare} className="flex-1" title="Share">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" onClick={handleCopyLink} className="flex-1" title="Copy">
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrUrl;
                link.download = `qrcode-${type}-${id}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
