/* eslint-disable jsx-a11y/alt-text */
import { currencyIntl } from '@paalan/react-shared/lib';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { FC } from 'react';

import type { InvoiceData } from '../types';
import NotoSans from './NotoSans_Condensed-Medium.ttf';

type Props = {
  invoiceData: InvoiceData;
  tax: number;
  total: number;
  logoUrl: string;
};

Font.register({
  family: 'NotoSans',
  src: NotoSans,
});

const styles = StyleSheet.create({
  page: {
    fontSize: 14,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  spaceBetween: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#3E3E3E',
  },

  titleContainer: { flexDirection: 'row', marginTop: 24 },

  logo: { width: 120 },

  reportTitle: { fontSize: 16, textAlign: 'center' },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'rotate(-45deg) translate(-50%, -50%)',
    fontSize: 80,
    opacity: 0.1,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  overallHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  header: {
    marginBottom: 20,
  },
  section: {
    flex: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontFamily: 'NotoSans',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    padding: 5,
    textAlign: 'center',
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export const InvoicePDF: FC<Props> = ({ invoiceData, tax, total, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* <Text style={styles.watermark}>{invoiceData.gymName}</Text> */}
      <View style={styles.titleContainer}>
        <View style={styles.spaceBetween}>
          <Image style={styles.logo} src={logoUrl} />
          <Text style={styles.reportTitle}>{invoiceData.gymName}</Text>
        </View>
      </View>
      {/* <View style={styles.overallHeader}>
          <Text>{invoiceData.gymName}</Text>
          <Text>{invoiceData.gymAddress}</Text>
          <Text>{invoiceData.gymEmail}</Text>
          <Text>{invoiceData.gymPhone}</Text>
        </View>
        <View style={styles.section}>
          <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
          <Text>Issue Date: {invoiceData.issueDate}</Text>
          <Text>Due Date: {invoiceData.dueDate}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text>Bill To:</Text>
        <Text>{invoiceData.clientName}</Text>
        <Text>{invoiceData.clientAddress}</Text>
        <Text>{invoiceData.clientEmail}</Text>
      </View>
      <View style={styles.section}>
        <Text>Membership Plan:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{invoiceData.membershipPlan.planName}</Text>
            <Text style={styles.tableCol}>
              {currencyIntl.format(invoiceData.membershipPlan.unitPrice)}
            </Text>
          </View>
        </View>
      </View>
      */}
      <View style={styles.section}>
        <View>
          <Text>Total: {currencyIntl.format(invoiceData.subtotal)}</Text>
          <Text>Tax (18%): {currencyIntl.format(tax)}</Text>
          <Text style={styles.total}>Total: {currencyIntl.format(total)}</Text>
        </View>
      </View>
      <View>
        <Text>Thank you for your business!</Text>
        <Text>Please make payment by the due date to {invoiceData.gymName}.</Text>
      </View>
    </Page>
  </Document>
);
