{
  'targets': [
    {
      'target_name': 'validation',
      'sources': [
        'src/validation.cc',
        'deps/simdutf/singleheader/simdutf.cpp'
      ],
      'cflags_cc': ['-std=gnu++11'],
      'conditions': [
        ["OS=='mac'", {
          'xcode_settings': {
            'MACOSX_DEPLOYMENT_TARGET': '10.7',
            'OTHER_CFLAGS': ['-arch x86_64', '-arch arm64'],
            'OTHER_LDFLAGS': ['-arch x86_64', '-arch arm64']
          }
        }]
      ]
    }
  ]
}
