#define NAPI_VERSION 1
#include <napi.h>

#include "../deps/simdjson/singleheader/simdjson.h"

Napi::Boolean IsValidUTF8(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Buffer<char> buffer = info[0].As<Napi::Buffer<char>>();

  char* data = buffer.Data();
  size_t length = buffer.Length();
  bool result = simdjson::validate_utf8(data, length);

  return Napi::Boolean::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  return Napi::Function::New(env, IsValidUTF8, "isValidUTF8");
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
