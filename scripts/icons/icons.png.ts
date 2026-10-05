/* eslint-disable no-magic-numbers -- PNG and CRC-32 specification constants */
import { deflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const BIT_DEPTH = 8;
const COLOR_TYPE_RGBA = 6;
const IHDR_LENGTH = 13;
const CRC_POLYNOMIAL = 0xedb88320;

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let crc = n;
  for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? CRC_POLYNOMIAL ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32(value: number): Buffer {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value);
  return buffer;
}

function chunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  return Buffer.concat([uint32(data.length), body, uint32(crc32(body))]);
}

function header(size: number): Buffer {
  const ihdr = Buffer.alloc(IHDR_LENGTH);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([BIT_DEPTH, COLOR_TYPE_RGBA, 0, 0, 0], 8);
  return ihdr;
}

export function encodePng(size: number, scanlines: Buffer): Buffer {
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", header(size)),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
