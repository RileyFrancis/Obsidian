#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
    std::vector<int> vec = {1,2,3,4,5};
    std::cout << vec[2] << std::endl;
    std::cout << vec.size() << std::endl;

    vec.push_back(6);
    std::cout << vec.size() << std::endl;

    for (int i : vec) {
        std::cout << i;
    }
    std::cout << std::endl;

    std::cout << vec.capacity() << std::endl;

    for (int i = 7; i < 12; i++) {
        vec.push_back(i);
    }
    std::cout << vec.size() << std::endl;
    std::cout << vec.capacity() << std::endl;

    return 0;
}
