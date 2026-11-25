#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
#include <sstream>
#include <stdexcept>
#include <algorithm>
#include <concepts>


// 1
// B

// 2
// Passing a vector by value means that the vector has to be copied into the function. Passing by constant reference is preferred because it does not have the memory and computational overhead of copying that vector.

// 3 
double average(const std::vector<int>& v) {
    if (v.size() == 0) return 0.0;

    int sum = 0;
    for (size_t i = 0; i < v.size(); ++i) {
        sum += v[i];
    }
    return (double)sum / v.size();
}

// 4
// B

// 5
// A reference cannot be reassigned or moved and is a renaming of the original variable. References must be declared upon initialization. Both store memory addresses.

// 6
// D

// 7
// fp is a pointer to a function (int, int) that returns an int. 

// 8 
// B

// 9
// a is a pointer to a constant int (the value can't change but the pointer can), and b is a constant pointer to an int (the pointer can't change but the int can)

// 10
// C

// 11
// Dynamic cast will cast within class heirarchy

// 12
// B

// 13
// Map uses Red Black tree while unordered map uses hashmap, loopup is faster for unordered map with O(1) vs O(log(n)), map has ordered key vs unordered for unordered map.

// 14
std::unordered_map<std::string, int> word_count(const std::vector<std::string>& words) {
    std::unordered_map<std::string, int> freq;
    for (size_t i = 0; i < words.size(); ++i) {
        freq[words[i]] += 1;
    }
    return freq;
}

// 15
// D

// 16
// The same as map vs unordered map. The values are sorted or not depending on if you need to preserve the order to items within the set. You would use unordered for speed.

// 17
int safe_divide(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division by 0");
    }
    return a / b;
}

int main() {
    try {
        int result = safe_divide(1, 0);
    } catch (const std::runtime_error& e) {
        std::cerr << e.what() << std::endl;
    }
}

// 18
// B

// 19
// This is just another way to handle exceptions. Functions using expected return std::unexpected if they encounter an error.

// 20
// structs are public by default and classes are private by default

// 21
struct Rectangle {
    double width;
    double height;

    double area() const {
        return width * height;
    }
};

int main() {
    Rectangle r = {3, 4};
    std::cout << r.area() << std::endl;
}

// 22
// C

// 23
// this refers to the containing object, so you can do things like this->width. Here it would have type Foo*.

// 24
class Buffer {
private:
    int* data;
    int size;

public:
    Buffer(int n) {
        data = new int[n];
        size = n;
    }

    ~Buffer() {
        delete[] data;
    } 

    Buffer(const Buffer& other) {
        // Not sure what would have to go here
    }
};

// 25
// Shallow copy copies the values from one object into another. Deep copy creates an entirely new object by allocating new memory.

// 26
// A

// 27
// lvalue is the left value of an operation like == or < and rvalue is the same for the right value.

// 28
class MyVec {
    int* data;
    int size;
public:
    MyVec(int n) : data(new int[n]), size(n) {}
    ~MyVec() {delete[] data;}

    MyVec(MyVec&& other) {
        data = other.data;
        other.data = nullptr;
    }
};

// 29
// A

// 30
// overloading is when you have multiple functions by the same name but with different parameters or return types. overriding is shadowing a function in a super class with a function with the same name in the child class.

// 31
// B

// 32
// Not sure about this one

// 33
class Shape {
public:
    virtual double area() const = 0;
};

class Circle : public Shape {
    double radius;
public:
    Circle(double rad) : radius(rad) {}
    double area() const override {
        return radius * radius * 3.14159;
    }
};

class Square : public Shape {
    double side;
public:
    Square(double s) : side(s) {}
    double area() const override {
        return side * side;
    }
};

int main() {
    std::vector<Shape*> shapes;
    shapes.push_back(new Circle(4));
    shapes.push_back(new Square(4));

    for (const auto& shape : shapes) {
        std::cout << shape->area() << std::endl;
    }
}

// 34
// B

// 35
// override tells the compiler that this function is replacing the definition of the function in the class it is inheriting. final tells the compiler that this function can't be overridden in classes that inherit it.

// 36
struct Point {
    double x, y;

    Point* operator+(const Point& other) const {
        return new Point{x + other.x, y + other.y};
    }
};

// 37
// A friend function is a function that is allowed to access the private members of a class. Not sure about the second part of this question.

// 38
// C

// 39
// When the reference count reaches 0, the pointer is deleted. Reference count tracks the number of things that reference that pointer.

// 40
// Cyclic reference is a problem where two (or more) pointers refer to each other, so the reference count never reaches 0. Weak pointers solve this by owning references to things without increasing the reference count.

// 41
// B

// 42
// An iterator is a type of object that includes a value and a way to get to the next element. Begin gives you the first element and end gives you the last one.

// 43
std::vector<int> v = {1, 3, 5, 4, 7};
auto first = std::find_if(v.begin(), v.end(), [](int n) {
    return n % 2 == 0;
});

if (first != v.end()) {
    std::cout << *first << std::endl;
} else {
    std::cout << "none" << std::endl;
}

// 44
// back inserter inserts something from the other end of an iterator.

// 45
// B

// 46
template <typename T>
T mymax(T a, T b) {
    if (a > b) {
        return a;
    } else return b; 
}

// 47
// Concepts create requirements in order to use templates with certain types. For example, you could have:
template <typename T>
concept example = requires(T a, T b) {
    {a == b} -> std::convertable_to<bool>;
}

// 48
// B

// 49
// B

// 50
enum class Color : int {
    Red,
    Blue,
    Green
};

Color color = Color::Blue;

switch (color)
{
case Color::Red:
    break;
case Color::Green:
    break;
case Color::Blue:
    break;

default:
    break;
};

// LAMBDAS ARE NOT COVERED ON MY FINAL SO DONT WORRY ABOUT THIS PART

// 51
// Not sure

// 52
// A

// 53
double threshold = 1;
auto is_large = [threshold](double x) { return x > threshold; };

// 54
// Not sure

// 55
// B

// 56
template<class T, class Cmp>
bool find(const std::vector<T>& x, const T& v, Cmp cmp);

std::vector<double> x = {0, 1, 5.0/3.0, 2, 3};
// Not sure how to do the rest of this