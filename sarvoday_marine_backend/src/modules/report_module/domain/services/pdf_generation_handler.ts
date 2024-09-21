/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export interface TemplateData {
  sarvoday_marine_logo: string;
  orderId: string;
  reportDate: string;
  customerName: string;
  customerAddress: string;
  portLocation: string;
  orderDate: string;
  productName: string;
  containerSize: string;
  containerNo: string;
  netWeight: string;
  typeOfBaggage: string;
  noOfPkg: string;
  baggageName: string;
  maxGrossWeight: string;
  tareWeight: string;
  backGround: string;
  packing: string;
  survey: string;
  batchNo: string;
  lineSealNo: string;
  customSealNo: string;
  conclusion: string;
  company_signed_stamp: string;
  images: { url: string; name: string }[];
}

export class ReportGenerator {
  private outputPDFPath: string;
  private data: TemplateData;

  constructor(outputPDFPath: string, data: TemplateData) {
    this.outputPDFPath = outputPDFPath;
    this.data = data;
  }

  private populateTemplate(html: string): string {
    return html.replace(/{{(\w+)}}/g, (match, key) => {
      return (this.data as any)[key] || '';
    });
  }

  // Method to populate the image section of the template
  private populateImageTemplate(html: string, images: { url: string; name: string }[]): string {
    let populatedHtml = html.replace(/{{sarvoday_marine_logo}}/g, this.data.sarvoday_marine_logo);
    populatedHtml = populatedHtml.replace(/{{orderId}}/g, this.data.orderId);
    populatedHtml = populatedHtml.replace(/{{reportDate}}/g, this.data.reportDate);
    populatedHtml = populatedHtml.replace(/{{containerNo}}/g, this.data.containerNo);
    let imageGridHtml = '';
    images.forEach((image, index) => {
      if (image.url) {
        imageGridHtml += `
      <tr class="table-row">
        <td>
          <img width="350px" height="250px" src="${image.url}" />
        </td>
        <td>
          ${index + 1 < images.length ? `<img width="350px" height="250px" src="${images[index + 1].url}" />` : ''}
        </td>
      </tr>
      <tr>
        <td>${image.name}</td>
        ${index + 1 < images.length ? `<td>${images[index + 1].name}</td>` : ''}
      </tr>`;
      }
    });
    return populatedHtml.replace(/{{imageGrid}}/g, imageGridHtml);
  }

  public async generatePDF(): Promise<void> {
    const browser = await puppeteer.launch({
      headless: false,
      pipe: true,
      args: ['--headless', '--disable-gpu', '--no-sandbox'],
    });
    const page = await browser.newPage();

    const template1Html = this.loadAndPopulateTemplate('report_page1.html');
    const template2Html = this.loadAndPopulateTemplate('report_page2.html');
    const template3Html = this.loadAndPopulateTemplate('report_page3.html');
    const template4Html = this.loadTemplate('report_image_page.html');

    const imagesPerPage = 6;
    const totalImages = this.data.images.length;
    const pages: string[] = [];

    for (let i = 0; i < totalImages; i += imagesPerPage) {
      const imageGroup = this.data.images.slice(i, i + imagesPerPage);
      const pageHtml = this.populateImageTemplate(template4Html, imageGroup);
      pages.push(pageHtml);
    }

    const combinedHtml = `
      <html>
        <body>
          ${template1Html}
          <div style="page-break-before: always;"></div> <!-- Page break before second template -->
          ${template2Html}
          <div style="page-break-before: always;"></div> <!-- Page break before third template -->
          ${template3Html}
          <div style="page-break-before: always;"></div> <!-- Page break before image pages -->
          ${pages.map((page, index) => `<div style="page-break-before: ${index === 0 ? 'auto' : 'always'};">${page}</div>`).join('')}
        </body>
      </html>
    `;

    await page.setViewport({
      width: 210 * 3.78,
      height: 297 * 3.78,
      deviceScaleFactor: 1,
    });
    await page.setContent(combinedHtml, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: this.outputPDFPath,
      format: 'A4',
      printBackground: true,
      scale: 1,
      margin: {
        top: '0cm',
        right: '0cm',
        bottom: '0cm',
        left: '0cm',
      },
    });

    await browser.close();
  }

  private loadAndPopulateTemplate(templateName: string): string {
    const templatePath = path.join(process.cwd(), 'src', 'templates', templateName);
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    return this.populateTemplate(templateHtml);
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(process.cwd(), 'src', 'templates', templateName);
    return fs.readFileSync(templatePath, 'utf8');
  }
}
