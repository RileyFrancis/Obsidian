#pragma once
#include "card.h"
#include <string>
#include <stdexcept>
#include <ostream>

class PlayingCard : public Card {
protected:
    std::string suit_;
    int rank_;

public:
    std::string rankToString(const int rank) const {
        switch (rank)
        {
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            
            default: 
                return std::to_string(rank);
        }
    }

    PlayingCard(const std::string suit, const int rank) {
        suit_ = suit;
        rank_ = rank;
    }

    int value() const override {
        return rank_;
    }

    void print(std::ostream& os) const override {
        os << rankToString(rank_) << " of " << suit_;
    }
};