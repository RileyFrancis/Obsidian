#pragma once
#include<ostream>


class Card {

public:
    virtual int value() const = 0;

    virtual void print(std::ostream& os) const = 0;

    virtual bool operator<(const Card& rvalue) const {
        return value() < rvalue.value();
    }

    virtual bool operator==(const Card& rvalue) const {
        return value() == rvalue.value();
    }

    virtual ~Card() = default;

    friend std::ostream operator<<(std::ostream& os, const Card& card) {
        card.print(os);
    }
};