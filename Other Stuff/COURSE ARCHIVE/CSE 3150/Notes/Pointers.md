Pointers in C++ point to the memory address of something. For example,

```cpp
#include <iostream> 

int main() {
	int x = 42;
	int* p = &x; // The star declares a pointer and the ampersand 
				 // says to get the memory address of x
	
	std::cout << x << std::endl;   // The original variable
	std::cout << p << std::endl;   // The pointer to x (the memory address of x)
	std::cout << *p << std::endl;  // What p is pointing to (x)
	
	return 0;
}
```

> [!tip] Output 
> ```bash
> 42
> 0x7ffca5003e6
> 42
> ```

### Null Pointers
```cpp
#include <iostream>

int main() {
	int *p = nullptr; // This is a null pointer and points to nothing
	
	// We don't want to print p when it is null!
	std::cout << *p << std::endl;
	
	return 0;
}
```

> [!tip] Output 
> ```bash
> Segmentation Fault (core dumped)
> ```
