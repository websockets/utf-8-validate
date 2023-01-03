# is_utf8

Most strings online are in unicode using the UTF-8 encoding. Validating strings
quickly before accepting them is important.




## How to use is_utf8

This is a simple one-source file library to validate UTF-8 strings at high speeds using SIMD instructions. It works on all platforms (ARM, x64).

Build and link `is_utf8.cpp` with your project. Code usage:

```C++
  #include "is_utf8.h"

  char * mystring = ...
  bool is_it_valid = is_utf8(mystring, thestringlength);
```

It should be able to validate strings using less than 1 cycle per input byte.

## Reference

- John Keiser, Daniel Lemire, [Validating UTF-8 In Less Than One Instruction Per Byte](https://arxiv.org/abs/2010.03090), Software: Practice & Experience 51 (5), 2021

### Want more?

If you want a wide range of fast Unicode function for production use, you can rely on the simdutf library. It is as simple as the following:

```C++
#include "simdutf.cpp"
#include "simdutf.h"

int main(int argc, char *argv[]) {
  const char *source = "1234";
  // 4 == strlen(source)
  bool validutf8 = simdutf::validate_utf8(source, 4);
  if (validutf8) {
    std::cout << "valid UTF-8" << std::endl;
  } else {
    std::cerr << "invalid UTF-8" << std::endl;
    return EXIT_FAILURE;
  }
}
```

See https://github.com/simdutf/


## License

This library is distributed under the terms of any of the following
licenses, at your option:

* Apache License (Version 2.0) [LICENSE-APACHE](LICENSE-APACHE),
* Boost Software License [LICENSE-BOOST](LICENSE-BOOST), or
* MIT License [LICENSE-MIT](LICENSE-MIT).
