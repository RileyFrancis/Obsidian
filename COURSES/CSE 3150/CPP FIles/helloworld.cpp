// This is a comment

/*
This is a multi-line comment
*/

// This is an include directive
#include <iostream>

int main() {
    // Print "Hello, World!" to the console
    std::cout << "Hello, World!" << std::endl;

    // We can declare a new variable
    int num_students; // Variables can only contain letters, numbers (although rather strange), and underscores
    num_students = 100;

    // Variables must be declared with a type.
    // Types include int, float, double, char, bool, etc.

    double grade_average = 89.5;
    char letter_grade = 'B'; // Char values MUST use single quotes
    bool is_passing = true; // Boolean values always store either 0 or 1

    std::cout << "Number of students: " << num_students << std::endl;

    return 0;
}