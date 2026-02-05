#include <iostream>
#include <string>

using std::cout, std::cin, std::endl, std::string;

int main() {
    int age;
    string name;

    cout << "Enter your age and name ";
    cin >> age;
    cin.ignore();

    std::getline(std::cin, name);
    cout << "You entered " << name << age << endl;

    return 0;
}
