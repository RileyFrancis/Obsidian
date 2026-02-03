#include <iostream>

// You can add namespaces here
using std::cout, std::endl;

// You can also create your own namespace here
namespace MATHFUNCS {
    int add(int a, int b) {
        return a + b;
}

int main() {
    std::cout << MATHFUNCS::add(2, 3) << std::endl;
    return 0;
}
