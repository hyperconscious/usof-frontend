# USOF Frontend

## Overview
The USOF Frontend is the client-side application that interacts with the USOF API. Built using React, Redux, React Router, React Hook Form, and styled with Tailwind CSS, this app provides a user-friendly interface for managing posts, comments, likes, and more. It supports JWT-based authentication for secure login, as well as features such as pagination, filtering, and sorting of posts.

## Table of Contents
- [USOF Frontend](#usof-frontend)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation and Setup](#installation-and-setup)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features
- User authentication with JWT
- Manage posts, comments, and likes
- Pagination, filtering, and sorting of posts
- Responsive design with Tailwind CSS
- Form handling with React Hook Form
- State management with Redux

## Installation and Setup
1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/usof-frontend.git
  ```
2. Navigate to the project directory:
  ```bash
  cd usof-frontend
  ```
3. Install the dependencies:
  ```bash
  npm install
  ```
4. Create a `.env` file in the root directory and add the following environment variables:
  ```plaintext
  REACT_APP_API_URL=http://localhost:5000
  ```
5. Start the development server:
  ```bash
  npm run dev
  ```

## Usage
Once the development server is running, you can access the application at `http://localhost:5173`. You can log in using your credentials and start managing posts, comments, and likes.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the code style and include tests for any new features or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgements
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
