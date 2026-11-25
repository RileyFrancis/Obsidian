#pragma once
#include <ostream>

template <typename T>
class Vector2 {
private:
    T x_;
    T y_;

public:
    Vector2() {
        x_ = 0;
        y_ = 0;
    }

    Vector2(T x, T y) {
        x_ = x;
        y_ = y;
    }

    Vector2 operator+(const Vector2& other) const {
        return Vector2(x_ + other.x_, y_ + other.y_);
    }

    friend std::ostream& operator<<(std::ostream& os, const Vector2& v) {
        return os << "Vector2(" << v.x_ << ", " << v.y_ << ")";
    }
    
};