/*!
 * UTF-8 validate: UTF-8 validation for WebSockets.
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

#include <v8.h>
#include <node.h>
#include <node_version.h>
#include <node_buffer.h>
#include <node_object_wrap.h>
#include <stdlib.h>
#include <wchar.h>
#include <stdio.h>
#include "nan.h"

using namespace v8;
using namespace node;

class Validation : public ObjectWrap {
public:
  static void Initialize(v8::Handle<v8::Object> target) {
    Nan::HandleScope scope;
    Local<FunctionTemplate> t = Nan::New<FunctionTemplate>(New);
    t->InstanceTemplate()->SetInternalFieldCount(1);
    Nan::SetMethod(t, "isValidUTF8", Validation::IsValidUTF8);
    Nan::Set(target, Nan::New<String>("Validation").ToLocalChecked(),
             t->GetFunction());
  }

protected:
  static NAN_METHOD(New) {
    Nan::HandleScope scope;
    Validation* validation = new Validation();
    validation->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  }

  static NAN_METHOD(IsValidUTF8) {
    Nan::HandleScope scope;
    if (!Buffer::HasInstance(info[0])) {
      return Nan::ThrowTypeError("First argument needs to be a buffer");
    }

    Local<Object> buffer = info[0]->ToObject();
    uint8_t *s = (uint8_t *) Buffer::Data(buffer);
    size_t length = Buffer::Length(buffer);
    uint8_t *end = s + length;

    //
    // This code has been taken from utf8_check.c which was developed by
    // Markus Kuhn <http://www.cl.cam.ac.uk/~mgk25/>.
    //
    // For original code / licensing please refer to
    // https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c
    //
    while (s < end) {
      if (*s < 0x80) { // 0xxxxxxx
        s++;
      } else if ((s[0] & 0xe0) == 0xc0) { // 110xxxxx 10xxxxxx
        if (
          s + 1 == end ||
          (s[1] & 0xc0) != 0x80 ||
          (s[0] & 0xfe) == 0xc0 // overlong
        ) {
          break;
        } else {
          s += 2;
        }
      } else if ((s[0] & 0xf0) == 0xe0) { // 1110xxxx 10xxxxxx 10xxxxxx
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
      } else if ((s[0] & 0xf8) == 0xf0) { // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        if (
          s + 3 >= end ||
          (s[1] & 0xc0) != 0x80 ||
          (s[2] & 0xc0) != 0x80 ||
          (s[3] & 0xc0) != 0x80 ||
          (s[0] == 0xf0 && (s[1] & 0xf0) == 0x80) || // overlong
          (s[0] == 0xf4 && s[1] > 0x8f) || s[0] > 0xf4 // > U+10FFFF
        ) {
          break;
        } else {
          s += 4;
        }
      } else {
        break;
      }
    }

    info.GetReturnValue().Set(s < end ? Nan::False() : Nan::True());
  }
};

#if !NODE_VERSION_AT_LEAST(0,10,0)
extern "C"
#endif

void init(Handle<Object> target) {
  Nan::HandleScope scope;
  Validation::Initialize(target);
}

NODE_MODULE(validation, init)
