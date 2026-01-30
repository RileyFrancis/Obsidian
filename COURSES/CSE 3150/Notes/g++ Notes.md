To compile a C++ file, use:

```cpp
g++ <filename>.cpp
```

You can optionally specify the output executable filename using the `-o` tag:

```cpp
g++ <filename>.cpp -o <filename>
```


```cpp
#include <iostream>

int main () {
	std::cout << "Hello world!" << std::endl;
	return 0;
}
```

```python
def something():
	print("Hello world!")
	
if __name__ == "__main__":
	something()
```