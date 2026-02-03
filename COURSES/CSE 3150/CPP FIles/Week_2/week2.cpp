#include <iostream>
// The pound include statement at the top here says "take the contents of this package and use it for linking"

#include "funcs.hpp"

// Functions must be declared before you call them. If you created this function after main(), it would error.
void my_function(int x) {
    std::cout << x << std::endl;
}

// You can also declare just a function stub and then define it later
void my_function2(int x);

int main() {
    int y;
    y = 50;
    my_function(y);
    example(y);
    return 0;
}

// Now we define it later after it was declared earlier
void my_function2(int x) {
    std::cout << x << std::endl;
}
