import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';
import { PDFGenerator } from './modules/report_module/domain/services/pdf_generation_handler';

async function convertWordToHtml(filePath: string): Promise<string> {
  try {
    const buffer = fs.readFileSync(filePath);

    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error converting Word to HTML:', error);
    throw error;
  }
}

async function writeHtmlToFile(htmlContent: string, outputFilePath: string): Promise<void> {
  try {
    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
    console.log(`HTML content has been written to ${outputFilePath}`);
  } catch (error) {
    console.error('Error writing HTML to file:', error);
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function main() {
  // const filePath = 'C:\\Users\\Arpit\\Downloads\\PALLETIZED_HDPE_DRUM.docx';
  // const outputFilePath = path.join(__dirname, 'output.html');

  // try {
  //   const htmlContent = await convertWordToHtml(filePath);
  //   await writeHtmlToFile(htmlContent, outputFilePath);
  // } catch (error) {
  //   console.error('Failed to process document:', error);
  // }
  await new PDFGenerator().generateReportPDF();
}

main();
