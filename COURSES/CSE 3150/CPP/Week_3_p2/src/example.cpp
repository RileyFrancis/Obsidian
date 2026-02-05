#include <iostream>
#include <string>

using std::cout, std::endl, std::string;

int main() {
    int age;
    string name;

    cout << "Enter your age ";
    std::cin >> age;
    std::cin.ignore();

    std::getline(std::cin, name);
    cout << "You entered " << name << age << endl;

    return 0;
}
