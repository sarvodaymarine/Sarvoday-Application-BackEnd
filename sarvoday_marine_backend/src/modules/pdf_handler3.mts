// import * as fs from 'fs';
// import PizZip from 'pizzip';
// import Docxtemplater from 'docxtemplater';
// import * as docx from 'docx';

// // Function to replace placeholder in the header
// export async function replaceHeaderPlaceholder(wordFilePath: string, soId: string, outputFilePath: string) {
//   // Read the Word document
//   const content = fs.readFileSync(wordFilePath, 'binary');
//   const zip = new PizZip(content);
//   const doc = new Docxtemplater();
//   doc.loadZip(zip);

//   // Replace placeholder in the header
//   doc.setData({ soId });
//   doc.render();

//   // Save the updated document
//   const updatedContent = doc.getZip().generate({ type: 'nodebuffer' });
//   fs.writeFileSync(outputFilePath, updatedContent);
// }

// // Function to create a new document with images and names in outlined boxes
// export async function createDocumentWithImages(images: { name: string; path: string }[], outputFilePath: string) {
//   const imageWidth = 200; // Width of the image in pixels
//   const imageHeight = 150; // Height of the image in pixels

//   // Create the document
//   const doc = new Document();

//   // Add images and names with outlined boxes
//   const rows: TableRow[] = [];
//   let cells: TableCell[] = [];

//   for (let i = 0; i < images.length; i++) {
//     if (i > 0 && i % 2 === 0) {
//       rows.push(new TableRow({ children: cells }));
//       cells = [];
//     }

//     const image = Media.addImage(doc, fs.readFileSync(images[i].path), imageWidth, imageHeight);
//     cells.push(
//       new TableCell({
//         children: [
//           new Paragraph({
//             children: [image],
//             border: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE } },
//           }),
//           new Paragraph({
//             children: [new TextRun(images[i].name)],
//             border: { bottom: { style: BorderStyle.SINGLE } },
//           }),
//         ],
//         borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE } },
//       }),
//     );

//     if (i === images.length - 1) {
//       rows.push(new TableRow({ children: cells }));
//     }
//   }

//   doc.addSection({
//     children: [
//       new Table({
//         rows,
//         width: {
//           size: 100,
//           type: 'pct',
//         },
//       }),
//     ],
//   });

//   // Save the document
//   const buffer = await Packer.toBuffer(doc);
//   fs.writeFileSync(outputFilePath, buffer);
// }

// // // Example usage
// // const wordFilePath = path.join(__dirname, 'template.docx');
// // const updatedFilePath = path.join(__dirname, 'updated.docx');
// // const soId = '12345';

// // const images = [
// //   { name: 'imageName1', path: path.join(__dirname, 'image1.png') },
// //   { name: 'imageName2', path: path.join(__dirname, 'image2.png') },
// //   { name: 'imageName3', path: path.join(__dirname, 'image3.png') },
// //   { name: 'imageName4', path: path.join(__dirname, 'image4.png') },
// //   // Add up to 8 images with names
// // ];

// // replaceHeaderPlaceholder(wordFilePath, soId, updatedFilePath)
// //   .then(() => createDocumentWithImages(images, path.join(__dirname, 'final.docx')))
// //   .catch((error) => console.error('Error:', error));
