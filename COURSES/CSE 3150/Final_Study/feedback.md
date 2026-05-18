# problems.cpp Feedback

## Correct / Strong Answers

**Q1 (B), Q4 (B), Q6 (D), Q8 (B), Q10 (C), Q12 (B), Q15 (D), Q18 (B), Q22 (C), Q29 (A), Q31 (B), Q34 (B), Q38 (C), Q41 (A), Q45 (B), Q48 (B), Q49 (B)** — all correct.

**Q3, Q14, Q17, Q21, Q33, Q43, Q46** — coding answers are correct.

**Q9, Q13, Q23, Q39, Q40** — short answers are solid.

---

## Issues to Address

### Q5 — Pointers vs References
> "Both store memory addresses"

This is wrong. A reference is an alias — it doesn't need to store an address at all. Three cleaner differences: (1) pointers can be null, references cannot; (2) pointers can be reassigned to point elsewhere, references cannot; (3) references must be initialized at declaration, pointers don't have to be.

---

### Q11 — dynamic_cast
Too brief. Also needs: requires at least one `virtual` function in the class hierarchy (polymorphic type), and returns **`nullptr`** if the cast fails (for pointer types). For reference types it throws `std::bad_cast`.

---

### Q19 — std::expected
Missing the key philosophical point. `std::expected<T,E>` makes the error part of the **return type**, forcing callers to handle it explicitly. It avoids the hidden control flow and stack-unwinding cost of `throw`/`catch`.

---

### Q20 — struct vs class
Correct on the access difference, but the question also asks *when to prefer one by convention*. Convention: use `struct` for plain data aggregates (no invariants, public data fine), use `class` for types that enforce invariants and encapsulation.

---

### Q24 — Copy constructor (incomplete)
The body is empty. It should deep-copy:

```cpp
Buffer(const Buffer& other) {
    size = other.size;
    data = new int[size];
    for (int i = 0; i < size; ++i) data[i] = other.data[i];
}
```

---

### Q25 — Shallow vs deep copy
Missing the key problem statement: the default copy constructor copies the *pointer value*, so both objects point to the **same heap memory**. When one is destroyed, the other is left with a dangling pointer — double-free on the second destructor call.

---

### Q26 (MC) — Rule of 5
**Answer A is wrong.** Answer is **B**: destructor, copy constructor, copy assignment operator, move constructor, move assignment operator. `toString` is not a C++ concept.

---

### Q27 — lvalue / rvalue
The definition is wrong. An **lvalue** is an expression with a persistent memory location (e.g., a named variable like `int x`). An **rvalue** is a temporary with no persistent identity (e.g., `x + 1` or a literal `42`). The "left/right of `=`" mnemonic breaks down for expressions like `a == b`. Also missing: `T&&` is an **rvalue reference**, used to implement move semantics.

---

### Q28 — Move constructor
Mostly correct, but forgot to move `size`:

```cpp
MyVec(MyVec&& other) : data(other.data), size(other.size) {
    other.data = nullptr;
    other.size = 0;
}
```

---

### Q30 — Overloading vs Overriding
Two issues: (1) C++ does **not** allow overloading by return type alone — only by parameter signature; (2) the question asks for a one-line code example of each — these are missing. Also, "shadowing" is a different concept from overriding; overriding requires `virtual`.

---

### Q32 — vtable / vptr (skipped)
A **vtable** is a per-class array of function pointers for its virtual methods. A **vptr** is a hidden pointer stored in each object instance pointing to its class's vtable. On a virtual call, the CPU follows the vptr to the vtable and jumps to the correct function — this is dynamic dispatch.

---

### Q35 — override / final
Correct, but missing why `override` is best practice: the compiler verifies that the function actually overrides something. Without it, a typo in the function signature silently creates a new function instead of overriding.

---

### Q36 — operator+ (wrong)
Returning `Point*` is incorrect — it creates a memory leak and breaks `Point a = p1 + p2`. Should return by value:

```cpp
Point operator+(const Point& other) const {
    return Point{x + other.x, y + other.y};
}
```

---

### Q37 — friend functions (partial)
First part correct. For the second part: `operator<<` must take `std::ostream&` as its *first* argument, so it can't be a member function (where the object would be the implicit first argument). A `friend` function gets access to private members while being a free function.

---

### Q42 — end()
`end()` is a **past-the-end** iterator — it points one past the last element and **cannot be dereferenced**. It's used as a sentinel to detect when iteration is complete.

---

### Q44 — back_inserter
The description is wrong. `std::back_inserter(container)` returns an output iterator that calls `push_back` on the container each time it's assigned. This lets algorithms like `std::copy` append to a container without pre-sizing it.

---

### Q47 — concept example (typo + syntax)
Two issues: `std::convertable_to` is a typo — it's `std::convertible_to`. Also missing a semicolon after the closing `}` of the concept definition.

---

### Q51 (skipped)
Four capture modes: `[]` (capture nothing), `[=]` (all locals by value), `[&]` (all locals by reference), `[x]` / `[&x]` (specific variable by value or reference).

---

### Q52 (MC) — wrong
**Answer A (103) is wrong.** The lambda captures `x` **by value at capture time** (when `x == 5`). The later `x = 100` doesn't affect the lambda. So `f(3) = 5 + 3 = 8`. Answer is **B**.

---

### Q54 (skipped)
By value `[x]`: captures a copy — changes to the original don't affect the lambda; safe if the original goes out of scope. By reference `[&x]`: lambda sees live updates to the original; dangerous if the original is destroyed before the lambda runs.

---

### Q56 — incomplete

```cpp
double eps = 0.01;
bool found = find(x, 5.0/3.0, [eps](double a, double b) {
    return std::abs(a - b) < eps;
});
```

---

## Summary

| Category | Count |
|---|---|
| Multiple choice correct | ~14/17 (wrong: Q26, Q52) |
| Short answers solid | Q9, Q13, Q23, Q39, Q40 |
| Short answers incomplete/wrong | Q5, Q11, Q19, Q20, Q25, Q27, Q30, Q32, Q35, Q37, Q42, Q44, Q51, Q54 |
| Coding correct | Q3, Q14, Q17, Q21, Q33, Q43, Q46 |
| Coding wrong/incomplete | Q24, Q28 (minor), Q36, Q47, Q56 |

**Highest priority fixes before the exam:** Q26 (wrong MC), Q52 (wrong MC), Q36 (wrong return type), Q27 (wrong definition), Q32 (vtable/vptr — likely to be tested).
