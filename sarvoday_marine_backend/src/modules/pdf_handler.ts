// import fs from 'fs';
// import pdfkit from 'pdfkit';
// import mammoth from 'mammoth';
// // import { Document, Packer, Paragraph, TextRun, Media, Header, Section, PageBreak } from 'docx';

// // Function to replace placeholders in a Word document
// export async function replacePlaceholders(
//   docPath: string,
//   replacements: { [key: string]: string },
//   outputPath: string,
// ) {
//   const buffer = fs.readFileSync(docPath);

//   // Read the DOCX document using mammoth
//   const { value: html } = await mammoth.convertToHtml({ buffer });

//   // Replace placeholders in the HTML content
//   let updatedHtml = html;
//   for (const [key, value] of Object.entries(replacements)) {
//     const regex = new RegExp(key, 'g');
//     updatedHtml = updatedHtml.replace(regex, value);
//   }

//   // Save the updated HTML to a new DOCX file
//   fs.writeFileSync(outputPath, updatedHtml);
//   console.log(`Placeholders replaced and saved to ${outputPath}`);
// }

// // Function to create a DOCX file with updated header and images
// export async function createDocWithImages(images: { path: string; name: string }[], soid: string, outputPath: string) {
//   // Create a new document with header
//   const doc = new Document({
//     sections: [
//       {
//         properties: {},
//         headers: {
//           default: new Header({
//             children: [
//               new Paragraph({
//                 children: [new TextRun({ text: `SOID: ${soid}`, bold: true })],
//               }),
//             ],
//           }),
//         },
//         children: images.reduce<Paragraph[]>((acc, image, index) => {
//           const imageBuffer = fs.readFileSync(image.path);
//           const docImage = Media.addImage(imageBuffer);

//           acc.push(
//             new Paragraph({
//               children: [docImage, new TextRun({ text: image.name, break: 1 })],
//             }),
//           );

//           // Add a new page for every 8 images
//           if ((index + 1) % 8 === 0 && index !== images.length - 1) {
//             acc.push(new PageBreak());
//           }

//           return acc;
//         }, []),
//       },
//     ],
//   });

//   const buffer = await Packer.toBuffer(doc);
//   fs.writeFileSync(outputPath, buffer);
//   console.log(`Document with images and header saved to ${outputPath}`);
// }

// // Example usage
// // const images = [
// //   { path: 'path/to/image1.png', name: 'Image 1' },
// //   { path: 'path/to/image2.png', name: 'Image 2' },
// //   // Add more images as needed
// // ];

// // createDocWithImages(images, 'SO123456', 'path/to/updated-images.docx').catch(console.error);

// // Function to convert DOCX to PDF
// async function convertDocxToPdf(docxPath: string, pdfPath: string) {
//   // Convert DOCX to HTML using mammoth
//   const { value: html } = await mammoth.convertToHtml({ path: docxPath });

//   // Create a PDF with pdfkit
//   const doc = new pdfkit();
//   doc.pipe(fs.createWriteStream(pdfPath));

//   // Add content to PDF from HTML (very simplistic approach)
//   doc.text(html); // This needs to be parsed properly for real HTML

//   doc.end();
//   console.log(`PDF saved to ${pdfPath}`);
// }

// // Example usage
// const combinedDocxPath = 'path/to/combined.docx';
// const outputPdfPath = 'path/to/output.pdf';

// convertDocxToPdf(combinedDocxPath, outputPdfPath).catch(console.error);

// // // Example usage
// // const images = [
// //   { path: 'path/to/image1.png', name: 'Image 1' },
// //   { path: 'path/to/image2.png', name: 'Image 2' },
// //   // Add more images as needed
// // ];

// // addImagesToDocx('path/to/empty-page.docx', images, 'SO123456', 'path/to/updated-images.docx').catch(console.error);

// // // Example usage
// // const replacements = {
// //   '$NAME': 'Jane Doe',
// //   '$DATE': '2024-08-31',
// //   '$ADDRESS': '123 Main St,\nCityville,\nCountryland',
// // };

// // replacePlaceholders('path/to/report.docx', replacements, 'path/to/updated-report.docx').catch(console.error);
