import { HttpUrlEncodingCodec } from '@angular/common/http';

/**
 * Encoding needed for http params
 */
export class HttpUrlEncoder extends HttpUrlEncodingCodec {
 /**
  * replaces encoded values for brackets in url key query parameters
  *
  * this adds to the functionality of HttpUrlEncodingCodec
  *
  * @param k key parameter
  */
  encodeKey(k: string): string {
    return super.encodeKey(k)
    .replace(new RegExp('%5B', 'gi'), '[')
    .replace(new RegExp('%5D', 'gi'), ']');
  }

  /**
   * replaces encoded values for brackets in url value query parameters
   *
   * @param value value parameter
   */
  encodeValue(value: string): string {
    return super.encodeValue(value)
    .replace(new RegExp('%5B', 'gi'), '[')
    .replace(new RegExp('%5D', 'gi'), ']')
    .replace(new RegExp('%2C', 'gi'), ',');
  }
}
