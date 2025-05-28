# CS_Final_Project
An encrypted login and signup page with a small dashboard that contains a random quote generator and a weather app

___________________________________

**Encryption with login and signup**

This project is a login and signup page that 
encrypts the data that is inputted by the user and 
decrypts when outputting the information.

*Note: Hypertext Markup Language will be referred to as HTML, 
Cascading Style Sheets will be referred to as CSS and 
Javascript will be referred to as JS*




**About the Project**

**A Brief description**
This project is intended to provide a login base for any application with encrypted data transfer and safe handling. The encrypted information is stored inside of the firebase database where API calls are made to retrieve the information and is decrypted in the process. The project uses a caesar cipher to encrypt the data and reverses the cipher to decrypt it. When the data is stored inside of the database, none of the user information is revealed to even the operator because it is encrypted. 

**Usage**
The goal of this project is to provide users with a safe login page that can be used. This is an example of a website that has safe login practices such as encryption, password requirements, shoulder surfing prevention, and prevention of excessive account creation. The login page can be suitable for a number of different websites because it is modifiable to fit any website’s needs.
________________________________

**An explanation of each of the files**
An explanation of each of the files in the format:

|	Name of the file
|	A description of the files
|		Other files linked to it
|		A description of this file



**index.html** 
This file contains HTML for the login page. The basic structure of the login and signup page is created here and is linked to the CSS for design and JS for functionality. 

**login.css**
This file contains the code that is responsible for the design and controls the visual representation of index.html including the fonts, colors, layout, spacing, and animations. 

**login.js**
This file contains the code that is responsible for the functionality of index.html and has API calls that link it to the firebase database. This file contains the initialization and usage of functions and variables. The code in this file allows the user to submit their data, and proceed to the next page. 

**dashboard.html**
This file contains the HTML for the dashboard which contains a random quote generator, a display of the user’s information and the weather. It is also linked to CSS and JS. 

**dashboard.css**
This file contains the code that is responsible for the design and controls the visual representation of dashboard.html including the fonts, colors, layout, spacing, and animations. 

**dashboard.js**
This file contains the code that is responsible for the functionality of dashboard.html and has API calls that link it to the firebase database. This file contains the initialization and usage of functions and variables. This file fetches information from the firestore database to display the users information. It also contains an array of quotes that are randomly chosen to be displayed. For the weather tool, it contains a call to open weather api in order to fetch weather data for each location.

**encrypt.js**
This file contains the javascript code that is responsible for asynchronous functions that encrypt the details of the user in the other files. Since the functions inside of the file are asynchronous, they can be called in other files. This is useful so that I do not have to rewrite the function every time I need to encrypt or decrypt something. 
________________________________

**Features**

**Shoulder surfing prevention**
Malicious actors are unable to shoulder surf using this login page because the password is hidden and shown as dots instead of the typed character. If the user requires, they can click on an icon to reveal their password. 

**Encryption of Data**
Data that is being stored by the application is encrypted beforehand to prevent safety issues and boost security. 

**Password Requirements**
Password requirements are also in place to prevent weak and easy to hack passwords so that malicious actors cannot easily steal your information. 

**Prevention of multiple accounts with the same username**
Users are unable to create multiple accounts with the same email address so that the database does not overload with information and crash the website. 
________________________________
