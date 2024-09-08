// import * as fs from 'fs';
// import PizZip from 'pizzip';
// import Docxtemplater from 'docxtemplater';

// // Function to replace placeholders in a Word document
// export async function replacePlaceholders(
//   wordFilePath: string,
//   placeholders: { [key: string]: string },
//   outputFilePath: string,
// ) {
//   // Read the Word document
//   const content = fs.readFileSync(wordFilePath, 'binary');
//   const zip = new PizZip(content);
//   const doc = new Docxtemplater();
//   doc.loadZip(zip);

//   // Set the placeholders values
//   doc.setData(placeholders);

//   try {
//     // Render the document
//     doc.render();

//     // Get the updated document
//     const updatedContent = doc.getZip().generate({ type: 'nodebuffer' });

//     // Write the updated document to a file
//     fs.writeFileSync(outputFilePath, updatedContent);

//     console.log('Document updated successfully!');
//   } catch (error) {
//     console.error('Error processing the document:', error);
//   }
// }

// // // Example usage
// // const wordFilePath = path.join(__dirname, 'template.docx');
// // const outputFilePath = path.join(__dirname, 'output.docx');
// // const placeholders = {
// //   'PLACEHOLDER_1': 'Actual Value 1',
// //   'PLACEHOLDER_2': 'Actual Value 2\nMultiline Value',
// // };

// // replacePlaceholders(wordFilePath, placeholders, outputFilePath);
