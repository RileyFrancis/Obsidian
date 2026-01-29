#include <iostream>

int square(int num) {
    return num * num;
}

double divide(double num1, double num2) {
    return num1 / num2;
}

// You can default a parameter's value. Dafault values must come after all other values to avoid compilation confusion.
double divide2(double num1, double num2 = 2) {
    return num1 / num2;
}

// Parameters are scoped to be only within the function. They may not be used outside the function that they are defined in.
// Any set of curly braces will create a scope.

int my_func() {
    {
        int x = 42;
        std::cout << x << std::endl;
    }

    // ERROR!
    // std::cout << x << std::endl;

    // The above statement will error because the curly braces define a scope in which x is defined, then we try to reference
    // it outside of the variable's scope.
}

int main() {
    std::cout << square(5) << std::endl;
    return 0; // Reminder that main() should ALWAYS return 0.
}