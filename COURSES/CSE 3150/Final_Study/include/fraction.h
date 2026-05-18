#pragma once
#include "abstract_decimal.h"
#include <stdexcept>
#include <ostream>


class Fraction : public Decimal {
    int* numer_;
    int* denom_;
public:
    double convertToDecimal() override {
        if (*denom_ == 0) throw std::runtime_error("can't divide by 0");

        return static_cast<double>(*numer_) / *denom_;
    }

    // Default
    Fraction() {
        numer_ = new int(0);
        denom_ = new int(0);
    }

    // Custom
    Fraction(int n, int d) {
        numer_ = new int(n);
        denom_ = new int(d);
    }

    // Copy
    Fraction(const Fraction& other) {
        numer_ = new int(*other.numer_);
        denom_ = new int(*other.denom_);
    }

    // Move
    Fraction(Fraction&& other) {
        numer_ = other.numer_;
        denom_ = other.denom_;

        other.numer_ = nullptr;
        other.denom_ = nullptr;
    }

    // Left equal
    Fraction& operator=(const Fraction& lvalue) {
        if (this == &lvalue) return *this;

        delete numer_;
        delete denom_;

        numer_ = new int(*lvalue.numer_);
        denom_ = new int(*lvalue.denom_);

        return *this;
    }

    // Right equal
    Fraction& operator=(Fraction&& rvalue) {
        if (this == &rvalue) return *this;

        delete numer_;
        delete denom_;

        numer_ = rvalue.numer_;
        denom_ = rvalue.denom_;

        rvalue.numer_ = nullptr;
        rvalue.denom_ = nullptr;
    }

    // Destructor
    ~Fraction() override {
        delete numer_;
        delete denom_;
    }

    // Addition
    friend Fraction operator+(const Fraction& a, const Fraction& b) {
        return Fraction(*a.numer_ * *b.denom_ + *b.numer_ * *a.denom_, 
                        *a.denom_ * *b.denom_
        );
    }

    // Multiplication
    friend Fraction operator*(const Fraction& a, const Fraction& b) {
        return Fraction(*a.numer_ * *b.numer_, 
                        *a.denom_ * *b.denom_
        );
    }

    // Output
    friend std::ostream& operator<<(std::ostream& os, const Fraction& a) {
        os << *a.numer_ << "/" << *a.denom_;
        return os;
    }


};