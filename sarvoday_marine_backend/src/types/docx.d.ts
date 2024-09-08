// /* eslint-disable @typescript-eslint/no-explicit-any */
// // custom-docx.d.ts
// declare module 'docx' {
//   export class Document {
//     constructor(options?: any);
//     // Define necessary properties and methods as per docx source or docs
//   }

//   export class Packer {
//     static toBuffer(doc: Document): Promise<Buffer>;
//     // Other static methods if any
//   }

//   export class Paragraph {
//     constructor(options?: any);
//     // Add properties or methods used commonly
//   }

//   export class TextRun {
//     constructor(text: string | { text: string });
//     // Methods and properties
//   }

//   export class Media {
//     static addImage(doc: Document, image: Buffer | string | Uint8Array, options?: any): any; // Define based on actual usage
//     // Add other methods like addMedia, addVideo if they exist
//   }

//   export class Table {
//     constructor(options?: any);
//     // Define other methods and properties
//   }

//   export class TableCell {
//     constructor(options?: any);
//     // Methods and properties
//   }

//   export class TableRow {
//     constructor(options?: any);
//     // Methods and properties
//   }

//   export enum BorderStyle {
//     NONE,
//     SINGLE,
//     // Add other styles according to actual values
//   }
// }
