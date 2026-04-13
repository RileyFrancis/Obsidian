#pragma once

#include <cstddef> // for size_t
#include <stdexcept>


template <typename T>
class Vector {
private:
    T* data_;
    size_t size_;
    size_t capacity_;

    void resize_capacity(size_t new_capacity);

public:
    Vector();
    ~Vector();

    size_t size() const;
    size_t capacity() const;
    bool empty() const;

    void push_back(const T& value);

    T& at(size_t index) {
        if (index >= size_) {
            throw std::out_of_range("Index out of range");
        }
        return data_[index];
    }
};