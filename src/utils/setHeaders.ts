import Koa from 'koa'
import mime from 'mime'
import parseRange from 'range-parser'

const NonCharsetFileTypes = /\.(wasm|usdz)$/;

const setContentTypeHeader = (ctx: Koa.Context, filename: string) => {
  let contentType = mime.getType(filename) || ''

  if (!NonCharsetFileTypes.test(filename)) {
    contentType += '; charset=UTF-8'
  }

  ctx.response.type = contentType
  if (!ctx.response.type) {
    ctx.response.type = contentType
  }
}

const setRangeHeaders = (ctx: Koa.Context, content: string) => {
  ctx.set('Accept-Ranges', 'bytes');
  const range = ctx.header.range

  if (range) {
    const ranges = parseRange(content.length, range);

    if (ranges === -1) {
      ctx.set('Content-Range', `bytes */${content.length}`);
      ctx.status = 416;
    } else if (ranges !== -2 && ranges.length === 1) {
      const { length } = content;

      ctx.status = 206;
      ctx.set(
        'Content-Range',
        `bytes ${ranges[0].start}-${ranges[0].end}/${length}`
      );

      content = content.slice(ranges[0].start, ranges[0].end + 1);
    }
  }

  return content;
}

const setHeaders = (ctx: Koa.Context, filename: string, content: string) => {
  setContentTypeHeader(ctx, filename)
  
  return setRangeHeaders(ctx, content)
}

export default setHeaders