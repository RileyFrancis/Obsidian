#pragma once
#include "playing_card.h"
#include <string>
#include <ostream>


class FaceCard : public PlayingCard {
    std::string suit_;
    int rank_;
public:
    FaceCard(std::string suit, int rank) : PlayingCard(suit, rank) {}

    void print(std::ostream& os) const override {
        switch (rank_)
        {
        case 1:
            os << "Ace of " << suit_;
            break;
        case 11:
            os << "Jack of " << suit_;
            break;
        case 12:
            os << "Queen of " << suit_;
            break;
        case 13:
            os << "King of " << suit_;
            break;

        default:
            throw std::runtime_error("Invalid card rank!");
        }
    }
};