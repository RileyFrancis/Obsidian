#include <iostream>
#include "vector.h"
#include <string>
#include <fstream>
#include <unordered_map>
#include <unordered_set>
#include "fraction.h"

/**
 * This function is for Quiz: Pointers on slide 595
 */
int* create_reversed_copy(int* arr, int size) {
    int* reversed = new int[size];

    for (size_t i = 0; i < size; i++) {
        reversed[i] = arr[size - i - 1];
    }
    
    return reversed;
}

/**
 * 684
 */
int sum_chars(const std::string& s) {
    int sum = 0;
    for (char c : s) {
        sum += static_cast<int>(c);
    }
    return sum;
}

int main() {

    // Vector
    // Vector2<int>* v = new Vector2<int>();
    // std::cout << *v << std::endl;
    // *v = *v + Vector2<int>(1,3);

    // Vector2<int>* v2 = new Vector2<int>(5, 8);
    // std::cout << *v2 << std::endl;

    // Vector2<std::string>* v3 = new Vector2<std::string>("abcd", "efgh");
    // std::cout << *v3 << std::endl;

    // std::cout << *v + *v2 << std::endl;

    // 521
    // int num;
    // std::cout << "How many entries do you want to write?";
    // std::cin >> num;
    // std::cin.ignore();

    // std::ofstream file("entries.txt", std::ios::out);
    // if (!file) {
    //     std::cerr << "Failed to read file!";
    //     return 1;
    // }

    // for (int i = 0; i < num; i++) {
    //     std::string line;
    //     std::getline(std::cin, line);

    //     file << line << std::endl;
    // }

    // 595
    // int original[] = {10, 20, 30, 40, 50};
    // int* reversed = create_reversed_copy(original, std::size(original));

    // for (size_t i = 0; i < std::size(original); ++i) {
    //     std::cout << original[i] << ", ";
    // }

    // std::cout << std::endl;

    // for (size_t i = 0; i < std::size(original); ++i) {
    //     std::cout << reversed[i] << ", ";
    // }

    // delete[] reversed;

    // std::cout << std::endl;

    // =================================================
    // TYPES OF CASTS

    // static_cast:
    // Converts between types

    // const_cast:
    // Adds or removes const from a variable

    // reinterpret_cast:
    // Literally just interprets one type as another without changing the raw data at all
    // i.e. int -> char literally just interprets the same bits as a character. DANGER!

    // dynamic_cast:
    // Casts in class heirarchy

    // p682
    // std::string str = "this is a string";
    // int i = 0;
    // for (char& c : str) {
    //     c = i++ % 2 ? std::tolower(c) : std::toupper(c);
    // }
    // std::cout << str << std::endl;

    // p684
    // std::string str = "ABC";
    // std::cout << sum_chars(str) << std::endl;

    // p696
    // std::string str = "This is some text that I can write into a string where the following code will count the occurance of each letter withing it. It will also convert to lowercase automatically and remove spaces and other characters!";
    
    // std::unordered_map<char, int> letters;
    // for (const char& c : str) {
    //     if (std::isalnum(c))
    //         letters[std::tolower(c)] += 1;
    // }

    // for (const auto& pair : letters) {
    //     std::cout << pair.first << " -> " << pair.second << std::endl;
    // }


    // std::unordered_set<int> set;
    // set.insert(5);
    // set.insert(8);

    Fraction* f = new Fraction(3,5);
    Fraction* g = new Fraction(2,3);

    std::cout << *f << std::endl;
    std::cout << *g << std::endl;

    std::cout << *f + *g << std::endl;
    std::cout << *f * *g << std::endl;

    delete f;
    delete g;

    return 0;
}