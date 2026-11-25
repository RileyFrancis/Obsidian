#include <iostream>
#include <string>
#include <cctype>

using std::string;


string alter_case(string& input) {
    int idx = 0;
    for (char& c : input) {
        if (idx % 2 == 0)
            c = std::toupper(c);
        idx++;
    }
    return input;
}


int main() {
    string input = "hello world";
    //alter_case(input);

    std::cout << alter_case(input) << std::endl;
}
