import path from 'path';
import puppeteer from 'puppeteer';
import fs from 'fs';
import os from 'os';

export class PDFGenerator {
  async generateReportPDF() {
    try {
      // Launch a new Puppeteer browser instance
      const browser = await puppeteer.launch();
      // Create a new page within the browser
      const page = await browser.newPage();

      // Define the path to the Handlebars template file
      // const templatePath = path.join(__dirname, '..', '..', '..', 'shared', 'utils', 'report_pdf_template.html');

      // Read the contents of the Handlebars template file
      const templateSource = fs.readFileSync(
        `C:\\Users\\Arpit\\OneDrive\\Desktop\\sarvoday_marine_backend\\Sarvoday-Application-BackEnd\\sarvoday_marine_backend\\src\\shared\\utils\\report_pdf_template.html`,
        'utf-8',
      );

      // If using Handlebars, compile the template here
      // const template = Handlebars.compile(templateSource);

      // Mock data for rendering (replace this with actual data)
      // const renderedData = {
      //   title: 'Sample Report',
      //   content: 'This is a sample report generated using Puppeteer and Handlebars.'
      // };

      // Render the template with the calculated data
      // const compiledHtml = template(renderedData);

      // Set the HTML content of the Puppeteer page
      await page.setContent(/*compiledHtml*/ templateSource, { waitUntil: 'networkidle0' });

      // Generate a PDF buffer from the page content
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
      });

      // Close the Puppeteer browser
      await browser.close();

      // Log the PDF buffer for debugging (optional)
      console.log('PDF Buffer generated successfully.');

      // Get the system temporary directory
      const tempDir = os.tmpdir();

      // Create a unique filename for the temp PDF file
      const tempFilePath = path.join(tempDir, `temp_report_${Date.now()}.pdf`);

      // Write the PDF buffer to the temp file
      fs.writeFile(tempFilePath, pdfBuffer, (err) => {
        if (err) {
          console.error('Error writing to temp file:', err);
        } else {
          console.log(`PDF successfully written to temporary file: ${tempFilePath}`);
          // You can now use tempFilePath to reference the stored PDF
        }
      });

      // Optionally, handle file cleanup after use
      // fs.unlink(tempFilePath, (err) => {
      //   if (err) {
      //     console.error('Error deleting temp file:', err);
      //   } else {
      //     console.log('Temporary file deleted successfully.');
      //   }
      // });
    } catch (error) {
      // If an error occurs, log the error
      console.error('An error occurred:', error);
    }
  }
}

// Example usage:
const pdfGenerator = new PDFGenerator();
pdfGenerator.generateReportPDF();
