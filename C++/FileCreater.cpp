#include <iostream>
#include <string>
#include <fstream>

int main() {
    bool exit = false; // whether the application should keep running or exit

    while (!exit) {
        std::string name;      // the name of the file (path included)
        std::string content;   // the content of the file
        std::ofstream outfile;

        int option;

        std::cout << "Menu:\n";   //"cout" means character output
        std::cout << "[1] Create a new file\n";
        std::cout << "[2] Exit\n";

        std::cout << "FileCreator> Please choose an option: ";
        std::cin >> option;  //"cin" is character input

        switch (option) {
            case 1:
                // Get the file name from user
                std::cout << "FileCreator> Enter the name of the file: ";
                std::cin >> name;

                // Get the file content from user
                std::cin.ignore();
                std::cout << "FileCreator> Enter the content of the file: ";
                std::getline(std::cin, content);

                // Create the file...
                outfile.open(name);
                outfile << content << std::endl;
                outfile.close();

                std::cout << "The file was created successfully!\n";
                break;
            
            case 2:
                std::cout << "Exiting out of the application...\n";
                exit = true;
                break;

            default:
                std::cout << "Invalid option. Please try again.\n";
        }
    }

    return 0;
}
