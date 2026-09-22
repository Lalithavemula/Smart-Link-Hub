import React, { useRef } from 'react';
import { useProfile } from '../hooks/useProfile';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Share2, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardQR() {
  const { profile } = useProfile();
  const qrRef = useRef();

  const profileUrl = `${window.location.origin}/u/${profile?.username}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${profile?.username}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code downloaded!');
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.username}'s SmartLink Profile`,
          url: profileUrl,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard');
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary-500" />
          QR Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Download and share your SmartLink QR code.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Code Display */}
        <Card className="dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center py-12">
          <CardContent className="flex flex-col items-center text-center space-y-6">
            <div 
              ref={qrRef} 
              className="p-6 bg-white rounded-3xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] border border-gray-100 dark:border-gray-800"
            >
              <QRCodeCanvas 
                value={profileUrl} 
                size={220} 
                bgColor={"#ffffff"}
                fgColor={"#0f172a"}
                level={"Q"}
                includeMargin={false}
              />
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">@{profile.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs break-all">
                {profileUrl}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-6 flex flex-col justify-center">
          <Card className="dark:bg-gray-900 dark:border-gray-800 hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Share Everywhere</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Print this QR code on business cards, flyers, or display it at your desk so people can connect with you instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={downloadQR} className="flex-1 py-3 text-base rounded-xl gap-2 font-semibold bg-primary-600 hover:bg-primary-700 text-white">
                  <Download className="w-5 h-5" /> Download PNG
                </Button>
                <Button onClick={shareProfile} variant="secondary" className="flex-1 py-3 text-base rounded-xl gap-2 font-semibold">
                  <Share2 className="w-5 h-5" /> Share Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
