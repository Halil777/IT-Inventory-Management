const textEncoder = new TextEncoder();

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let j = 0; j < 8; j += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

const crc32 = (data: Uint8Array): number => {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    const byte = data[i];
    crc = (crc >>> 8) ^ crc32Table[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const encodeString = (value: string): Uint8Array => textEncoder.encode(value);

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

const createZip = (entries: ZipEntry[]): Uint8Array => {
  const fileRecords: {
    nameBytes: Uint8Array;
    data: Uint8Array;
    crc: number;
    offset: number;
  }[] = [];

  let offset = 0;
  const chunks: Uint8Array[] = [];

  entries.forEach((entry) => {
    const nameBytes = encodeString(entry.name);
    const data = entry.data;
    const crc = crc32(data);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const headerView = new DataView(localHeader.buffer);
    headerView.setUint32(0, 0x04034b50, true);
    headerView.setUint16(4, 20, true);
    headerView.setUint16(6, 0, true);
    headerView.setUint16(8, 0, true);
    headerView.setUint16(10, 0, true);
    headerView.setUint16(12, 0, true);
    headerView.setUint32(14, crc, true);
    headerView.setUint32(18, data.length, true);
    headerView.setUint32(22, data.length, true);
    headerView.setUint16(26, nameBytes.length, true);
    headerView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    chunks.push(localHeader, data);

    fileRecords.push({ nameBytes, data, crc, offset });
    offset += localHeader.length + data.length;
  });

  const centralDirectoryChunks: Uint8Array[] = [];
  let centralDirectorySize = 0;

  fileRecords.forEach((record) => {
    const centralHeader = new Uint8Array(46 + record.nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, 0, true);
    centralView.setUint32(16, record.crc, true);
    centralView.setUint32(20, record.data.length, true);
    centralView.setUint32(24, record.data.length, true);
    centralView.setUint16(28, record.nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, record.offset, true);
    centralHeader.set(record.nameBytes, 46);

    centralDirectoryChunks.push(centralHeader);
    centralDirectorySize += centralHeader.length;
  });

  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, fileRecords.length, true);
  endView.setUint16(10, fileRecords.length, true);
  endView.setUint32(12, centralDirectorySize, true);
  endView.setUint32(16, offset, true);
  endView.setUint16(20, 0, true);

  const totalSize = offset + centralDirectorySize + endRecord.length;
  const zip = new Uint8Array(totalSize);
  let position = 0;

  chunks.forEach((chunk) => {
    zip.set(chunk, position);
    position += chunk.length;
  });

  centralDirectoryChunks.forEach((chunk) => {
    zip.set(chunk, position);
    position += chunk.length;
  });

  zip.set(endRecord, position);

  return zip;
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const columnIndexToLetter = (index: number): string => {
  let value = index;
  let columnName = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    value = Math.floor((value - 1) / 26);
  }
  return columnName;
};

const createSheetXml = (headers: string[], rows: string[][]): string => {
  const totalRows = rows.length + 1;
  const totalColumns = headers.length;
  const lastCellRef = `${columnIndexToLetter(totalColumns)}${totalRows}`;
  const headerRowCells = headers
    .map((header, index) => {
      const cellRef = `${columnIndexToLetter(index + 1)}1`;
      return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(header)}</t></is></c>`;
    })
    .join('');

  const dataRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const cellRef = `${columnIndexToLetter(columnIndex + 1)}${rowIndex + 2}`;
          return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
        })
        .join('');
      return `<row r="${rowIndex + 2}">${cells}</row>`;
    })
    .join('');

  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<dimension ref="A1:${lastCellRef}"/>` +
    '<sheetData>' +
    `<row r="1">${headerRowCells}</row>` +
    dataRows +
    '</sheetData>' +
    '</worksheet>'
  );
};

const defaultStylesXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
  '<fonts count="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font></fonts>' +
  '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
  '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
  '</styleSheet>';

const workbookXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
  '<sheets>' +
  '<sheet name="Data" sheetId="1" r:id="rId1"/>' +
  '</sheets>' +
  '</workbook>';

const workbookRelsXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
  '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
  '</Relationships>';

const rootRelsXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
  '</Relationships>';

const contentTypesXml =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
  '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
  '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
  '</Types>';

export interface ExportColumn {
  header: string;
  key: string;
}

export const createXlsxFile = (rows: Record<string, unknown>[], columns: ExportColumn[]): Uint8Array => {
  const headerLabels = columns.map((column) => column.header);
  const normalizedRows = rows.map((row) =>
    columns.map((column) => {
      const value = row[column.key];
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
    }),
  );

  const sheetXml = createSheetXml(headerLabels, normalizedRows);

  const files: ZipEntry[] = [
    { name: '[Content_Types].xml', data: encodeString(contentTypesXml) },
    { name: '_rels/.rels', data: encodeString(rootRelsXml) },
    { name: 'xl/workbook.xml', data: encodeString(workbookXml) },
    { name: 'xl/_rels/workbook.xml.rels', data: encodeString(workbookRelsXml) },
    { name: 'xl/styles.xml', data: encodeString(defaultStylesXml) },
    { name: 'xl/worksheets/sheet1.xml', data: encodeString(sheetXml) },
  ];

  return createZip(files);
};

export const downloadXlsx = (data: Uint8Array, fileName: string) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportRowsToXlsx = (
  rows: Record<string, unknown>[],
  columns: ExportColumn[],
  fileName: string,
) => {
  const workbook = createXlsxFile(rows, columns);
  downloadXlsx(workbook, fileName);
};
