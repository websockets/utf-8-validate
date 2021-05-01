{
  'targets': [
    {
      'target_name': 'validation',
      'sources': [
        'src/validation.cc',
        'deps/simdjson/singleheader/simdjson.cpp'
      ],
      'include_dirs': ["<!(node -p \"require('node-addon-api').include_dir\")"],
      'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS']
    }
  ]
}
