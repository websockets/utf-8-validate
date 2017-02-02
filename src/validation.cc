/*!
 * UTF-8 validate: UTF-8 validation for WebSockets.
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

#include <nan.h>

NAN_METHOD(isValidUTF8) {
  if (!node::Buffer::HasInstance(info[0])) {
    Nan::ThrowTypeError("First argument needs to be a buffer");
    return;
  }

  uint8_t* s = reinterpret_cast<uint8_t*>(node::Buffer::Data(info[0]));
  size_t length = node::Buffer::Length(info[0]);
  uint8_t* end = s + length;

  //
  // This code has been taken from utf8_check.c which was developed by
  // Markus Kuhn <http://www.cl.cam.ac.uk/~mgk25/>.
  //
  // For original code / licensing please refer to
  // https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c
  //
  while (s < end) {
    if (*s < 0x80) {  // 0xxxxxxx
      s++;
    } else if ((s[0] & 0xe0) == 0xc0) {  // 110xxxxx 10xxxxxx
      if (
        s + 1 == end ||
        (s[1] & 0xc0) != 0x80 ||
        (s[0] & 0xfe) == 0xc0  // overlong
      ) {
        break;
      } else {
        s += 2;
      }
    } else if ((s[0] & 0xf0) == 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        s + 2 >= end ||
        (s[1] & 0xc0) != 0x80 ||
        (s[2] & 0xc0) != 0x80 ||
        (s[0] == 0xe0 && (s[1] & 0xe0) == 0x80) ||
        (s[0] == 0xed && (s[1] & 0xe0) == 0xa0)
      ) {
        break;
      } else {
        s += 3;
      }
    } else if ((s[0] & 0xf8) == 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        s + 3 >= end ||
        (s[1] & 0xc0) != 0x80 ||
        (s[2] & 0xc0) != 0x80 ||
        (s[3] & 0xc0) != 0x80 ||
        (s[0] == 0xf0 && (s[1] & 0xf0) == 0x80) ||  // overlong
        (s[0] == 0xf4 && s[1] > 0x8f) || s[0] > 0xf4  // > U+10FFFF
      ) {
        break;
      } else {
        s += 4;
      }
    } else {
      break;
    }
  }

  info.GetReturnValue().Set(Nan::New<v8::Boolean>(s == end));
}

void init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  Nan::SetMethod(module, "exports", isValidUTF8);
}

NODE_MODULE(validation, init)
