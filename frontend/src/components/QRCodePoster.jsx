import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

const QRCodePoster = ({ url, title = "आपका संदेश सिंधिया तक", subtitle = "Digital Grievance Portal" }) => {
  const downloadQR = () => {
    const canvas = document.getElementById("qr-poster-canvas");
    if (!canvas) return;
    
    // Create a high-res image by drawing the component to a canvas if needed, 
    // but for now we can just download the QR canvas itself or the whole div.
    // For a "Poster" feel, we can just download the QR.
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "Grievance_QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-poster-container">
      <div className="qr-poster-paper animate-fade" id="printable-poster">
        <div className="poster-header">
          <img src="/logo.png" alt="BJP Logo" className="poster-logo" />
          <div className="poster-titles">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
        
        <div className="poster-body">
          <div className="qr-wrapper-outer">
            <div className="qr-wrapper-inner">
              <QRCodeCanvas 
                id="qr-poster-canvas"
                value={url} 
                size={220}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                  src: "/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
          </div>
          <div className="poster-instructions">
            <h3>स्कैन करें और अपनी समस्या दर्ज करें</h3>
            <p>Scan this QR code to directly access the Digital Grievance Form</p>
          </div>
        </div>

        <div className="poster-footer">
          <div className="minister-name">Hon'ble Union Minister Shri Jyotiraditya M Scindia</div>
          <div className="office-tag">Minister's Office Digital Initiative</div>
        </div>
      </div>

      <div className="poster-actions no-print">
        <button onClick={downloadQR} className="btn-primary">
          <Download size={18} /> Download QR Image
        </button>
        <button onClick={handlePrint} className="btn-secondary">
          <Printer size={18} /> Print Poster
        </button>
      </div>

      <style jsx>{`
        .qr-poster-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }
        .qr-poster-paper {
          background: white;
          width: 100%;
          max-width: 450px;
          padding: 3rem 2rem;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
          border: 8px solid #FFF5EB;
          position: relative;
          text-align: center;
        }
        .poster-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .poster-logo {
          width: 60px;
          height: auto;
        }
        .poster-titles h1 {
          font-size: 1.8rem;
          color: #1E293B;
          margin: 0;
          font-weight: 800;
        }
        .poster-titles p {
          font-size: 0.9rem;
          color: #FF9933;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .qr-wrapper-outer {
          padding: 1.5rem;
          background: #F8FAFC;
          border-radius: 24px;
          display: inline-block;
          margin-bottom: 2rem;
          border: 2px solid #E2E8F0;
        }
        .qr-wrapper-inner {
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
        }
        .poster-instructions h3 {
          font-size: 1.2rem;
          color: #1E293B;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }
        .poster-instructions p {
          font-size: 0.85rem;
          color: #64748B;
          font-weight: 500;
        }
        .poster-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px dashed #E2E8F0;
        }
        .minister-name {
          font-weight: 800;
          color: #1E293B;
          font-size: 1rem;
        }
        .office-tag {
          font-size: 0.75rem;
          color: #FF9933;
          font-weight: 700;
          margin-top: 0.25rem;
        }
        .poster-actions {
          display: flex;
          gap: 1rem;
        }
        @media print {
          .no-print { display: none; }
          body * { visibility: hidden; }
          #printable-poster, #printable-poster * { visibility: visible; }
          #printable-poster {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
    </div>
  );
};

export default QRCodePoster;
