// import * as fs from 'fs';
// import * as path from 'path';
// import * as handlebars from 'handlebars';
// import * as pdf from 'html-pdf';
// import { TemplateData } from './pdf_generation_handler';

// // Function to generate the HTML with dynamic data
// const generatedHtml = (data: TemplateData): string => {
//   const templatePath = path.join(__dirname, 'report1.html');
//   const templateFile = fs.readFileSync(templatePath, 'utf8');

//   const compiledTemplate = handlebars.compile(templateFile);
//   return compiledTemplate(data);
// };

// // Function to generate PDF from HTML
// export const generatePdf = (data: TemplateData, outputFilePath: string) => {
//   const pdfOptions = {
//     format: 'A4',
//     orientation: 'portrait',
//   };
//   const html = generatedHtml(data);

//   pdf.create(html, pdfOptions).toFile(outputFilePath, (err, res) => {
//     if (err) {
//       console.error('Error generating PDF:', err);
//       return;
//     }
//     console.log('PDF generated successfully:', res.filename);
//   });
// };
