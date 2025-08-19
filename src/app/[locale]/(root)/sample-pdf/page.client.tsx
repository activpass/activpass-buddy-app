'use client';

import { toast } from '@paalan/react-ui';
import { PDFViewer } from '@react-pdf/renderer/lib/react-pdf.browser';
import { type FC, useEffect, useState } from 'react';

import { convertImageToBase64 } from '@/utils/client';
import { getBaseUrl } from '@/utils/helpers';

import Invoice from './Invoice';

export const ClientPage: FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    convertImageToBase64(`${getBaseUrl()}/logos/png/activpass-buddy-logo-black-blue.png`)
      .then(url => setLogoUrl(url))
      .catch(err => {
        toast.error(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Testing PDF</h1>
      {logoUrl && (
        <PDFViewer showToolbar={false} className="h-128 w-full border-0">
          <Invoice logoUrl={logoUrl} />
        </PDFViewer>
      )}
    </div>
  );
};
