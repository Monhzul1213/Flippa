import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import './styles.css';

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState({
    customer: '',
    company: '',
    date: '',
    items: [{ description: '', qty: 1, price: 0 }]
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', qty: 1, price: 0 }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    setInvoice({ ...invoice, items: newItems });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice", 14, 20);
    doc.text(`Customer: ${invoice.customer}`, 14, 30);
    doc.text(`Company: ${invoice.company}`, 14, 40);
    doc.text(`Date: ${invoice.date}`, 14, 50);

    const rows = invoice.items.map(item => [
      item.description,
      item.qty,
      item.price,
      item.qty * item.price
    ]);

    autoTable(doc, { // autoTable-г doc дотор ийнхүү ашиглана
      head: [['Description', 'Qty', 'Price', 'Total']],
      body: rows,
      startY: 60
    });
    

    doc.save('invoice.pdf');
  };

  return (
    <div className="wrapper">
      <div className="hero">
        <h1>Simple & Free Invoice Generator</h1>
        <p>Create and download invoices in just a few clicks!</p>
        <a href="#generator" className="btn-primary">Get Started</a>
      </div>

      <section id="generator" className="container">
        <h2>Invoice Generator</h2>

        <div className="form-group">
          <input className="input-field" type="text" placeholder="Customer Name" value={invoice.customer} onChange={e => setInvoice({ ...invoice, customer: e.target.value })} />
          <input className="input-field" type="text" placeholder="Company Name" value={invoice.company} onChange={e => setInvoice({ ...invoice, company: e.target.value })} />
          <input className="input-field" type="date" value={invoice.date} onChange={e => setInvoice({ ...invoice, date: e.target.value })} />
        </div>

        {invoice.items.map((item, index) => (
          <div key={index} className="item-row">
            <input className="input-field" type="text" placeholder="Item Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
            <input className="input-field" type="number" placeholder="Qty" min="1" value={item.qty} onChange={e => handleItemChange(index, 'qty', Math.max(1, Number(e.target.value)))} />
            <input className="input-field" type="number" placeholder="Price" min="0" value={item.price} onChange={e => handleItemChange(index, 'price', Math.max(0, Number(e.target.value)))} />
            <p className="total-text">Total: ${item.qty * item.price}</p>
          </div>
        ))}

        <div className="button-group">
          <button className="btn btn-add" onClick={addItem}>+ Add Item</button>
          <button className="btn btn-download" onClick={generatePDF}>Download PDF</button>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Invoice Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}