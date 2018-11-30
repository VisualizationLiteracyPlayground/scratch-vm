const {Adler32} = require('./adler32');
const {Uint32BE} = require('./byte-primitives');
const {ByteStream} = require('./byte-stream');
const {CRC32} = require('./crc32');
const {DEFLATE_BLOCK_SIZE_MAX, DeflateHeader, DeflateChunkStart, DeflateEnd} = require('./deflate-blocks');
const {PNGSignature, PNGChunkStart, PNGChunkEnd, PNGIHDRChunkBody, PNGFilterMethodByte} = require('./png-blocks');
const {DeflateStream} = require('./deflate-stream');
const {PNGChunkStream} = require('./png-chunk-stream');

class PNGFile {
    encode (width, height, pixelsUint8) {
        const rowSize = width * 4 + PNGFilterMethodByte.prototype.size;
        const bodySize = rowSize * height;
        let bodyRemaining = bodySize;
        const blocks = Math.ceil(bodySize / DEFLATE_BLOCK_SIZE_MAX);
        const idatSize = (
            DeflateHeader.prototype.size +
            blocks * DeflateChunkStart.prototype.size +
            DeflateEnd.prototype.size +
            bodySize
        );
        const size = (
            PNGSignature.prototype.size +
            // IHDR
            PNGChunkStart.prototype.size +
            PNGIHDRChunkBody.prototype.size +
            PNGChunkEnd.prototype.size +
            // IDAT
            PNGChunkStart.prototype.size +
            idatSize +
            PNGChunkEnd.prototype.size +
            // IEND
            PNGChunkStart.prototype.size +
            PNGChunkEnd.prototype.size
        );

        const stream = new ByteStream(new ArrayBuffer(size));

        stream.writeStruct(PNGSignature, {
            support8Bit: 0x89,
            png: 'PNG',
            dosLineEnding: '\r\n',
            dosEndOfFile: '\x1a',
            unixLineEnding: '\n'
        });

        const pngIhdr = new PNGChunkStream(stream, 'IHDR');

        pngIhdr.writeStruct(PNGIHDRChunkBody, {
            width,
            height,
            bitDepth: 8,
            colorType: 6,
            compressionMethod: 0,
            filterMethod: 0,
            interlaceMethod: 0
        });

        pngIhdr.finish();

        const pngIdat = new PNGChunkStream(stream, 'IDAT');

        const deflate = new DeflateStream(pngIdat);

        let pixelsIndex = 0;
        while (pixelsIndex < pixelsUint8.length) {
            deflate.writeStruct(PNGFilterMethodByte, {
                method: 0
            });

            const partialLength = Math.min(
                pixelsUint8.length - pixelsIndex,
                rowSize - PNGFilterMethodByte.prototype.size
            );
            deflate.writeBytes(
                pixelsUint8, pixelsIndex, pixelsIndex + partialLength
            );

            pixelsIndex += partialLength
        }

        deflate.finish();

        pngIdat.finish();

        const pngIend = new PNGChunkStream(stream, 'IEND');

        pngIend.finish();

        return stream.buffer;
    }

    static encode (width, height, pixels) {
        return new PNGFile().encode(width, height, pixels);
    }
}

exports.PNGFile = PNGFile;