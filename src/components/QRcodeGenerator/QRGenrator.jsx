import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import './qrgenerator.css';
import logo from './../../assets/logo1.png'
import jsPDF from 'jspdf';

const QRCodeGenerator = ({ deviceId }) => {
  const qrCodeValue = `Device ID: ${deviceId}`;
  const qrCodeRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    const imageData = canvas.toDataURL('image/png');

    const doc = new jsPDF();

    doc.setFontSize(14).setFont('helvetica', 'bold');

    const qrCodeWidth = 80;
    const qrCodeHeight = 80;
    const qrCodeX = (doc.internal.pageSize.width - qrCodeWidth) / 2;
    const qrCodeY = 50;

    doc.addImage(imageData, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

    const deviceIdX = (doc.internal.pageSize.width / 2);
    const deviceIdY = 150;
    doc.text(`Device ID: ${deviceId}`, deviceIdX, deviceIdY, {align: 'center'});
    
    const text1 = `This QR Code is used for Automatic food dispenser for chickens.  `;
    const text2 = `Use this to Sign up to our Mobile App.`;
    const text3 = `Thanks for choosing Automatic chicken feeder `;
    
    
    const textX = (doc.internal.pageSize.width / 2);

    const textY = 170;
    const textY1 = 180;
    const textY2 = 210;

    doc.text(text1, textX, textY, {align: 'center'});
    doc.text(text2, textX, textY1, {align: 'center'});
    doc.text(text3, textX, textY2, {align: 'center'});

    const logoWidth = 50;
    const logoHeight = 50;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
    const logoY = 220;

    doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);    

    // Download the PDF document
    doc.save(`${deviceId}qrcode.pdf`);
  };

  return (
    <div className="qrcode-generator-container">
      <div className="qrcode-wrapper" ref={qrCodeRef}>
        <QRCode value={qrCodeValue} />
      </div>
      <button className="qrcode-download-btn" onClick={downloadQRCode}>
        Download QR Code as PDF
      </button>
    </div>
  );
};

export default QRCodeGenerator;