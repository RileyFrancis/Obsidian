# CSE 3150 Final Exam Practice Questions
> Topics: pages 600–1207 (vectors, pointers/references, casts, containers, exceptions, OOP, smart pointers, STL, templates, concepts, lambdas, binary search)

---

## Section 1 — Vectors, Arrays, and Passing Data

**Q1 (Multiple Choice)**
Which of the following is a key advantage of `std::vector` over a raw C array?

- A) Vectors are always faster than C arrays
- B) Vectors know their own size and can grow dynamically
- C) Vectors do not require heap allocation
- D) Vectors cannot be passed to functions

---

**Q2 (Short Answer)**
What is the difference between passing a `std::vector` by value versus by `const` reference? Why is passing by `const` reference usually preferred for large vectors?

---

**Q3 (Coding)**
Write a function `double average(const std::vector<int>& v)` that returns the average of all elements. Handle the empty-vector case by returning `0.0`.

---

## Section 2 — Pointers and References

**Q4 (Multiple Choice)**
Given the following code, what does it print?

```cpp
int x = 10;
int& r = x;
int* p = &x;
r = 20;
std::cout << *p << std::endl;
```

- A) 10
- B) 20
- C) Undefined behavior
- D) Compilation error

---

**Q5 (Short Answer)**
List **three** differences between a pointer and a reference in C++.

---

**Q6 (Multiple Choice)**
Given:
```cpp
struct Point { int x; int y; };
Point* p = new Point{3, 4};
```
Which of the following correctly accesses the `x` field?

- A) `p.x`
- B) `(*p).x`
- C) `p->x`
- D) Both B and C

---

**Q7 (Short Answer)**
What does the **spiral rule** help you do? Apply it to read this declaration:
```cpp
int (*fp)(int, int);
```

---

## Section 3 — `const` with Pointers and References

**Q8 (Multiple Choice)**
What does the following declaration mean?

```cpp
const int* p;
```

- A) `p` is a constant pointer to an `int`
- B) `p` is a pointer to a constant `int`
- C) Both `p` and the `int` it points to are constant
- D) This is a compilation error

---

**Q9 (Short Answer)**
Explain the difference between:
```cpp
const int* p;   // (a)
int* const p;   // (b)
```
For each: what can you change and what can't you change?

---

## Section 4 — C++ Casts

**Q10 (Multiple Choice)**
Which C++ cast should you use to convert a `double` to an `int`?

- A) `dynamic_cast`
- B) `reinterpret_cast`
- C) `static_cast`
- D) `const_cast`

---

**Q11 (Short Answer)**
What is the purpose of `dynamic_cast`? What is required for it to work, and what does it return if the cast fails (for pointer types)?

---

**Q12 (Multiple Choice)**
`const_cast` is dangerous because:

- A) It can change the type hierarchy of a class
- B) Casting away `const` on an originally-const object and then modifying it is undefined behavior
- C) It is slower than `static_cast` at runtime
- D) It cannot be used with pointer types

---

## Section 5 — Containers: Maps and Sets

**Q13 (Short Answer)**
What is the key difference between `std::map` and `std::unordered_map` in terms of:
1. Internal data structure
2. Time complexity for lookup
3. Key ordering

---

**Q14 (Coding)**
Write a function `std::unordered_map<std::string, int> word_count(const std::vector<std::string>& words)` that returns a map from each word to how many times it appears in the input vector.

---

**Q15 (Multiple Choice)**
Which of the following correctly checks if the key `"hello"` exists in an `std::unordered_map<std::string, int> m`?

- A) `m["hello"] != 0`
- B) `m.contains("hello")`
- C) `m.find("hello") != m.end()`
- D) Both B and C

---

**Q16 (Short Answer)**
What is the difference between `std::set` and `std::unordered_set`? When would you choose one over the other?

---

## Section 6 — Exception Handling

**Q17 (Coding)**
Write a function `int safe_divide(int a, int b)` that throws a `std::runtime_error` with the message `"division by zero"` if `b == 0`, and otherwise returns `a / b`. Then write a `main` that calls it with `b = 0` and catches the exception, printing the error message.

---

**Q18 (Multiple Choice)**
What happens if an exception is thrown and there is no matching `catch` block anywhere in the call stack?

- A) The exception is silently ignored
- B) The program calls `std::terminate()`
- C) The program pauses and waits for user input
- D) The exception is converted to a return value of `-1`

---

**Q19 (Short Answer)**
What is `std::expected<T, E>` (introduced in C++23) and how does it differ philosophically from using `throw`/`catch` for error handling?

---

## Section 7 — Structs and Classes

**Q20 (Short Answer)**
What is the **only** default-access difference between a `struct` and a `class` in C++? When should you prefer one over the other by convention?

---

**Q21 (Coding)**
Define a `struct Rectangle` with fields `double width` and `double height`. Add a `double area() const` member function. Then write a `main` that creates a `Rectangle{3.0, 4.0}` and prints its area.

---

**Q22 (Multiple Choice)**
What does marking a member function `const` guarantee?

- A) The function runs at compile time
- B) The function cannot be called on non-const objects
- C) The function cannot modify any data members of the object
- D) The function's return type is `const`

---

**Q23 (Short Answer)**
What is the `this` pointer? What is its type inside a non-const member function of a class `Foo`?

---

## Section 8 — Constructors, Destructors, and the Rule of 5

**Q24 (Coding)**
Implement a class `Buffer` that:
- Has a private `int* data` and `int size`
- Has a constructor `Buffer(int n)` that allocates `n` ints on the heap
- Has a destructor that frees the memory
- Has a copy constructor that performs a **deep copy**

---

**Q25 (Short Answer)**
Explain the difference between a **shallow copy** and a **deep copy**. Why does the default compiler-generated copy constructor perform a shallow copy, and when is this a problem?

---

**Q26 (Multiple Choice)**
The "Rule of 5" states that if you define any one of the following, you should define all five. Which set is correct?

- A) Constructor, destructor, copy constructor, copy assignment, `toString`
- B) Destructor, copy constructor, copy assignment operator, move constructor, move assignment operator
- C) Default constructor, parameterized constructor, copy constructor, destructor, `operator==`
- D) Copy constructor, move constructor, destructor, `operator<`, `operator>`

---

**Q27 (Short Answer)**
What is the difference between an **lvalue** and an **rvalue**? Give one example of each. What does `T&&` mean in a function parameter?

---

**Q28 (Coding)**
Given this class skeleton, implement the **move constructor**:

```cpp
class MyVec {
    int* data;
    int  size;
public:
    MyVec(int n) : data(new int[n]), size(n) {}
    ~MyVec() { delete[] data; }
    // Write the move constructor here
};
```

---

## Section 9 — Inheritance and Polymorphism

**Q29 (Multiple Choice)**
When class `Dog` inherits publicly from `Animal`, which of the following is true under subsumption?

- A) A `Dog*` can be implicitly converted to an `Animal*`
- B) An `Animal*` can be implicitly converted to a `Dog*`
- C) `Dog` objects cannot be stored in an `std::vector<Animal>`
- D) `Dog` may not override `Animal`'s methods

---

**Q30 (Short Answer)**
Explain the difference between **overloading** and **overriding**. Give a one-line code example of each.

---

**Q31 (Multiple Choice)**
Without the `virtual` keyword, what kind of dispatch does C++ use by default?

- A) Dynamic dispatch (runtime)
- B) Static dispatch (compile time)
- C) Virtual dispatch through the vtable
- D) No dispatch — method calls are disallowed without `virtual`

---

**Q32 (Short Answer)**
What is a **vtable** and what is a **vptr**? Describe at a high level how dynamic dispatch works using them.

---

**Q33 (Coding)**
Define an abstract base class `Shape` with a pure virtual method `double area() const`. Then define two derived classes `Circle` (with `double radius`) and `Square` (with `double side`) that implement `area()`. Write a `main` that stores a `Circle` and a `Square` in a `std::vector<Shape*>` and prints each area.

---

**Q34 (Multiple Choice)**
Why should a base class almost always declare its destructor as `virtual`?

- A) To prevent the derived class from defining its own destructor
- B) So that deleting a base-class pointer to a derived object calls the derived destructor first
- C) To make the class abstract
- D) To allow the destructor to be inlined

---

**Q35 (Short Answer)**
What do the `override` and `final` keywords do? Why is `override` considered best practice when overriding a virtual method?

---

## Section 10 — Operator Overloading

**Q36 (Coding)**
Implement `operator+` for the following `Point` struct so that `Point{1,2} + Point{3,4}` returns `Point{4,6}`:

```cpp
struct Point {
    double x, y;
};
```

---

**Q37 (Short Answer)**
What is a `friend` function, and when would you use one to implement an operator overload (e.g., `operator<<`) instead of a member function?

---

## Section 11 — Smart Pointers

**Q38 (Multiple Choice)**
Which smart pointer enforces **sole ownership** — it cannot be copied, only moved?

- A) `std::shared_ptr`
- B) `std::weak_ptr`
- C) `std::unique_ptr`
- D) Raw pointer (`T*`)

---

**Q39 (Short Answer)**
Explain what **reference counting** means in the context of `std::shared_ptr`. What happens when the count reaches zero?

---

**Q40 (Short Answer)**
What is a **cyclic reference** problem with `std::shared_ptr`? How does `std::weak_ptr` solve it?

---

**Q41 (Multiple Choice)**
Why should you prefer `std::make_shared<T>(...)` over `new T(...)` when creating a `shared_ptr`?

- A) `make_shared` avoids a second heap allocation for the control block
- B) `make_shared` performs a deep copy automatically
- C) `make_shared` is required by the C++ standard
- D) `new` cannot be used with `shared_ptr`

---

## Section 12 — STL Algorithms, Iterators, and `auto`

**Q42 (Short Answer)**
What is an iterator in C++? What is the difference between `begin()` and `end()` for a container?

---

**Q43 (Coding)**
Using `std::find_if` and a lambda, write code that finds the first even number in `std::vector<int> v = {1, 3, 5, 4, 7}` and prints it (or prints "none" if not found).

---

**Q44 (Short Answer)**
What does `std::back_inserter` do, and why is it useful with algorithms like `std::copy`?

---

**Q45 (Multiple Choice)**
What does the following code print?

```cpp
std::vector<int> v = {5, 3, 1, 4, 2};
std::sort(v.begin(), v.end());
std::cout << v[0] << " " << v[4] << std::endl;
```

- A) `5 2`
- B) `1 5`
- C) `3 3`
- D) `0 4`

---

## Section 13 — Templates and C++20 Concepts

**Q46 (Coding)**
Write a function template `T mymax(T a, T b)` that returns the larger of two values. Show how to call it with both `int` and `double`.

---

**Q47 (Short Answer)**
What is a C++20 **concept**? What problem does it solve compared to unconstrained templates? Give a simple example of a concept constraint using `requires`.

---

**Q48 (Multiple Choice)**
When a function template parameter is passed by `const T&` instead of by `T`, what is the primary benefit?

- A) It allows the function to modify the argument
- B) It avoids copying potentially large objects
- C) It enables compile-time evaluation
- D) It makes the template non-deducible

---

## Section 14 — Enums

**Q49 (Multiple Choice)**
What is the main advantage of `enum class` (scoped enum) over a plain `enum`?

- A) Scoped enums support floating-point values
- B) Scoped enums do not implicitly convert to `int` and their names are scoped
- C) Scoped enums are faster at runtime
- D) Scoped enums can be inherited from

---

**Q50 (Short Answer)**
Show how to define a scoped enum `Color` with values `Red`, `Green`, `Blue`, and how to use one in a switch statement.

---

## Section 15 — Lambdas and Closures

**Q51 (Short Answer)**
List the **four** capture modes available in a C++ lambda and explain what each one captures.

---

**Q52 (Multiple Choice)**
What does the following lambda capture?

```cpp
int x = 5;
auto f = [x](int y) { return x + y; };
x = 100;
std::cout << f(3) << std::endl;
```

- A) 103
- B) 8
- C) Compilation error
- D) Undefined behavior

---

**Q53 (Coding)**
Write a lambda `is_large` that captures a `double threshold` by value and returns `true` if its argument is greater than the threshold. Test it with `threshold = 10.0` on values `5.0`, `10.0`, and `15.0`.

---

**Q54 (Short Answer)**
What is the difference between capturing a variable by value (`[x]`) versus by reference (`[&x]`) in a lambda? When would each be preferred?

---

**Q55 (Multiple Choice)**
Why can `auto` be used to store a lambda, but a plain `std::function<int(int,int)>` cannot always be used as a drop-in replacement?

- A) `auto` is faster at runtime than `std::function`
- B) `std::function` has overhead from type erasure; `auto` deduces the exact closure type enabling inlining
- C) `std::function` cannot hold lambdas that capture variables
- D) `auto` is only available in C++20

---

**Q56 (Coding)**
Given the template:
```cpp
template<class T, class Cmp>
bool find(const std::vector<T>& x, const T& v, Cmp cmp);
```
Call this function to search for the value `1.6666` in `std::vector<double> x = {0, 1, 5.0/3.0, 2, 3}` using an inline lambda comparator with `eps = 0.01`.

---

## Section 16 — Binary Search

**Q57 (Short Answer)**
Trace through the binary search algorithm (as implemented in class) searching for `7` in the sorted array `{0, 1, 2, 3, 4, 5, 6, 7, 8}`. Show the values of `low`, `up`, and `mid` at each iteration.

---

**Q58 (Multiple Choice)**
The binary search implementation from class has loop condition `while (low <= up)`. What condition causes the loop to exit when the element is **not** found?

- A) `mid == v`
- B) `low > up`
- C) `mid == 0`
- D) `up == x.size()`

---

**Q59 (Short Answer)**
Why does the binary search from class not work correctly for `double` values without a custom comparator? What problem arises, and how is an epsilon comparator used to fix it?

---

## Section 17 — Mixed / Tricky

**Q60 (Coding)**
What is wrong with the following code? Fix it.

```cpp
class Animal {
public:
    void speak() { std::cout << "..." << std::endl; }
    ~Animal() {}
};

class Dog : public Animal {
public:
    void speak() { std::cout << "Woof!" << std::endl; }
};

int main() {
    Animal* a = new Dog();
    a->speak();   // Should print "Woof!"
    delete a;
}
```

---

**Q61 (Short Answer)**
What are the **four pillars of OOP**? Give a one-sentence definition of each in the context of C++.

---

**Q62 (Multiple Choice)**
What is the difference between **public**, **protected**, and **private** inheritance?

- A) They control which members are accessible outside the class hierarchy, but all three allow subsumption
- B) Only public inheritance preserves the is-a (subsumption) relationship; protected and private cut it off
- C) Protected inheritance is the same as public inheritance
- D) Private inheritance makes all members inaccessible even to the derived class

---
